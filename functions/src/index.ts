// ============================================================
// Cloud Functions — La Casa de la Motosierra
//
// - crearPedido: crea el pedido con precios y total calculados en el
//   SERVIDOR (el navegador solo envía productoId + cantidad)
// - webpayCrear / webpayConfirmar: flujo Webpay Plus (Transbank)
// - mercadoPagoCrear / mercadoPagoConfirmar: Checkout Pro
// - generarPdfCotizacion: PDF en servidor, guardado en Storage
//
// CREDENCIALES (secretos de Functions):
//   WEBPAY_COMMERCE_CODE  → código de comercio Transbank (producción)
//   WEBPAY_API_KEY        → API key secreta Transbank (producción)
//   MP_ACCESS_TOKEN       → access token de Mercado Pago
// Sin credenciales se usa el ambiente de INTEGRACIÓN de Transbank
// (tarjetas de prueba) para poder probar el flujo completo.
//
// PARÁMETROS (no secretos):
//   ORIGENES_PERMITIDOS   → orígenes del frontend aceptados para CORS
//                           y para armar las URLs de retorno de pago
//
// Configurar con:
//   firebase functions:secrets:set WEBPAY_COMMERCE_CODE
//   firebase functions:secrets:set WEBPAY_API_KEY
//   firebase functions:secrets:set MP_ACCESS_TOKEN
// ============================================================
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore, type DocumentReference } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { randomBytes } from 'node:crypto';
import PDFDocument from 'pdfkit';
import {
  Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment, WebpayPlus,
} from 'transbank-sdk';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import {
  calcularDescuentoStock, calcularPedido, generarIdPedido, validarSolicitudPedido,
  type MetodoPago, type ProductoServidor, type TramoPrecio,
} from './calculoPedido';
import { origenPermitido, origenRetorno } from './origenes';

initializeApp();
const db = getFirestore();

// --- Secretos de las pasarelas (placeholders a completar por el cliente) ---
const WEBPAY_COMMERCE_CODE = defineSecret('WEBPAY_COMMERCE_CODE');
const WEBPAY_API_KEY = defineSecret('WEBPAY_API_KEY');
const MP_ACCESS_TOKEN = defineSecret('MP_ACCESS_TOKEN');

// --- Lista blanca de orígenes del frontend (CORS + URLs de retorno) ---
// String separado por comas (en functions/.env o al desplegar):
//   ORIGENES_PERMITIDOS=https://midominio.cl,https://la-casa-de-la-motosierra.web.app
// El PRIMERO es el que se usa para el retorno de pago si el request no
// trae un Origin permitido.
const ORIGENES_PERMITIDOS = defineString('ORIGENES_PERMITIDOS', {
  default: [
    'https://la-casa-de-la-motosierra.web.app',
    'https://la-casa-de-la-motosierra.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:4173',
  ].join(','),
  description: 'Orígenes del frontend aceptados (CORS y retorno de pagos), separados por coma',
});

/** Lista blanca ya separada */
function origenesPermitidos(): string[] {
  return ORIGENES_PERMITIDOS.value().split(',').map((o) => o.trim()).filter(Boolean);
}

/** Opciones comunes de todas las functions HTTP */
const OPCIONES_BASE = { region: 'southamerica-west1', maxInstances: 10 } as const;

/** Formato del id de pedido: PED-AAAAMMDD-XXXXXXXX */
const REGEX_ID_PEDIDO = /^PED-\d{8}-[A-Z0-9]{8}$/;

/** Estados en que el pedido ya quedó pagado (o avanzó después del pago) */
const ESTADOS_PAGADOS = ['pagado', 'preparando', 'despachado', 'listo_retiro', 'entregado'];

/** Construye la transacción Webpay: producción si hay secretos, integración si no */
function transaccionWebpay(): InstanceType<typeof WebpayPlus.Transaction> {
  const codigo = process.env.WEBPAY_COMMERCE_CODE;
  const apiKey = process.env.WEBPAY_API_KEY;
  if (codigo && apiKey) {
    return new WebpayPlus.Transaction(new Options(codigo, apiKey, Environment.Production));
  }
  // Ambiente de integración de Transbank (tarjetas de prueba)
  return new WebpayPlus.Transaction(
    new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration),
  );
}

