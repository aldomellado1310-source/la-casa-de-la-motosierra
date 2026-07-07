// Admin > Cotizaciones: seguimiento y cambio de estado
import { useEffect, useState } from 'react';
import {
  ETIQUETAS_ESTADO_COTIZACION, actualizarEstadoCotizacion, obtenerTodasLasCotizaciones,
} from '../../services/cotizaciones';
import { descargarPdfCotizacion } from '../../services/pdfCotizacion';
import { formatoCLP } from '../../utils/precio';
import type { Cotizacion, EstadoCotizacion } from '../../types';

const ESTADOS: EstadoCotizacion[] = ['enviada', 'aprobada', 'convertida', 'vencida'];

export default function AdminCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);

  const recargar = async () => setCotizaciones(await obtenerTodasLasCotizaciones());
  useEffect(() => { void recargar(); }, []);

  const cambiarEstado = async (id: string, estado: EstadoCotizacion) => {
    await actualizarEstadoCotizacion(id, estado);
    await recargar();
  };

  if (cotizaciones.length === 0) {
    return <p className="text-sm text-gris-600">No hay cotizaciones registradas todavía.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-borde bg-white">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-verde text-left text-white">
          <tr>
            <th className="px-3 py-2.5 font-semibold">Folio</th>
            <th className="px-3 py-2.5 font-semibold">Cliente</th>
            <th className="px-3 py-2.5 font-semibold">Fecha</th>
            <th className="px-3 py-2.5 font-semibold">Total</th>
            <th className="px-3 py-2.5 font-semibold">Estado</th>
            <th className="px-3 py-2.5 font-semibold">PDF</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones.map((c) => (
            <tr key={c.id} className="border-t border-borde hover:bg-gris-fondo/60">
              <td className="px-3 py-2 font-mono text-xs font-bold">{c.folio}</td>
              <td className="px-3 py-2">
                {c.razonSocial ?? c.nombreCliente}
                {c.rut && <span className="block text-xs text-gris-600">{c.rut}</span>}
              </td>
              <td className="px-3 py-2 text-xs">
                {new Date(c.fecha).toLocaleDateString('es-CL')}
                <span className="block text-gris-600">vence {new Date(c.validaHasta).toLocaleDateString('es-CL')}</span>
              </td>
              <td className="px-3 py-2 font-semibold">{formatoCLP(c.total)}</td>
              <td className="px-3 py-2">
                <select
                  value={c.estado}
                  onChange={(e) => void cambiarEstado(c.id, e.target.value as EstadoCotizacion)}
                  className="campo py-1.5"
                >
                  {ESTADOS.map((es) => <option key={es} value={es}>{ETIQUETAS_ESTADO_COTIZACION[es]}</option>)}
                </select>
              </td>
              <td className="px-3 py-2">
                <button onClick={() => descargarPdfCotizacion(c)} className="font-semibold text-verde hover:underline">
                  Descargar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
