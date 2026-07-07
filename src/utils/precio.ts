// Utilidades de precios: formato CLP, tramos de volumen y estado de stock
import type { EstadoStock, Producto, TramoPrecio } from '../types';

/** Formatea un monto en pesos chilenos: 18990 → "$18.990" */
export function formatoCLP(monto: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(monto);
}

/** Devuelve el precio unitario que corresponde a una cantidad según los tramos */
export function precioPorCantidad(tramos: TramoPrecio[], precioBase: number, cantidad: number): number {
  if (!tramos.length) return precioBase;
  const tramo = tramos.find(
    (t) => cantidad >= t.desde && (t.hasta === null || cantidad <= t.hasta),
  );
  return tramo ? tramo.precioUnitario : precioBase;
}

/** Umbral bajo el cual se muestra "Últimas unidades" */
const UMBRAL_ULTIMAS = 5;

/** Deriva el estado de stock para la UI */
export function estadoStock(p: Pick<Producto, 'stock' | 'bajoPedido'>): EstadoStock {
  if (p.stock <= 0) return p.bajoPedido ? 'bajo_pedido' : 'agotado';
  if (p.stock <= UMBRAL_ULTIMAS) return 'ultimas_unidades';
  return 'en_stock';
}

/** Etiqueta legible del estado de stock */
export function etiquetaStock(p: Pick<Producto, 'stock' | 'bajoPedido'>): string {
  switch (estadoStock(p)) {
    case 'en_stock': return `En stock (${p.stock} disp.)`;
    case 'ultimas_unidades': return `Últimas unidades (${p.stock})`;
    case 'bajo_pedido': return 'Bajo pedido';
    case 'agotado': return 'Agotado';
  }
}

/** Precio vigente: el de oferta cuando existe y es menor al base */
export function precioVigente(p: Pick<Producto, 'precio' | 'precioOferta'>): number {
  return p.precioOferta && p.precioOferta < p.precio ? p.precioOferta : p.precio;
}

/** true si el producto está en oferta */
export function enOferta(p: Pick<Producto, 'precio' | 'precioOferta'>): boolean {
  return Boolean(p.precioOferta && p.precioOferta < p.precio);
}

/** Porcentaje de descuento de la oferta, redondeado: "-15%" */
export function porcentajeOferta(p: Pick<Producto, 'precio' | 'precioOferta'>): number {
  if (!enOferta(p)) return 0;
  return Math.round((1 - p.precioOferta! / p.precio) * 100);
}

/** IVA chileno */
export const TASA_IVA = 0.19;

/** Desglosa un total IVA incluido en neto + IVA */
export function desglosarIVA(totalConIva: number): { neto: number; iva: number } {
  const neto = Math.round(totalConIva / (1 + TASA_IVA));
  return { neto, iva: totalConIva - neto };
}