// ------------------------------------------------------------
// CORS con lista blanca (CN-007)
// ------------------------------------------------------------
interface SolicitudHttp {
  method: string;
  get(cabecera: string): string | undefined;
}
interface RespuestaHttp {
  set(cabecera: string, valor: string): unknown;
  status(codigo: number): { json(cuerpo: unknown): unknown; send(cuerpo: string): unknown };
}

/**
 * Aplica CORS haciendo eco del Origin SOLO si está en la lista blanca.
 * Devuelve true si la solicitud ya quedó respondida (preflight, origen
 * no permitido o método distinto de POST).
 */
function manejarCors(req: SolicitudHttp, res: RespuestaHttp): boolean {
  const origen = req.get('origin');
  res.set('Vary', 'Origin');
  if (origen) {
    if (!origenPermitido(origen, origenesPermitidos())) {
      res.status(403).json({ error: 'Origen no permitido' });
      return true;
    }
    res.set('Access-Control-Allow-Origin', origen);
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
  }
  if (req.method === 'OPTIONS') { res.status(204).send(''); return true; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Método no permitido' }); return true; }
  return false;
}

/** URL de retorno del pago, armada en el servidor desde la lista blanca */
function urlRetornoPago(req: SolicitudHttp): string {
  return `${origenRetorno(req.get('origin'), origenesPermitidos())}/pago/retorno`;
}

// ------------------------------------------------------------
// Lectura de pedidos
// ------------------------------------------------------------
interface PedidoGuardado {
  uid?: string;
  items: { productoId: string; cantidad: number }[];
  total: number;
  estado: string;
  metodoPago: MetodoPago;
  origen?: string;
  referenciaPago?: string;
  stockDescontado?: boolean;
}

/**
 * Verifica que un pedido pueda iniciar un pago con pasarela: creado
 * por el servidor (total confiable), pendiente de pago y con el medio
 * de pago que se está iniciando (CN-001 / CN-006).
 */
function motivoNoPagable(pedido: PedidoGuardado, medio: MetodoPago): string | null {
  if (pedido.origen !== 'servidor') return 'Este pedido no se puede pagar en línea. Contáctanos por WhatsApp.';
  if (pedido.estado !== 'pendiente_pago') return 'Este pedido ya no está pendiente de pago.';
  if (pedido.metodoPago !== medio) return 'El medio de pago no corresponde a este pedido.';
  if (typeof pedido.total !== 'number' || !(pedido.total > 0)) return 'El pedido no tiene un total válido.';
  return null;
}

/** Lee el id de pedido del body validando su formato */
function leerPedidoId(cuerpo: unknown): string | null {
  const id = (cuerpo as { pedidoId?: unknown } | undefined)?.pedidoId;
  return typeof id === 'string' && REGEX_ID_PEDIDO.test(id) ? id : null;
}

/**
 * Marca el pedido como pagado SOLO si sigue en pendiente_pago
 * (transacción: evita dobles confirmaciones concurrentes).
 */
async function marcarPagado(pedidoRef: DocumentReference, referenciaPago: string): Promise<void> {
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(pedidoRef);
    if (!snap.exists) return;
    const pedido = snap.data() as PedidoGuardado;
    if (pedido.estado !== 'pendiente_pago') return;
    tx.update(pedidoRef, { estado: 'pagado', referenciaPago });
  });
}

/**
 * Descuenta el stock de los items de un pedido en una transacción.
 * Idempotente (flag stockDescontado). Nunca deja stock negativo: si
 * no alcanza, deja 0 y marca `stockInsuficiente: true` para el admin
 * (el pago ya fue cobrado, no se rechaza) — CN-015.
 */
