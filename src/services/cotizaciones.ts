// ============================================================
// Servicio de cotizaciones formales: creación con folio
// correlativo, seguimiento de estado y generación de PDF.
// ============================================================
import {
  collection, doc, getDocs, orderBy, query, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { MODO_DEMO, db } from '../config/firebase';
import { desglosarIVA } from '../utils/precio';
import type { Cotizacion, EstadoCotizacion, ItemCarrito, Usuario } from '../types';

const cotizacionesDemo: Cotizacion[] = [];
let correlativoDemo = 0;

/** Días de validez de una cotización */
const DIAS_VALIDEZ = 15;

/** Genera el folio COT-AAAA-NNNN */
async function generarFolio(): Promise<string> {
  const anio = new Date().getFullYear();
  let correlativo: number;
  if (MODO_DEMO) {
    correlativo = ++correlativoDemo;
  } else {
    // Correlativo simple basado en el número de cotizaciones del año.
    // Para alta concurrencia conviene moverlo a una transacción/Cloud Function.
    const snap = await getDocs(collection(db!, 'cotizaciones'));
    correlativo = snap.size + 1;
  }
  return `COT-${anio}-${String(correlativo).padStart(4, '0')}`;
}

/** Crea una cotización formal a partir del carrito */
export async function crearCotizacion(
  usuario: Usuario,
  items: ItemCarrito[],
  observaciones?: string,
): Promise<Cotizacion> {
  const total = items.reduce((acc, it) => acc + it.precioUnitario * it.cantidad, 0);
  const { neto, iva } = desglosarIVA(total);
  const ahora = new Date();
  const vence = new Date(ahora.getTime() + DIAS_VALIDEZ * 24 * 60 * 60 * 1000);

  const cotizacion: Cotizacion = {
    id: '',
    uid: usuario.uid,
    folio: await generarFolio(),
    nombreCliente: usuario.nombre,
    emailCliente: usuario.email,
    rut: usuario.rut,
    razonSocial: usuario.razonSocial,
    items,
    neto, iva, total,
    estado: 'enviada',
    fecha: ahora.toISOString(),
    validaHasta: vence.toISOString(),
    observaciones,
  };

  if (MODO_DEMO) {
    cotizacion.id = `demo-${cotizacion.folio}`;
    cotizacionesDemo.push(cotizacion);
    return cotizacion;
  }
  const refDoc = doc(collection(db!, 'cotizaciones'));
  cotizacion.id = refDoc.id;
  const { id: _id, ...datos } = cotizacion;
  await setDoc(refDoc, datos);
  return cotizacion;
}

/** Cotizaciones de un usuario */
export async function obtenerCotizacionesUsuario(uid: string): Promise<Cotizacion[]> {
  if (MODO_DEMO) {
    return cotizacionesDemo.filter((c) => c.uid === uid).sort((a, b) => b.fecha.localeCompare(a.fecha));
  }
  const snap = await getDocs(
    query(collection(db!, 'cotizaciones'), where('uid', '==', uid), orderBy('fecha', 'desc')),
  );
  return snap.docs.map((d) => ({ ...(d.data() as Cotizacion), id: d.id }));
}

/** Todas las cotizaciones (solo admin) */
export async function obtenerTodasLasCotizaciones(): Promise<Cotizacion[]> {
  if (MODO_DEMO) return [...cotizacionesDemo].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const snap = await getDocs(query(collection(db!, 'cotizaciones'), orderBy('fecha', 'desc')));
  return snap.docs.map((d) => ({ ...(d.data() as Cotizacion), id: d.id }));
}

/** Cambia el estado de una cotización (admin) */
export async function actualizarEstadoCotizacion(id: string, estado: EstadoCotizacion): Promise<void> {
  if (MODO_DEMO) {
    const c = cotizacionesDemo.find((x) => x.id === id);
    if (c) c.estado = estado;
    return;
  }
  await updateDoc(doc(db!, 'cotizaciones', id), { estado });
}

/** Etiquetas legibles de estado */
export const ETIQUETAS_ESTADO_COTIZACION: Record<EstadoCotizacion, string> = {
  enviada: 'Enviada',
  aprobada: 'Aprobada',
  convertida: 'Convertida en pedido',
  vencida: 'Vencida',
};
