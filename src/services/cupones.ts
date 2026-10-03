// ============================================================
// Servicio de cupones de descuento. El código (mayúsculas) es el id
// del documento en `cupones`. El descuento real lo decide la Cloud
// Function crearPedido; aquí solo se administra y se muestra la
// vista previa del checkout. En MODO DEMO viven en memoria.
// ============================================================
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { MODO_DEMO, db } from '../config/firebase';
import type { Cupon } from '../types';

// Cupón de ejemplo para probar el flujo en modo demo
const cuponesDemo: Cupon[] = [
  { codigo: 'BIENVENIDO10', tipo: 'porcentaje', valor: 10, activo: true, descripcion: 'Bienvenida: 10% de descuento' },
];

/** Mismo formato que acepta el servidor: A-Z, 0-9, guion y guion bajo (3–30) */
export function normalizarCodigoCupon(codigo: string): string | null {
  const limpio = codigo.trim().toUpperCase();
  return /^[A-Z0-9_-]{3,30}$/.test(limpio) ? limpio : null;
}

/** Todos los cupones (solo admin) */
export async function obtenerCupones(): Promise<Cupon[]> {
  if (MODO_DEMO) return [...cuponesDemo];
  const snap = await getDocs(collection(db!, 'cupones'));
  return snap.docs.map((d) => ({ ...(d.data() as Cupon), codigo: d.id }));
}

/** Busca un cupón por código (vista previa del checkout); null si no existe */
export async function obtenerCuponPorCodigo(codigo: string): Promise<Cupon | null> {
  const limpio = normalizarCodigoCupon(codigo);
  if (!limpio) return null;
  if (MODO_DEMO) return cuponesDemo.find((c) => c.codigo === limpio) ?? null;
  const snap = await getDoc(doc(db!, 'cupones', limpio));
  return snap.exists() ? { ...(snap.data() as Cupon), codigo: snap.id } : null;
}

/** Crea o actualiza un cupón (el código es el id del documento) */
export async function guardarCupon(cupon: Cupon): Promise<void> {
  if (MODO_DEMO) {
    const idx = cuponesDemo.findIndex((c) => c.codigo === cupon.codigo);
    if (idx >= 0) cuponesDemo[idx] = cupon;
    else cuponesDemo.push(cupon);
    return;
  }
  // Firestore no acepta undefined
  const datos = Object.fromEntries(Object.entries(cupon).filter(([, v]) => v !== undefined));
  await setDoc(doc(db!, 'cupones', cupon.codigo), datos);
}

export async function eliminarCupon(codigo: string): Promise<void> {
  if (MODO_DEMO) {
    const idx = cuponesDemo.findIndex((c) => c.codigo === codigo);
    if (idx >= 0) cuponesDemo.splice(idx, 1);
    return;
  }
  await deleteDoc(doc(db!, 'cupones', codigo));
}