async function descontarStockPedido(pedidoRef: DocumentReference): Promise<void> {
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(pedidoRef);
    if (!snap.exists) return;
    const pedido = snap.data() as PedidoGuardado;
    if (pedido.stockDescontado) return;

    const ids = [...new Set(pedido.items.map((i) => i.productoId))];
    const refs = ids.map((id) => db.collection('productos').doc(id));
    const productos = refs.length ? await tx.getAll(...refs) : [];
    const stockActual = new Map<string, number>();
    for (const p of productos) {
      if (!p.exists) continue;
      const stock = (p.data() as { stock?: unknown }).stock;
      stockActual.set(p.id, typeof stock === 'number' ? stock : 0);
    }
    const { nuevosStocks, insuficiente } = calcularDescuentoStock(pedido.items, stockActual);
    for (const [id, stock] of nuevosStocks) {
      tx.update(db.collection('productos').doc(id), { stock });
    }
    tx.update(pedidoRef, insuficiente
      ? { stockDescontado: true, stockInsuficiente: true }
      : { stockDescontado: true });
  });
}

/** Convierte un documento de `productos` al formato que usa el cálculo */
function aProductoServidor(id: string, datos: Record<string, unknown>): ProductoServidor {
  const numero = (v: unknown, defecto = 0): number => (typeof v === 'number' && Number.isFinite(v) ? v : defecto);
  const tramos: TramoPrecio[] = Array.isArray(datos.preciosPorVolumen)
    ? (datos.preciosPorVolumen as Record<string, unknown>[])
      .filter((t) => typeof t === 'object' && t !== null && typeof t.precioUnitario === 'number')
      .map((t) => ({
        desde: numero(t.desde, 1),
        hasta: typeof t.hasta === 'number' ? t.hasta : null,
        precioUnitario: numero(t.precioUnitario),
      }))
    : [];
  const producto: ProductoServidor = {
    id,
    sku: typeof datos.sku === 'string' ? datos.sku : '',
    nombre: typeof datos.nombre === 'string' ? datos.nombre : id,
    precio: numero(datos.precio),
    stock: numero(datos.stock),
    fotos: Array.isArray(datos.fotos) ? datos.fotos.filter((f): f is string => typeof f === 'string') : [],
    preciosPorVolumen: tramos,
    // Un producto sin precio válido no se vende en línea
    activo: datos.activo !== false && numero(datos.precio) > 0,
    bajoPedido: datos.bajoPedido === true,
  };
  if (typeof datos.precioOferta === 'number' && datos.precioOferta > 0) producto.precioOferta = datos.precioOferta;
  return producto;
}

// ------------------------------------------------------------
// Crear pedido con total calculado en servidor (CN-001 / CN-005)
// ------------------------------------------------------------
export const crearPedido = onRequest(
  { ...OPCIONES_BASE },
  async (req, res) => {
    if (manejarCors(req, res)) return;
    try {
      // Sesión opcional: si viene un ID token, se verifica y se usa su uid
      let uid = 'invitado';
      let emailSesion: string | undefined;
      const cabecera = req.get('authorization') ?? '';
      if (cabecera) {
        const coincide = /^Bearer (.+)$/.exec(cabecera);
        if (!coincide) { res.status(401).json({ error: 'Sesión inválida. Vuelve a ingresar.' }); return; }
        try {
          const decodificado = await getAuth().verifyIdToken(coincide[1]);
          uid = decodificado.uid;
          emailSesion = decodificado.email;
        } catch {
          res.status(401).json({ error: 'Tu sesión expiró. Vuelve a ingresar e inténtalo otra vez.' });
          return;
        }
      }

      const validacion = validarSolicitudPedido(req.body);
      if (!validacion.ok) { res.status(400).json({ error: validacion.error }); return; }
      const solicitud = validacion.datos;

      // Precios y stock SIEMPRE desde Firestore
      const refs = solicitud.items.map((i) => db.collection('productos').doc(i.productoId));
      const snaps = await db.getAll(...refs);
      const productos = new Map<string, ProductoServidor>();
      for (const s of snaps) {
        if (s.exists) productos.set(s.id, aProductoServidor(s.id, s.data() as Record<string, unknown>));
      }
      const calculo = calcularPedido(productos, solicitud.items, solicitud.metodoEnvio, solicitud.direccion?.region);
      if (!calculo.ok) {
        res.status(409).json({ error: calculo.mensaje, codigo: calculo.codigo, productoId: calculo.productoId });
        return;
      }

      const pedido: Record<string, unknown> = {
        uid,
        nombreCliente: solicitud.nombreCliente,
        emailCliente: emailSesion ?? solicitud.emailCliente,
        items: calculo.items,
        subtotal: calculo.subtotal,
        costoEnvio: calculo.costoEnvio,
        total: calculo.total,
        metodoPago: solicitud.metodoPago,
        metodoEnvio: solicitud.metodoEnvio,
        estado: 'pendiente_pago',
        fecha: new Date().toISOString(),
        origen: 'servidor',
      };
      if (solicitud.direccion) pedido.direccion = solicitud.direccion;

      // create() falla si el id ya existe: reintentamos con otro sufijo
      for (let intento = 0; intento < 3; intento++) {
        const pedidoId = generarIdPedido();
        try {
          await db.collection('pedidos').doc(pedidoId).create(pedido);
          res.json({ pedidoId, total: calculo.total, subtotal: calculo.subtotal, costoEnvio: calculo.costoEnvio });
          return;
        } catch (e) {
          if ((e as { code?: number }).code !== 6) throw e; // 6 = ALREADY_EXISTS
        }
      }
      res.status(500).json({ error: 'No se pudo crear el pedido. Inténtalo de nuevo.' });
    } catch (e) {
      console.error('crearPedido:', e);
      res.status(500).json({ error: 'No se pudo crear el pedido. Inténtalo de nuevo.' });
    }
  },
);

