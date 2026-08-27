// ============================================================
// Servicio de cupones de descuento. El código se guarda siempre
// en mayúsculas como id del documento. En MODO DEMO viven en
// memoria de la sesión (igual que productos/pedidos).
// ============================================================
import {
  collection, deleteDoc, doc, getDoc, getDocs, setDoc,
} from 'firebase/firestore';
import { MODO_DEMO, db } from '../config/firebase';
import type { Cupon } from '../types';

// Cupón de ejemplo para poder probar el flujo en modo demo
const cuponesDemo: Cupon[] = [
  { codigo: 'BIENVENIDO10', tipo: 'porcentaje', valor: 10, activo: true, descripcion: 'Bienvenida: 10% de descuento' },
];

/** Todos los cupones (solo admin) */
export async function obtenerCupones(): Promise<Cupon[]> {
  if (MODO_DEMO) return [...cuponesDemo];
  const snap = await getDocs(collection(db!, 'cupones'));
  return snap.docs.map((d) => d.data() as Cupon);
}

/** Busca un cupón por código (no distingue mayúsculas/minúsculas) */
export async function obtenerCuponPorCodigo(codigo: string): Promise<Cupon | null> {
  const limpio = codigo.trim().toUpperCase();
  if (!limpio) return null;
  if (MODO_DEMO) return cuponesDemo.find((c) => c.codigo === limpio) ?? null;
  const snap = await getDoc(doc(db!, 'cupones', limpio));
  return snap.exists() ? (snap.data() as Cupon) : null;
}

/** Crea o actualiza un cupón (el código es el id del documento) */
export async function guardarCupon(cupon: Cupon): Promise<void> {
  if (MODO_DEMO) {
    const idx = cuponesDemo.findIndex((c) => c.codigo === cupon.codigo);
    if (idx >= 0) cuponesDemo[idx] = cupon;
    else cuponesDemo.push(cupon);
    return;
  }
  await setDoc(doc(db!, 'cupones', cupon.codigo), cupon);
}

export async function eliminarCupon(codigo: string): Promise<void> {
  if (MODO_DEMO) {
    const idx = cuponesDemo.findIndex((c) => c.codigo === codigo);
    if (idx >= 0) cuponesDemo.splice(idx, 1);
    return;
  }
  await deleteDoc(doc(db!, 'cupones', codigo));
}

/** Un cupón es válido si está activo y no venció */
export function cuponVigente(cupon: Cupon): boolean {
  if (!cupon.activo) return false;
  if (cupon.fechaExpiracion && new Date(cupon.fechaExpiracion).getTime() < Date.now()) return false;
  return true;
}

/**
 * Descuento en CLP para un subtotal dado. Se aplica sobre el subtotal
 * (antes del envío) y nunca supera el propio subtotal.
 */
export function calcularDescuento(cupon: Cupon, subtotal: number): number {
  const bruto = cupon.tipo === 'porcentaje'
    ? Math.round(subtotal * (cupon.valor / 100))
    : cupon.valor;
  return Math.max(0, Math.min(bruto, subtotal));
}
