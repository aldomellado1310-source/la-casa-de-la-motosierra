// ============================================================
// Servicio de pedidos: creación, consulta y gestión de estado.
// En MODO DEMO los pedidos viven en memoria de la sesión.
// ============================================================
import {
  collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MODO_DEMO, db, storage } from '../config/firebase';
import type { EstadoPedido, Pedido } from '../types';

// Almacén en memoria para modo demo
const pedidosDemo: Pedido[] = [];

/** Genera un id de pedido legible: PED-20260706-XXXX */
function generarIdPedido(): string {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const azar = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PED-${fecha}-${azar}`;
}

/** Crea un pedido y devuelve su id */
export async function crearPedido(pedido: Omit<Pedido, 'id'>): Promise<string> {
  const id = generarIdPedido();
  if (MODO_DEMO) {
    pedidosDemo.push({ ...pedido, id });
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
    }
    return;
  }
  const datos: Record<string, unknown> = { estado };
  if (referenciaPago) datos.referenciaPago = referenciaPago;
  await updateDoc(doc(db!, 'pedidos', id), datos);
}

/** Sube el comprobante de transferencia y lo asocia al pedido */
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