// ------------------------------------------------------------
// Webpay Plus: crear transacción
// ------------------------------------------------------------
export const webpayCrear = onRequest(
  { ...OPCIONES_BASE, secrets: [WEBPAY_COMMERCE_CODE, WEBPAY_API_KEY] },
  async (req, res) => {
    if (manejarCors(req, res)) return;
    try {
      const pedidoId = leerPedidoId(req.body);
      if (!pedidoId) { res.status(400).json({ error: 'Falta el número de pedido' }); return; }
      const pedidoRef = db.collection('pedidos').doc(pedidoId);
      const snap = await pedidoRef.get();
      if (!snap.exists) { res.status(404).json({ error: 'Pedido no encontrado' }); return; }
      const pedido = snap.data() as PedidoGuardado;
      const motivo = motivoNoPagable(pedido, 'webpay');
      if (motivo) { res.status(409).json({ error: motivo }); return; }

      // buyOrder máx. 26 caracteres; sessionId aleatorio por intento
      const buyOrder = pedidoId.slice(0, 26);
      const sesion = randomBytes(12).toString('hex');
      const tx = transaccionWebpay();
      const respuesta = await tx.create(buyOrder, sesion, Math.round(pedido.total), urlRetornoPago(req));

      // Se agrega el token a la lista de intentos (no se pisa ninguna
      // referencia previa) para ubicar el pedido en el commit
      await pedidoRef.update({ intentosPago: FieldValue.arrayUnion(String(respuesta.token)) });
      res.json({ url: respuesta.url, token: respuesta.token });
    } catch (e) {
      console.error('webpayCrear:', e);
      res.status(500).json({ error: 'No se pudo crear la transacción Webpay' });
    }
  },
);

