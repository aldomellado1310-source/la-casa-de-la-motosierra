// ============================================================
// Cloud Functions — La Casa de la Motosierra
//
// - webpayCrear / webpayConfirmar: flujo Webpay Plus (Transbank)
// - mercadoPagoCrear: preferencia de Checkout Pro
// - generarPdfCotizacion: PDF en servidor, guardado en Storage
//
// CREDENCIALES (variables de entorno / secretos de Functions):
//   WEBPAY_COMMERCE_CODE  → código de comercio Transbank (producción)
//   WEBPAY_API_KEY        → API key secreta Transbank (producción)
//   MP_ACCESS_TOKEN       → access token de Mercado Pago
// Sin credenciales se usa el ambiente de INTEGRACIÓN de Transbank
// (tarjetas de prueba) para poder probar el flujo completo.
//
// Configurar con:
//   firebase functions:secrets:set WEBPAY_COMMERCE_CODE
//   firebase functions:secrets:set WEBPAY_API_KEY
//   firebase functions:secrets:set MP_ACCESS_TOKEN
// ============================================================
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import PDFDocument from 'pdfkit';
import {
  Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment, WebpayPlus,
} from 'transbank-sdk';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

admin.initializeApp();
const db = admin.firestore();

// --- Secretos de las pasarelas (placeholders a completar por el cliente) ---
const WEBPAY_COMMERCE_CODE = defineSecret('WEBPAY_COMMERCE_CODE');
const WEBPAY_API_KEY = defineSecret('WEBPAY_API_KEY');
const MP_ACCESS_TOKEN = defineSecret('MP_ACCESS_TOKEN');

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

