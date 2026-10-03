// Admin > Ventas: reporte mensual (base para cobrar la comisión del sitio)
import { useEffect, useMemo, useState } from 'react';
import { ETIQUETAS_ESTADO_PEDIDO, ETIQUETAS_METODO_PAGO, obtenerVentasEnRango } from '../../services/pedidos';
import { formatoCLP } from '../../utils/precio';
import {
  ETIQUETAS_BASE, baseComision, calcularComision, csvVentas, rangoMesChile, resumirVentas,
  type BaseComision,
} from '../../utils/reporteVentas';
import EstadoError from '../../components/EstadoError';
import type { MetodoPago, Pedido } from '../../types';

const ETIQUETAS_MEDIO = ETIQUETAS_METODO_PAGO;

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Preferencias del cálculo de comisión (solo en este navegador)
const CLAVE_PREFERENCIAS = 'lcm-comision';

function leerPreferencias(): { base: BaseComision; porcentaje: number } {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_PREFERENCIAS) ?? '{}') as Partial<{ base: BaseComision; porcentaje: number }>;
    return {
      base: guardado.base && guardado.base in ETIQUETAS_BASE ? guardado.base : 'total_neto',
      porcentaje: typeof guardado.porcentaje === 'number' ? guardado.porcentaje : 0,
    };
  } catch {
    return { base: 'total_neto', porcentaje: 0 };
  }
}

/** Mes actual en hora de Chile */
function mesActualChile(): { anio: number; mes: number } {
  const partes = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit' })
    .format(new Date()).split('-');
  return { anio: Number(partes[0]), mes: Number(partes[1]) };
}