// ------------------------------------------------------------
// Webpay Plus: confirmar (commit) transacción — idempotente
// ------------------------------------------------------------
export const webpayConfirmar = onRequest(
  { ...OPCIONES_BASE, secrets: [WEBPAY_COMMERCE_CODE, WEBPAY_API_KEY] },
  async (req, res) => {
    if (manejarCors(req, res)) return;
    try {
      const token = (req.body as { token?: unknown } | undefined)?.token;
      if (typeof token !== 'string' || !token || token.length > 128) {
        res.status(400).json({ error: 'Falta el token de la transacción' });
        return;
      }
      // Ubicamos el pedido por su lista de intentos de pago
      const consulta = await db.collection('pedidos').where('intentosPago', 'array-contains', token).limit(1).get();
      if (consulta.empty) {
        // Token desconocido: no se confirma (no cobrar algo sin pedido)
        res.status(404).json({ aprobado: false, error: 'No encontramos el pedido de este pago' });
        return;
      }
      const pedidoRef = consulta.docs[0].ref;
      const pedidoId = pedidoRef.id;

      /** Respuesta con los datos ya guardados si el pedido está pagado */
      const respuestaSiPagado = async (): Promise<boolean> => {
        const actual = (await pedidoRef.get()).data() as PedidoGuardado | undefined;
        if (actual && ESTADOS_PAGADOS.includes(actual.estado)) {
          res.json({ aprobado: true, pedidoId, codigoAutorizacion: actual.referenciaPago, monto: actual.total });
          return true;
        }
        return false;
      };

      // Idempotencia: recarga de la página de retorno o doble llamada
      if (await respuestaSiPagado()) return;

      const pedido = consulta.docs[0].data() as PedidoGuardado;
      let resultado: Awaited<ReturnType<InstanceType<typeof WebpayPlus.Transaction>['commit']>>;
      try {
        resultado = await transaccionWebpay().commit(token);
      } catch (e) {
        // Un commit concurrente pudo haberlo confirmado ya
        if (await respuestaSiPagado()) return;
        throw e;
      }
      const aprobado = resultado.response_code === 0
        && resultado.status === 'AUTHORIZED'
        && resultado.buy_order === pedidoId.slice(0, 26)
        && Math.round(resultado.amount) === Math.round(pedido.total);

      if (aprobado) {
        await marcarPagado(pedidoRef, String(resultado.authorization_code));
        await descontarStockPedido(pedidoRef);
      } else {
        console.warn('webpayConfirmar: pago no aprobado o monto distinto', pedidoId, resultado.status, resultado.amount);
      }
      res.json({
        aprobado,
        pedidoId,
        codigoAutorizacion: aprobado ? resultado.authorization_code : undefined,
        monto: resultado.amount,
      });
    } catch (e) {
      console.error('webpayConfirmar:', e);
      res.status(500).json({ error: 'No se pudo confirmar la transacción Webpay' });
    }
  },
);

// ------------------------------------------------------------
// Mercado Pago: crear preferencia (Checkout Pro con cuotas)
// ------------------------------------------------------------
export const mercadoPagoCrear = onRequest(
  { ...OPCIONES_BASE, secrets: [MP_ACCESS_TOKEN] },
  async (req, res) => {
    if (manejarCors(req, res)) return;
    try {
      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        console.error('MP_ACCESS_TOKEN no configurado. Ejecuta: firebase functions:secrets:set MP_ACCESS_TOKEN');
        res.status(500).json({ error: 'Mercado Pago no está disponible por ahora' });
        return;
      }
      const pedidoId = leerPedidoId(req.body);
      if (!pedidoId) { res.status(400).json({ error: 'Falta el número de pedido' }); return; }
      const pedidoRef = db.collection('pedidos').doc(pedidoId);
      const snap = await pedidoRef.get();
      if (!snap.exists) { res.status(404).json({ error: 'Pedido no encontrado' }); return; }
      const pedido = snap.data() as PedidoGuardado;
      const motivo = motivoNoPagable(pedido, 'mercadopago');
      if (motivo) { res.status(409).json({ error: motivo }); return; }

      const backUrl = urlRetornoPago(req);
      const cliente = new MercadoPagoConfig({ accessToken });
      const preferencia = await new Preference(cliente).create({
        body: {
          items: [{
            id: pedidoId,
            // Descripción armada en el servidor (no viene del navegador)
            title: `Pedido ${pedidoId} — La Casa de la Motosierra`,
            quantity: 1,
            unit_price: Math.round(pedido.total),
            currency_id: 'CLP',
          }],
          external_reference: pedidoId,
          back_urls: {
            success: `${backUrl}?status=approved&pedido=${pedidoId}`,
            failure: `${backUrl}?status=failure&pedido=${pedidoId}`,
            pending: `${backUrl}?status=pending&pedido=${pedidoId}`,
          },
          auto_return: 'approved',
        },
      });
      if (preferencia.id) {
        await pedidoRef.update({ intentosPago: FieldValue.arrayUnion(String(preferencia.id)) });
      }
      res.json({ initPoint: preferencia.init_point });
    } catch (e) {
      console.error('mercadoPagoCrear:', e);
      res.status(500).json({ error: 'No se pudo crear la preferencia de Mercado Pago' });
    }
  },
);

