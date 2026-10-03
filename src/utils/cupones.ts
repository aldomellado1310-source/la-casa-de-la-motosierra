// ============================================================
// Cupones: vista previa del descuento en el checkout.
// El descuento REAL lo calcula la Cloud Function crearPedido
// (functions/src/cupones.ts); ambos deben coincidir — lo verifica
// functions/src/cupones.test.ts.
// ============================================================
import type { Cupon } from '../types';

/** Vigente: activo, con valor en rango y sin vencer */
export function cuponVigente(cupon: Cupon, ahora: Date = new Date()): boolean {
  if (!cupon.activo) return false;
  if (typeof cupon.valor !== 'number' || !Number.isFinite(cupon.valor) || cupon.valor <= 0) return false;
  if (cupon.tipo === 'porcentaje' && cupon.valor > 100) return false;
  if (cupon.fechaExpiracion) {
    const vence = new Date(cupon.fechaExpiracion).getTime();
    if (Number.isNaN(vence) || vence < ahora.getTime()) return false;
  }
  return true;
}

/** Descuento CLP sobre el subtotal (antes del envío), nunca mayor que él */
export function calcularDescuento(cupon: Cupon, subtotal: number): number {
  const bruto = cupon.tipo === 'porcentaje'
    ? Math.round(subtotal * (cupon.valor / 100))
    : Math.round(cupon.valor);
  return Math.max(0, Math.min(bruto, subtotal));
}
