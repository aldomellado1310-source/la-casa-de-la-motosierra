// ============================================================
// Servicio de pedidos: creación, consulta y gestión de estado.
// En MODO DEMO los pedidos viven en memoria de la sesión.
// ============================================================
import {
  collection, doc, getDoc, getDocs, orderBy, query, runTransaction, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FUNCTIONS_URL, MODO_DEMO, auth, db, storage } from '../config/firebase';
import { ajustarStock, invalidarCacheProductos, obtenerProducto } from './productos';
import type { EstadoPedido, Pedido } from '../types';

// Almacén en memoria para modo demo
const pedidosDemo: Pedido[] = [];

/**
 * Genera un id de pedido legible: PED-20260706-XXXXXXXX.
 * El id funciona como token del seguimiento público, así que el sufijo
 * usa crypto.getRandomValues (8 caracteres, ~1 billón de combinaciones);
 * un sufijo corto de Math.random sería enumerable por fuerza bruta.
 * (La Cloud Function `crearPedido` genera el mismo formato en el servidor.)
 */
function generarIdPedido(): string {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I: se dicta por teléfono
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const azar = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join('');
  return `PED-${fecha}-${azar}`;
}

/** Quita las claves con valor undefined (Firestore no las acepta) */
function sinIndefinidos<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/**
 * Escribe un pedido directo en Firestore desde el navegador y devuelve su id.
 * Las reglas lo permiten SOLO al admin (p. ej. convertir una cotización) o
 * para pedidos por transferencia (respaldo cuando no hay Cloud Functions).
 * Se envían únicamente los campos de la whitelist de las reglas.
 */
export async function crearPedido(pedido: Omit<Pedido, 'id'>): Promise<string> {
  const id = generarIdPedido();
  if (MODO_DEMO) {
    pedidosDemo.push({ ...pedido, id });
    return id;
  }
  const datos = sinIndefinidos({
    uid: pedido.uid,
    nombreCliente: pedido.nombreCliente,
    emailCliente: pedido.emailCliente,
    items: pedido.items,
    subtotal: pedido.subtotal,
    costoEnvio: pedido.costoEnvio,
    total: pedido.total,
    metodoPago: pedido.metodoPago,
    metodoEnvio: pedido.metodoEnvio,
    direccion: pedido.direccion ? sinIndefinidos(pedido.direccion) : undefined,
    estado: pedido.estado,
    fecha: pedido.fecha,
  });
  await setDoc(doc(db!, 'pedidos', id), datos);
  return id;
}

/** Resultado de crear un pedido desde el checkout */
export interface PedidoCreado {
  id: string;
  /** Total que se cobrará (calculado por el servidor cuando hay functions) */
  total: number;
  subtotal: number;
  costoEnvio: number;
}

/**
 * Crea el pedido del checkout.
 * - Con Cloud Functions (FUNCTIONS_URL): la function `crearPedido` lee
 *   precios y stock desde Firestore y calcula el total; el navegador solo
 *   envía productos, cantidades y datos de entrega. El total devuelto
 *   puede diferir del mostrado si cambió un precio.
 * - Sin functions: solo transferencia (escritura directa; el admin
 *   verifica el monto al validar el comprobante).
 * - MODO_DEMO: en memoria.
 */