export default function AdminVentas() {
  const [periodo, setPeriodo] = useState(mesActualChile);
  const [ventas, setVentas] = useState<Pedido[] | null>(null);
  const [error, setError] = useState(false);
  const [preferencias, setPreferencias] = useState(leerPreferencias);

  const cargar = () => {
    setVentas(null);
    setError(false);
    const { desde, hasta } = rangoMesChile(periodo.anio, periodo.mes);
    obtenerVentasEnRango(desde, hasta)
      .then((lista) => setVentas(lista.sort((a, b) => (a.fechaPago ?? a.fecha).localeCompare(b.fechaPago ?? b.fecha))))
      .catch(() => setError(true));
  };
  useEffect(cargar, [periodo]);

  useEffect(() => {
    try { localStorage.setItem(CLAVE_PREFERENCIAS, JSON.stringify(preferencias)); } catch { /* sin almacenamiento */ }
  }, [preferencias]);

  const resumen = useMemo(() => resumirVentas(ventas ?? []), [ventas]);
  const montoBase = baseComision(resumen, preferencias.base);
  const comision = calcularComision(montoBase, preferencias.porcentaje);

  const moverMes = (delta: number) => {
    setPeriodo(({ anio, mes }) => {
      const indice = anio * 12 + (mes - 1) + delta;
      return { anio: Math.floor(indice / 12), mes: (indice % 12) + 1 };
    });
  };
  const actual = mesActualChile();
  const esMesActual = periodo.anio === actual.anio && periodo.mes === actual.mes;
  const nombreMes = `${MESES[periodo.mes - 1]} ${periodo.anio}`;

  const descargarCsv = () => {
    if (!ventas) return;
    // BOM para que Excel reconozca los acentos
    const blob = new Blob(['﻿' + csvVentas(ventas)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas-${periodo.anio}-${String(periodo.mes).padStart(2, '0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <EstadoError onReintentar={cargar} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
          <button onClick={() => moverMes(-1)} className="btn btn-secundario shrink-0" aria-label="Mes anterior">
            ← <span className="hidden sm:inline">Anterior</span>
          </button>
          <h2 className="text-center font-display text-2xl font-extrabold sm:min-w-[11rem]">{nombreMes}</h2>
          <button onClick={() => moverMes(1)} disabled={esMesActual} className="btn btn-secundario shrink-0" aria-label="Mes siguiente">
            <span className="hidden sm:inline">Siguiente</span> →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={descargarCsv} disabled={!ventas?.length} className="btn btn-secundario">Descargar Excel (CSV)</button>
          <button onClick={() => window.print()} className="btn btn-secundario">Imprimir</button>
        </div>
      </div>

      <p className="ayuda">
        Cuenta los pedidos <strong>pagados</strong> en el mes (hora de Chile), según la fecha en que se confirmó el pago:
        pasarela o transferencia validada en Pedidos. No incluye los cancelados ni las ventas fuera del sitio.
        {esMesActual && ' El mes está en curso: el total puede cambiar.'}
      </p>

      {ventas === null ? (
        <p className="text-gris-600">Cargando ventas…</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Cifra titulo="Total cobrado" valor={formatoCLP(resumen.totalConIva)} detalle={pedidos(resumen.pedidos)} />
            <Cifra titulo="Neto (sin IVA)" valor={formatoCLP(resumen.neto)} detalle={`IVA ${formatoCLP(resumen.iva)}`} />
            <Cifra titulo="Envíos cobrados" valor={formatoCLP(resumen.envio)} detalle={`Descuentos ${formatoCLP(resumen.descuentos)}`} />
            <Cifra titulo="Ticket promedio" valor={formatoCLP(resumen.ticketPromedio)} />
          </div>

          <section className="tarjeta">
            <h3 className="text-lg font-bold">Comisión del sitio</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="etiqueta" htmlFor="base-comision">Se calcula sobre</label>
                <select
                  id="base-comision"
                  value={preferencias.base}
                  onChange={(e) => setPreferencias({ ...preferencias, base: e.target.value as BaseComision })}
                  className="campo"
                >
                  {(Object.keys(ETIQUETAS_BASE) as BaseComision[]).map((b) => (
                    <option key={b} value={b}>{ETIQUETAS_BASE[b]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="etiqueta" htmlFor="porcentaje-comision">Porcentaje acordado (%)</label>
                <input
                  id="porcentaje-comision"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step={0.1}
                  value={preferencias.porcentaje || ''}
                  placeholder="Ej: 3"
                  onChange={(e) => setPreferencias({ ...preferencias, porcentaje: Number(e.target.value) || 0 })}
                  className="campo"
                />
              </div>
              <div className="rounded-xl bg-gris-fondo p-3">
                <p className="text-sm text-gris-600">Base: {formatoCLP(montoBase)}</p>
                <p className="font-display text-3xl font-extrabold">{formatoCLP(comision)}</p>
                <p className="text-xs text-gris-600">Comisión del mes{preferencias.porcentaje ? ` (${preferencias.porcentaje}%)` : ''}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-bold">Por medio de pago</h3>
            {Object.keys(resumen.porMedio).length === 0 ? (
              <p className="text-gris-600">Sin ventas este mes.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {(Object.entries(resumen.porMedio) as [MetodoPago, { pedidos: number; total: number }][]).map(([medio, datos]) => (
                  <li key={medio} className="tarjeta">
                    <p className="font-semibold">{ETIQUETAS_MEDIO[medio]}</p>
                    <p className="text-lg font-bold">{formatoCLP(datos.total)}</p>
                    <p className="text-sm text-gris-600">{pedidos(datos.pedidos)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {ventas.length > 0 && (
            <section>
              <h3 className="mb-2 text-lg font-bold">Detalle</h3>
              <div className="overflow-x-auto rounded-xl border border-borde bg-white">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-carbon text-left text-white">
                    <tr>
                      <th className="px-3 py-2.5 font-semibold">Fecha de pago</th>
                      <th className="px-3 py-2.5 font-semibold">Pedido</th>
                      <th className="px-3 py-2.5 font-semibold">Cliente</th>
                      <th className="px-3 py-2.5 font-semibold">Medio</th>
                      <th className="px-3 py-2.5 font-semibold">Estado</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((v) => (
                      <tr key={v.id} className="border-t border-borde">
                        <td className="px-3 py-2">{new Date(v.fechaPago ?? v.fecha).toLocaleDateString('es-CL')}</td>
                        <td className="px-3 py-2 font-mono">{v.id}</td>
                        <td className="px-3 py-2">{v.nombreCliente}</td>
                        <td className="px-3 py-2">{ETIQUETAS_MEDIO[v.metodoPago]}</td>
                        <td className="px-3 py-2">{ETIQUETAS_ESTADO_PEDIDO[v.estado]}</td>
                        <td className="px-3 py-2 text-right font-semibold">{formatoCLP(v.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

/** "1 pedido" / "3 pedidos" */
function pedidos(n: number): string {
  return `${n} ${n === 1 ? 'pedido' : 'pedidos'}`;
}

function Cifra({ titulo, valor, detalle }: { titulo: string; valor: string; detalle?: string }) {
  return (
    <div className="tarjeta">
      <p className="text-sm text-gris-600">{titulo}</p>
      <p className="font-display text-3xl font-extrabold">{valor}</p>
      {detalle && <p className="text-sm text-gris-600">{detalle}</p>}
    </div>
  );
}
