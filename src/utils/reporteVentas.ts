// ============================================================
// Reporte mensual de ventas (módulo puro, sin Firebase).
// Base para cobrar la comisión mensual del sitio: muestra el total
// con y sin IVA, con y sin envío, para elegir la base acordada.
// ============================================================
import { desglosarIVA } from './precio';
import type { MetodoPago, Pedido } from '../types';

/** Campos del pedido que usa el reporte */
export type VentaReporte = Pick<
  Pedido,
  'id' | 'fecha' | 'fechaPago' | 'nombreCliente' | 'metodoPago' | 'estado' | 'subtotal' | 'costoEnvio' | 'descuento' | 'total'
>;

export interface ResumenVentas {
  pedidos: number;
  /** Lo que pagaron los clientes (incluye IVA y envío, ya con descuentos) */
  totalConIva: number;
  neto: number;
  iva: number;
  envio: number;
  descuentos: number;
  /** Total sin el envío (solo productos, con IVA) */
  productosConIva: number;
  ticketPromedio: number;
  porMedio: Partial<Record<MetodoPago, { pedidos: number; total: number }>>;
}

export type BaseComision = 'total_con_iva' | 'total_neto' | 'productos_con_iva' | 'productos_neto';

export const ETIQUETAS_BASE: Record<BaseComision, string> = {
  total_con_iva: 'Total cobrado (con IVA y envío)',
  total_neto: 'Total neto (sin IVA, con envío)',
  productos_con_iva: 'Solo productos (con IVA, sin envío)',
  productos_neto: 'Solo productos neto (sin IVA ni envío)',
};

export function resumirVentas(ventas: readonly VentaReporte[]): ResumenVentas {
  const porMedio: ResumenVentas['porMedio'] = {};
  let totalConIva = 0;
  let envio = 0;
  let descuentos = 0;
  for (const v of ventas) {
    totalConIva += v.total;
    envio += v.costoEnvio;
    descuentos += v.descuento ?? 0;
    const medio = porMedio[v.metodoPago] ?? { pedidos: 0, total: 0 };
    medio.pedidos += 1;
    medio.total += v.total;
    porMedio[v.metodoPago] = medio;
  }
  const { neto, iva } = desglosarIVA(totalConIva);
  return {
    pedidos: ventas.length,
    totalConIva,
    neto,
    iva,
    envio,
    descuentos,
    productosConIva: totalConIva - envio,
    ticketPromedio: ventas.length ? Math.round(totalConIva / ventas.length) : 0,
    porMedio,
  };
}

/** Monto sobre el que se calcula la comisión, según la base acordada */
export function baseComision(r: ResumenVentas, base: BaseComision): number {
  switch (base) {
    case 'total_con_iva': return r.totalConIva;
    case 'total_neto': return r.neto;
    case 'productos_con_iva': return r.productosConIva;
    case 'productos_neto': return desglosarIVA(r.productosConIva).neto;
  }
}

/** Comisión en CLP redondeada al peso; un porcentaje inválido da 0 */
export function calcularComision(base: number, porcentaje: number): number {
  if (!Number.isFinite(porcentaje) || porcentaje <= 0) return 0;
  return Math.round(base * (porcentaje / 100));
}

/** Diferencia (minutos) entre la hora de Santiago y UTC en un instante */
function desfaseSantiagoMin(instante: Date): number {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago', timeZoneName: 'longOffset',
  }).formatToParts(instante);
  const texto = partes.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-03:00';
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(texto);
  if (!m) return -180;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

/** Medianoche de Santiago del día 1 del mes, como instante UTC */
function inicioMesSantiago(anio: number, mes: number): Date {
  const medianocheUtc = Date.UTC(anio, mes - 1, 1);
  const desfase = desfaseSantiagoMin(new Date(medianocheUtc));
  return new Date(medianocheUtc - desfase * 60_000);
}

/**
 * Rango [desde, hasta) del mes en hora de Chile, en ISO UTC (así se
 * guardan `fecha` y `fechaPago`). mes: 1–12.
 */
export function rangoMesChile(anio: number, mes: number): { desde: string; hasta: string } {
  const siguiente = mes === 12 ? { anio: anio + 1, mes: 1 } : { anio, mes: mes + 1 };
  return {
    desde: inicioMesSantiago(anio, mes).toISOString(),
    hasta: inicioMesSantiago(siguiente.anio, siguiente.mes).toISOString(),
  };
}

/** Celda CSV segura: comillas escapadas y fórmulas de planilla neutralizadas */
function celda(valor: string | number): string {
  if (typeof valor === 'number') return String(valor);
  const seguro = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
  return /[";\r\n]/.test(seguro) || seguro !== valor ? `"${seguro.replace(/"/g, '""')}"` : seguro;
}

/** CSV (separador ";", para Excel en español) con una fila por pedido */
export function csvVentas(ventas: readonly VentaReporte[]): string {
  const encabezado = ['Pedido', 'Fecha de pago', 'Cliente', 'Medio de pago', 'Estado', 'Subtotal', 'Descuento', 'Envío', 'Total'];
  const filas = ventas.map((v) => [
    v.id,
    (v.fechaPago ?? v.fecha).slice(0, 10),
    v.nombreCliente,
    v.metodoPago,
    v.estado,
    v.subtotal,
    v.descuento ?? 0,
    v.costoEnvio,
    v.total,
  ].map(celda).join(';'));
  return [encabezado.join(';'), ...filas].join('\r\n') + '\r\n';
}