export async function crearPedidoCheckout(pedido: Omit<Pedido, 'id'>): Promise<PedidoCreado> {
  const resumen = { total: pedido.total, subtotal: pedido.subtotal, costoEnvio: pedido.costoEnvio };
  if (MODO_DEMO) {
    return { id: await crearPedido(pedido), ...resumen };
  }
  if (!FUNCTIONS_URL) {
    if (pedido.metodoPago !== 'transferencia') {
      throw new Error('Por ahora solo puedes pagar por transferencia bancaria.');
    }
    return { id: await crearPedido(pedido), ...resumen };
  }

  const cabeceras: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = await auth?.currentUser?.getIdToken();
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${FUNCTIONS_URL}/crearPedido`, {
      method: 'POST',
      headers: cabeceras,
      body: JSON.stringify({
        items: pedido.items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
        nombreCliente: pedido.nombreCliente,
        emailCliente: pedido.emailCliente,
        metodoPago: pedido.metodoPago,
        metodoEnvio: pedido.metodoEnvio,
        direccion: pedido.direccion,
      }),
    });
  } catch {
    throw new Error('No pudimos conectarnos. Revisa tu conexión a internet e inténtalo de nuevo.');
  }
  const datos = (await res.json().catch(() => ({}))) as {
    pedidoId?: string; total?: number; subtotal?: number; costoEnvio?: number; error?: string;
  };
  if (!res.ok || !datos.pedidoId || typeof datos.total !== 'number') {
    // 409 = stock o producto no disponible: el servidor manda un mensaje claro
    throw new Error(datos.error ?? 'No se pudo crear el pedido. Inténtalo de nuevo.');
  }
  return {
    id: datos.pedidoId,
    total: datos.total,
    subtotal: datos.subtotal ?? datos.total,
    costoEnvio: datos.costoEnvio ?? 0,
  };
}

/**
 * Busca un pedido por su número para el seguimiento público
 * (sin sesión). El número actúa como token de consulta.
 */
export async function obtenerPedidoPorId(id: string): Promise<Pedido | null> {
  const limpio = id.trim().toUpperCase();
  if (MODO_DEMO) {
    return pedidosDemo.find((p) => p.id.toUpperCase() === limpio) ?? null;
  }
  const snap = await getDoc(doc(db!, 'pedidos', limpio));
  return snap.exists() ? { ...(snap.data() as Pedido), id: snap.id } : null;
}

/** Pedidos de un usuario, más recientes primero */
export async function obtenerPedidosUsuario(uid: string): Promise<Pedido[]> {
  if (MODO_DEMO) {
    return pedidosDemo.filter((p) => p.uid === uid).sort((a, b) => b.fecha.localeCompare(a.fecha));
  }
  const snap = await getDocs(
    query(collection(db!, 'pedidos'), where('uid', '==', uid), orderBy('fecha', 'desc')),
  );
  return snap.docs.map((d) => ({ ...(d.data() as Pedido), id: d.id }));
}

/** Todos los pedidos (solo admin) */
export async function obtenerTodosLosPedidos(): Promise<Pedido[]> {
  if (MODO_DEMO) return [...pedidosDemo].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const snap = await getDocs(query(collection(db!, 'pedidos'), orderBy('fecha', 'desc')));
  return snap.docs.map((d) => ({ ...(d.data() as Pedido), id: d.id }));
}

/** Cambia el estado de un pedido (admin / retorno de pago) */
export async function actualizarEstadoPedido(id: string, estado: EstadoPedido, referenciaPago?: string): Promise<void> {
  if (MODO_DEMO) {
    const p = pedidosDemo.find((x) => x.id === id);
    if (p) {
      p.estado = estado;
      if (referenciaPago) p.referenciaPago = referenciaPago;
    }
    return;
  }
  const datos: Record<string, unknown> = { estado };
  if (referenciaPago) datos.referenciaPago = referenciaPago;
  await updateDoc(doc(db!, 'pedidos', id), datos);
}

/**
 * Descuenta el stock de los items de un pedido. Idempotente: el flag
 * `stockDescontado` evita el doble descuento si se repite la llamada.
 * Nunca deja stock negativo: si no alcanza, queda en 0 y el pedido se
 * marca con `stockInsuficiente` para revisarlo.
 * En modo Firebase solo puede ejecutarlo el admin (reglas de `productos`);
 * los pagos con pasarela lo hacen server-side en las Cloud Functions.
 */
export async function descontarStockPedido(id: string): Promise<void> {
  if (MODO_DEMO) {
    const p = pedidosDemo.find((x) => x.id === id);
    if (!p || p.stockDescontado) return;
    for (const item of p.items) {
      const prod = await obtenerProducto(item.productoId);
      if (!prod) continue;
      if (prod.stock < item.cantidad) p.stockInsuficiente = true;
      await ajustarStock(item.productoId, Math.max(0, prod.stock - item.cantidad));
    }
    p.stockDescontado = true;
    return;
  }
  const refPedido = doc(db!, 'pedidos', id);
  await runTransaction(db!, async (tx) => {
    const snap = await tx.get(refPedido);
    if (!snap.exists()) return;
    const pedido = snap.data() as Pedido;
    if (pedido.stockDescontado) return;
    // Cantidades pedidas por producto (agrupando líneas repetidas)
    const pedidas = new Map<string, number>();
    for (const it of pedido.items) pedidas.set(it.productoId, (pedidas.get(it.productoId) ?? 0) + it.cantidad);
    // En una transacción todas las lecturas van antes de las escrituras
    const lecturas = await Promise.all(
      [...pedidas.keys()].map(async (pid) => ({ pid, snap: await tx.get(doc(db!, 'productos', pid)) })),
    );
    let insuficiente = false;
    for (const { pid, snap: prod } of lecturas) {
      if (!prod.exists()) { insuficiente = true; continue; }
      const stock = (prod.data() as { stock?: number }).stock ?? 0;
      const cantidad = pedidas.get(pid) ?? 0;
      if (stock < cantidad) insuficiente = true;
      tx.update(prod.ref, { stock: Math.max(0, stock - cantidad) });
    }
    tx.update(refPedido, insuficiente ? { stockDescontado: true, stockInsuficiente: true } : { stockDescontado: true });
  });
  invalidarCacheProductos();
}

/**
 * Nombre de archivo seguro para Storage: sin tildes ni espacios, solo
 * [A-Za-z0-9._-], con prefijo de marca de tiempo (empieza con dígito).
 * Formato: `<epochMs>-<nombre-saneado>` (máx. 120 caracteres).
 */
function nombreArchivoSeguro(nombreOriginal: string): string {
  const saneado = nombreOriginal
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/^[._-]+/, '')
    .slice(-90) || 'comprobante';
  return `${Date.now()}-${saneado}`.slice(0, 120);
}

/**
 * Sube el comprobante de transferencia y lo asocia al pedido.
 * Se guarda la RUTA del objeto en Storage (no una URL de descarga):
 * `comprobantes/<pedidoId>/<epochMs>-<nombre-saneado>`. El cliente no
 * tiene permiso de lectura sobre comprobantes/ (solo el admin), así que
 * el panel admin resuelve la URL con getDownloadURL al mostrarlo.
 */
export async function subirComprobante(pedidoId: string, archivo: File): Promise<string> {
  if (MODO_DEMO) {
    console.info(`[DEMO] Comprobante recibido para ${pedidoId}: ${archivo.name}`);
    const p = pedidosDemo.find((x) => x.id === pedidoId);
    if (p) {
      p.comprobanteUrl = `demo://${archivo.name}`;
      p.estado = 'pendiente_validacion';
    }
    return `demo://${archivo.name}`;
  }
  const ruta = `comprobantes/${pedidoId}/${nombreArchivoSeguro(archivo.name)}`;
  await uploadBytes(ref(storage!, ruta), archivo, { contentType: archivo.type || undefined });
  await updateDoc(doc(db!, 'pedidos', pedidoId), {
    comprobanteUrl: ruta,
    estado: 'pendiente_validacion',
  });
  return ruta;
}

/**
 * URL de descarga de un comprobante (solo admin: las reglas de Storage
 * limitan la lectura de comprobantes/). Recibe la ruta ya validada.
 * En demo no hay archivo real: devuelve null.
 */
export async function obtenerUrlComprobante(ruta: string): Promise<string | null> {
  if (MODO_DEMO) return null;
  return getDownloadURL(ref(storage!, ruta));
}

/** Etiquetas legibles de estado de pedido */
export const ETIQUETAS_ESTADO_PEDIDO: Record<EstadoPedido, string> = {
  pendiente_pago: 'Pendiente de pago',
  pendiente_validacion: 'Pendiente de validación',
  pagado: 'Pagado',
  preparando: 'En preparación',
  despachado: 'Despachado',
  listo_retiro: 'Listo para retiro',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};
