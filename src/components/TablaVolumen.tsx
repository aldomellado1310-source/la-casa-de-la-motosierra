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
    <div className="overflow-hidden rounded-2xl border-2 border-carbon">
      <table className="w-full text-base">
        <thead className="bg-carbon text-left text-white">
          <tr>
            <th className="px-4 py-3 font-semibold">Cantidad</th>
            <th className="px-3 py-2 text-right font-semibold">Precio unitario</th>
          </tr>
        </thead>
        <tbody>
          {tramos.map((t) => (
            <tr
              key={t.desde}
              className={`border-t border-borde ${esActivo(t) ? 'bg-naranja-suave font-bold text-grafito' : 'bg-white'}`}
            >
              <td className="px-4 py-3">
                {t.hasta === null ? `${t.desde}+ unidades` : `${t.desde} – ${t.hasta} unidades`}
                {esActivo(t) && <span className="ml-2 text-sm font-bold">← tu precio</span>}
              </td>
              <td className="px-4 py-3 text-right">{formatoCLP(t.precioUnitario)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