/** Cabeceras CORS simples para llamadas desde el frontend */
function conCors(res: { set: (k: string, v: string) => void }): void {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Lee el total autoritativo de un pedido desde Firestore.
 * El monto que envía el navegador NUNCA se usa para cobrar:
 * un cliente malicioso podría manipularlo (price tampering).
 */
async function totalDePedido(pedidoId: string): Promise<number | null> {
  const snap = await db.collection('pedidos').doc(pedidoId).get();
  if (!snap.exists) return null;
  const total = (snap.data() as { total?: unknown }).total;
  return typeof total === 'number' && total > 0 ? Math.round(total) : null;
}

/** Descuenta el stock de los items de un pedido. Idempotente (flag stockDescontado). */
async function descontarStockPedido(pedidoRef: FirebaseFirestore.DocumentReference): Promise<void> {
  const snap = await pedidoRef.get();
  if (!snap.exists) return;
  const pedido = snap.data() as {
    items: { productoId: string; cantidad: number }[];
    stockDescontado?: boolean;
  };
  if (pedido.stockDescontado) return;
  const lote = db.batch();
  for (const item of pedido.items) {
    lote.update(db.collection('productos').doc(item.productoId), {
      stock: admin.firestore.FieldValue.increment(-item.cantidad),
    });
  }
  lote.update(pedidoRef, { stockDescontado: true });
  await lote.commit();
}

// ------------------------------------------------------------
// Webpay Plus: crear transacción
// ------------------------------------------------------------
export const webpayCrear = onRequest(
  { secrets: [WEBPAY_COMMERCE_CODE, WEBPAY_API_KEY], region: 'southamerica-west1' },
  async (req, res) => {
    conCors(res);
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    try {
      const { pedidoId, returnUrl } = req.body as { pedidoId: string; returnUrl: string };
      if (!pedidoId || !returnUrl) {
        res.status(400).json({ error: 'Faltan parámetros: pedidoId, returnUrl' });
        return;
      }
      const monto = await totalDePedido(pedidoId);
      if (monto === null) {
        res.status(404).json({ error: 'Pedido no encontrado o sin total válido' });
        return;
      }
      // buyOrder máx. 26 caracteres; sessionId identifica la sesión
      const buyOrder = pedidoId.slice(0, 26);
      const tx = transaccionWebpay();
      const respuesta = await tx.create(buyOrder, `sesion-${Date.now()}`, monto, returnUrl);

      // Asociamos el token al pedido para el commit posterior
      await db.collection('pedidos').doc(pedidoId).update({ referenciaPago: respuesta.token });
      res.json({ url: respuesta.url, token: respuesta.token });
    } catch (e) {
      console.error('webpayCrear:', e);
      res.status(500).json({ error: 'No se pudo crear la transacción Webpay' });
    }
  },
);

// ------------------------------------------------------------
// Webpay Plus: confirmar (commit) transacción
// ------------------------------------------------------------
export const webpayConfirmar = onRequest(
  { secrets: [WEBPAY_COMMERCE_CODE, WEBPAY_API_KEY], region: 'southamerica-west1' },
  async (req, res) => {
    conCors(res);
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    try {
      const { token } = req.body as { token: string };
      if (!token) {
        res.status(400).json({ error: 'Falta el token de la transacción' });
        return;
      }
      const tx = transaccionWebpay();
      const resultado = await tx.commit(token);
      let aprobado = resultado.response_code === 0 && resultado.status === 'AUTHORIZED';

      // Buscamos el pedido asociado al token y actualizamos su estado
      const snap = await db.collection('pedidos').where('referenciaPago', '==', token).limit(1).get();
      let pedidoId = resultado.buy_order as string;
      if (!snap.empty) {
        pedidoId = snap.docs[0].id;
        // El monto autorizado debe coincidir con el total del pedido
        const totalPedido = (snap.docs[0].data() as { total: number }).total;
        aprobado = aprobado && Math.round(resultado.amount) === Math.round(totalPedido);
        await snap.docs[0].ref.update({
          estado: aprobado ? 'pagado' : 'pendiente_pago',
          referenciaPago: aprobado ? String(resultado.authorization_code) : token,
        });
        if (aprobado) await descontarStockPedido(snap.docs[0].ref);
      }
      res.json({
        aprobado,
        pedidoId,
        codigoAutorizacion: resultado.authorization_code,
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
  { secrets: [MP_ACCESS_TOKEN], region: 'southamerica-west1' },
  async (req, res) => {
    conCors(res);
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    try {
      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurado. Ejecuta: firebase functions:secrets:set MP_ACCESS_TOKEN' });
        return;
      }
      const { pedidoId, descripcion, backUrl } = req.body as {
        pedidoId: string; descripcion: string; backUrl: string;
      };
      const monto = await totalDePedido(pedidoId);
      if (monto === null) {
        res.status(404).json({ error: 'Pedido no encontrado o sin total válido' });
        return;
      }
      const cliente = new MercadoPagoConfig({ accessToken });
      const preferencia = await new Preference(cliente).create({
        body: {
          items: [{
            id: pedidoId,
            title: descripcion,
            quantity: 1,
            unit_price: monto,
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
// forjar la URL con status=approved)
// ------------------------------------------------------------
export const mercadoPagoConfirmar = onRequest(
  { secrets: [MP_ACCESS_TOKEN], region: 'southamerica-west1' },
  async (req, res) => {
    conCors(res);
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    try {
      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurado. Ejecuta: firebase functions:secrets:set MP_ACCESS_TOKEN' });
        return;
      }
      const { pedidoId, paymentId } = req.body as { pedidoId: string; paymentId: string };
      if (!pedidoId || !paymentId) {
        res.status(400).json({ error: 'Faltan parámetros: pedidoId, paymentId' });
        return;
      }
      const pedidoRef = db.collection('pedidos').doc(pedidoId);
      const pedidoSnap = await pedidoRef.get();
      if (!pedidoSnap.exists) {
        res.status(404).json({ error: 'Pedido no encontrado' });
        return;
      }
      const totalPedido = (pedidoSnap.data() as { total: number }).total;

      const cliente = new MercadoPagoConfig({ accessToken });
      const pago = await new Payment(cliente).get({ id: paymentId });
      const aprobado = pago.status === 'approved'
        && pago.external_reference === pedidoId
        && Math.round(pago.transaction_amount ?? 0) === Math.round(totalPedido);

      if (aprobado) {
        await pedidoRef.update({ estado: 'pagado', referenciaPago: String(paymentId) });
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
  { region: 'southamerica-west1' },
  async (req, res) => {
    conCors(res);
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
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
      const archivo = admin.storage().bucket().file(`cotizaciones/${cot.folio}.pdf`);
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
