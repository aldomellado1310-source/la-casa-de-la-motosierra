// Tabla transparente de precios por volumen / mayorista
import { formatoCLP } from '../utils/precio';
import type { TramoPrecio } from '../types';

export default function TablaVolumen({ tramos, cantidadActual }: { tramos: TramoPrecio[]; cantidadActual?: number }) {
  if (tramos.length < 2) return null;

  const esActivo = (t: TramoPrecio) =>
    cantidadActual !== undefined &&
    cantidadActual >= t.desde &&
    (t.hasta === null || cantidadActual <= t.hasta);

  return (
    <div className="overflow-hidden rounded-lg border border-borde">
      <table className="w-full text-sm">
        <thead className="bg-verde text-left text-white">
          <tr>
            <th className="px-3 py-2 font-semibold">Cantidad</th>
            <th className="px-3 py-2 text-right font-semibold">Precio unitario</th>
          </tr>
        </thead>
        <tbody>
          {tramos.map((t) => (
            <tr
              key={t.desde}
              className={`border-t border-borde ${esActivo(t) ? 'bg-naranja/10 font-bold text-naranja-oscuro' : 'bg-white'}`}
            >
              <td className="px-3 py-2">
                {t.hasta === null ? `${t.desde}+ unidades` : `${t.desde} – ${t.hasta} unidades`}
                {esActivo(t) && <span className="ml-2 text-[11px] uppercase">← tu precio</span>}
              </td>
              <td className="px-3 py-2 text-right">{formatoCLP(t.precioUnitario)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
