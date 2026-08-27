// ============================================================
// Servicio de pedidos: creación, consulta y gestión de estado.
// En MODO DEMO los pedidos viven en memoria de la sesión.
// ============================================================
import {
  collection, doc, getDoc, getDocs, increment, orderBy, query, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MODO_DEMO, db, storage } from '../config/firebase';
import { ajustarStock, invalidarCacheProductos, obtenerProducto } from './productos';
import type { EstadoPedido, Pedido } from '../types';

// ------------------------------------------------------------
// Almacén en memoria para modo demo, respaldado en sessionStorage.
// Webpay/Mercado Pago/Flow redirigen con window.location.href incluso
// en demo (para simular el flujo real de pasarela con redirección),
// lo que recarga la página y borraría un array puramente en memoria.
// sessionStorage sobrevive esa recarga dentro de la misma pestaña,
// sin persistir entre sesiones distintas (coherente con "modo demo").
// ------------------------------------------------------------
const CLAVE_PEDIDOS_DEMO = 'pedidos-demo-lcm';

function cargarPedidosDemo(): Pedido[] {
  if (typeof sessionStorage === 'undefined') return [];
  try {
    const crudo = sessionStorage.getItem(CLAVE_PEDIDOS_DEMO);
    return crudo ? (JSON.parse(crudo) as Pedido[]) : [];
  } catch {
    return [];
  }
}

function guardarPedidosDemo(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(CLAVE_PEDIDOS_DEMO, JSON.stringify(pedidosDemo));
  } catch {
    // Almacenamiento lleno o no disponible: seguimos funcionando solo en memoria
  }
}

const pedidosDemo: Pedido[] = cargarPedidosDemo();

/**
 * Genera un id de pedido legible: PED-20260706-XXXXXXXX.
 * El id funciona como token del seguimiento público, así que el sufijo
 * usa crypto.getRandomValues (8 caracteres, ~1 billón de combinaciones);
 * un sufijo corto de Math.random sería enumerable por fuerza bruta.
 */
function generarIdPedido(): string {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I: se dicta por teléfono
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const azar = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join('');
  return `PED-${fecha}-${azar}`;
}

/** Crea un pedido y devuelve su id */
export async function crearPedido(pedido: Omit<Pedido, 'id'>): Promise<string> {
  const id = generarIdPedido();
  if (MODO_DEMO) {
    pedidosDemo.push({ ...pedido, id });
    guardarPedidosDemo();
    return id;
  }
  await setDoc(doc(db!, 'pedidos', id), pedido);
  return id;
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
      guardarPedidosDemo();
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
 * En modo Firebase solo puede ejecutarlo el admin (reglas de `productos`);
 * los pagos con pasarela lo hacen server-side en las Cloud Functions.
 */
export async function descontarStockPedido(id: string): Promise<void> {
  if (MODO_DEMO) {
    const p = pedidosDemo.find((x) => x.id === id);
    if (!p || p.stockDescontado) return;
    for (const item of p.items) {
      const prod = await obtenerProducto(item.productoId);
      if (prod) await ajustarStock(item.productoId, Math.max(0, prod.stock - item.cantidad));
    }
    p.stockDescontado = true;
    guardarPedidosDemo();
    return;
  }
  const refPedido = doc(db!, 'pedidos', id);
  const snap = await getDoc(refPedido);
  if (!snap.exists()) return;
  const pedido = snap.data() as Pedido;
  if (pedido.stockDescontado) return;
  const lote = writeBatch(db!);
  for (const item of pedido.items) {
    lote.update(doc(db!, 'productos', item.productoId), { stock: increment(-item.cantidad) });
  }
  lote.update(refPedido, { stockDescontado: true });
  await lote.commit();
  invalidarCacheProductos();
}

/** Sube el comprobante de transferencia y lo asocia al pedido */
export async function subirComprobante(pedidoId: string, archivo: File): Promise<string> {
  if (MODO_DEMO) {
    console.info(`[DEMO] Comprobante recibido para ${pedidoId}: ${archivo.name}`);
    const p = pedidosDemo.find((x) => x.id === pedidoId);
    if (p) {
      p.comprobanteUrl = `demo://${archivo.name}`;
      p.estado = 'pendiente_validacion';
      guardarPedidosDemo();
    }
    return `demo://${archivo.name}`;
  }
  const rutaStorage = ref(storage!, `comprobantes/${pedidoId}/${archivo.name}`);
  await uploadBytes(rutaStorage, archivo);
  const url = await getDownloadURL(rutaStorage);
  await updateDoc(doc(db!, 'pedidos', pedidoId), {
    comprobanteUrl: url,
    estado: 'pendiente_validacion',
  });
  return url;
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
