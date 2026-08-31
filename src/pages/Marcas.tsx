// Página de marcas: cada marca con sus modelos disponibles,
// enlazando al filtro estructurado de compatibilidad.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoError from '../components/EstadoError';
import { obtenerProductos } from '../services/productos';
import { useSeo } from '../utils/seo';
import type { Producto } from '../types';

interface DatosMarca {
  nombre: string;
  productos: number;
  modelos: string[];
}

export default function Marcas() {
  useSeo({
    titulo: 'Repuestos por marca de máquina',
    descripcion: 'Stihl, Husqvarna, Honda, Echo, Toyama y genéricas: elige la marca y el modelo de tu máquina para ver solo los repuestos compatibles.',
  });
  const [marcas, setMarcas] = useState<DatosMarca[]>([]);
  const [error, setError] = useState(false);

  const cargar = () => {
    setError(false);
    obtenerProductos()
      .then((productos: Producto[]) => {
        const mapa = new Map<string, { productos: number; modelos: Set<string> }>();
        for (const p of productos) {
          for (const c of p.compatibilidades) {
            const datos = mapa.get(c.marca) ?? { productos: 0, modelos: new Set<string>() };
            datos.productos++;
            c.modelos.forEach((mod) => datos.modelos.add(mod));
            mapa.set(c.marca, datos);
          }
        }
        setMarcas(
          [...mapa.entries()]
            .map(([nombre, d]) => ({ nombre, productos: d.productos, modelos: [...d.modelos].sort() }))
            .sort((a, b) => b.productos - a.productos),
        );
      })
      .catch(() => setError(true));
  };
  useEffect(cargar, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="titulo-seccion mb-2">Repuestos por marca</h1>
      <p className="mb-6 max-w-2xl text-sm text-gris-600">
        Elige la marca de tu máquina y filtra por modelo para ver solo los repuestos compatibles.
        ¿No aparece tu modelo? Escríbenos por WhatsApp y lo verificamos por ti.
      </p>

      {error && <EstadoError onReintentar={cargar} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {marcas.map((m) => (
          <div key={m.nombre} className="tarjeta flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">{m.nombre}</h2>
              <span className="rounded-full bg-verde-badge px-2.5 py-1 text-xs font-bold text-verde-oscuro">
                {m.productos} repuesto{m.productos === 1 ? '' : 's'}
              </span>
            </div>
            {m.modelos.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.modelos.map((mod) => (
                  <Link
                    key={mod}
                    to={`/tienda?marca=${encodeURIComponent(m.nombre)}&modelo=${encodeURIComponent(mod)}`}
                    className="rounded-full border border-borde px-3 py-1 text-xs font-medium text-grafito transition-colors hover:border-verde hover:text-verde"
                  >
                    {mod}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-gris-600">Consumibles universales para toda la marca.</p>
            )}
            <Link to={`/tienda?marca=${encodeURIComponent(m.nombre)}`} className="btn-verde mt-4 w-full text-sm">
              Ver todo {m.nombre}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
