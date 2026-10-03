// ============================================================
// Cupones de descuento (módulo puro, sin Firebase).
// El SERVIDOR decide el descuento al crear el pedido; el checkout
// solo muestra una vista previa con src/utils/cupones.ts (paridad
// verificada en cupones.test.ts).
// ============================================================

/** Igual a la interfaz Cupon de src/types/index.ts */
export interface Cupon {
  codigo: string;
  tipo: 'porcentaje' | 'monto';
  /** % (1-100) si tipo=porcentaje, o monto CLP si tipo=monto */
  valor: number;
  activo: boolean;
  descripcion?: string;
  /** Fecha ISO de expiración; sin tope si no se define */
  fechaExpiracion?: string;
}

/** Código en mayúsculas: letras, números, guion y guion bajo (3–30) */
const REGEX_CODIGO = /^[A-Z0-9_-]{3,30}$/;

/** Normaliza un código ingresado por el cliente; null si es inválido */
export function normalizarCodigoCupon(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const codigo = valor.trim().toUpperCase();
  return REGEX_CODIGO.test(codigo) ? codigo : null;
}

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

/**
 * Descuento CLP sobre el subtotal (antes del envío). Nunca supera el
 * subtotal ni es negativo.
 */
export function calcularDescuento(cupon: Cupon, subtotal: number): number {
  const bruto = cupon.tipo === 'porcentaje'
    ? Math.round(subtotal * (cupon.valor / 100))
    : Math.round(cupon.valor);
  return Math.max(0, Math.min(bruto, subtotal));
}