// ------------------------------------------------------------
// Mercado Pago: confirmar pago verificándolo con la API de MP
// (el retorno del navegador NO es confiable: cualquiera puede
// forjar la URL con status=approved). Idempotente.
// ------------------------------------------------------------
export const mercadoPagoConfirmar = onRequest(
  { ...OPCIONES_BASE, secrets: [MP_ACCESS_TOKEN] },
  async (req, res) => {
    if (manejarCors(req, res)) return;
    try {
      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        console.error('MP_ACCESS_TOKEN no configurado. Ejecuta: firebase functions:secrets:set MP_ACCESS_TOKEN');
        res.status(500).json({ error: 'Mercado Pago no está disponible por ahora' });
        return;
      }
      const pedidoId = leerPedidoId(req.body);
      const paymentId = (req.body as { paymentId?: unknown } | undefined)?.paymentId;
      if (!pedidoId || (typeof paymentId !== 'string' && typeof paymentId !== 'number') || !/^\d{1,30}$/.test(String(paymentId))) {
        res.status(400).json({ error: 'Faltan parámetros: pedidoId, paymentId' });
        return;
      }
      const pedidoRef = db.collection('pedidos').doc(pedidoId);
      const pedidoSnap = await pedidoRef.get();
      if (!pedidoSnap.exists) {
        res.status(404).json({ error: 'Pedido no encontrado' });
        return;
      }
      const pedido = pedidoSnap.data() as PedidoGuardado;
      // Idempotencia: ya confirmado antes
      if (ESTADOS_PAGADOS.includes(pedido.estado)) {
        res.json({ aprobado: true, pedidoId });
        return;
      }
      // Solo pedidos con total calculado por el servidor
      if (pedido.origen !== 'servidor' || pedido.metodoPago !== 'mercadopago') {
        res.status(409).json({ aprobado: false, error: 'Este pedido no se puede pagar con Mercado Pago' });
        return;
      }

      const cliente = new MercadoPagoConfig({ accessToken });
      const pago = await new Payment(cliente).get({ id: String(paymentId) });
      const aprobado = pago.status === 'approved'
        && pago.external_reference === pedidoId
        && pago.currency_id === 'CLP'
        && Math.round(pago.transaction_amount ?? 0) === Math.round(pedido.total);

      if (aprobado) {
        await marcarPagado(pedidoRef, String(paymentId));
        await descontarStockPedido(pedidoRef);
      }
      res.json({ aprobado, pedidoId });
    } catch (e) {
      console.error('mercadoPagoConfirmar:', e);
      res.status(500).json({ error: 'No se pudo verificar el pago con Mercado Pago' });
    }
  },
);

// ------------------------------------------------------------
// PDF de cotización en servidor → Storage → pdfUrl
// ------------------------------------------------------------
export const generarPdfCotizacion = onRequest(
  { ...OPCIONES_BASE },
  async (req, res) => {
    if (manejarCors(req, res)) return;
    try {
      const { cotizacionId } = req.body as { cotizacionId: string };
      const snap = await db.collection('cotizaciones').doc(cotizacionId).get();
      if (!snap.exists) {
        res.status(404).json({ error: 'Cotización no encontrada' });
        return;
      }
      const cot = snap.data() as {
        folio: string; fecha: string; validaHasta: string;
        nombreCliente: string; emailCliente: string; rut?: string; razonSocial?: string;
        items: { sku: string; nombre: string; cantidad: number; precioUnitario: number }[];
        neto: number; iva: number; total: number; observaciones?: string;
      };

      const clp = (n: number) => `$${n.toLocaleString('es-CL')}`;
      const pdf = new PDFDocument({ size: 'LETTER', margin: 50 });
      const trozos: Buffer[] = [];
      pdf.on('data', (c: Buffer) => trozos.push(c));
      const terminado = new Promise<Buffer>((resolver) => pdf.on('end', () => resolver(Buffer.concat(trozos))));

      // Encabezado
      pdf.rect(0, 0, 612, 80).fill('#2E5339');
      pdf.fill('#F7F5F0').fontSize(18).font('Helvetica-Bold')
        .text('LA CASA DE LA MOTOSIERRA', 50, 25);
      pdf.fontSize(9).font('Helvetica')
        .text('Repuestos y maquinaria forestal · Teniente Merino 500, Puerto Aysén', 50, 50);
      pdf.rect(430, 20, 132, 40).fill('#E07A2F');
      pdf.fill('#FFFFFF').fontSize(11).font('Helvetica-Bold')
        .text('COTIZACIÓN', 430, 28, { width: 132, align: 'center' })
        .text(cot.folio, 430, 42, { width: 132, align: 'center' });

      // Datos del cliente
      pdf.fill('#2B2B2B').fontSize(10).font('Helvetica-Bold').text('CLIENTE', 50, 100);
      pdf.font('Helvetica')
        .text(cot.razonSocial ?? cot.nombreCliente, 50, 115)
        .text(cot.rut ? `RUT: ${cot.rut}` : '', 50, 128)
        .text(cot.emailCliente, 50, 141);
      pdf.font('Helvetica-Bold').text('DETALLE', 350, 100);
      pdf.font('Helvetica')
        .text(`Emisión: ${new Date(cot.fecha).toLocaleDateString('es-CL')}`, 350, 115)
        .text(`Válida hasta: ${new Date(cot.validaHasta).toLocaleDateString('es-CL')}`, 350, 128);

      // Tabla de ítems
      let y = 175;
      pdf.rect(50, y, 512, 20).fill('#2E5339');
      pdf.fill('#F7F5F0').fontSize(9).font('Helvetica-Bold');
      pdf.text('SKU', 55, y + 6).text('Producto', 140, y + 6)
        .text('Cant.', 380, y + 6).text('P. Unit.', 425, y + 6).text('Subtotal', 495, y + 6);
      y += 20;
      pdf.font('Helvetica').fill('#2B2B2B');
      for (const it of cot.items) {
        pdf.text(it.sku, 55, y + 5, { width: 80 })
          .text(it.nombre, 140, y + 5, { width: 230 })
          .text(String(it.cantidad), 380, y + 5)
          .text(clp(it.precioUnitario), 425, y + 5)
          .text(clp(it.precioUnitario * it.cantidad), 495, y + 5);
        y += 22;
      }

      // Totales
      y += 10;
      pdf.text(`Neto: ${clp(cot.neto)}`, 420, y);
      pdf.text(`IVA (19%): ${clp(cot.iva)}`, 420, y + 14);
      pdf.font('Helvetica-Bold').fill('#E07A2F').fontSize(12)
        .text(`TOTAL: ${clp(cot.total)}`, 420, y + 30);

      if (cot.observaciones) {
        pdf.fill('#2B2B2B').fontSize(9).font('Helvetica-Bold').text('Observaciones:', 50, y + 60);
        pdf.font('Helvetica').text(cot.observaciones, 50, y + 74, { width: 500 });
      }
      pdf.end();

      // Guardar en Storage y publicar la URL en la cotización
      const buffer = await terminado;
      const archivo = getStorage().bucket().file(`cotizaciones/${cot.folio}.pdf`);
      await archivo.save(buffer, { contentType: 'application/pdf' });
      const [url] = await archivo.getSignedUrl({ action: 'read', expires: '2100-01-01' });
      await snap.ref.update({ pdfUrl: url });
      res.json({ pdfUrl: url });
    } catch (e) {
      console.error('generarPdfCotizacion:', e);
      res.status(500).json({ error: 'No se pudo generar el PDF' });
    }
  },
);
