// ============================================================
// Página dedicada del buscador por compatibilidad: un asistente
// centrado en "¿qué le sirve a mi máquina?", distinto del
// catálogo (/tienda). Desde aquí se sale a la tienda ya filtrada.
// ============================================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BuscadorCompatibilidad from '../components/BuscadorCompatibilidad';
import EstadoError from '../components/EstadoError';
import { IconoEngranaje, IconoWhatsApp } from '../components/Iconos';
import { WHATSAPP_NUMERO } from '../config/firebase';
import { obtenerProductos } from '../services/productos';
import { useSeo } from '../utils/seo';
import type { Producto } from '../types';

export default function Compatibilidad() {
  useSeo({
    titulo: '¿Qué repuesto le sirve a mi máquina?',
    descripcion:
      'Elige la marca y el modelo de tu motosierra o desbrozadora y te mostramos solo los repuestos compatibles. Stihl, Husqvarna, Honda, Toyama, Echo y genéricas.',
  });

  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState(false);

  const cargar = () => {
    setError(false);
    obtenerProductos().then(setProductos).catch(() => setError(true));
  };
  useEffect(cargar, []);

  // Marcas con su cantidad de repuestos, para la exploración directa
  const marcas = [...productos.reduce((mapa, p) => {
    p.compatibilidades.forEach((c) => mapa.set(c.marca, (mapa.get(c.marca) ?? 0) + 1));
    return mapa;
  }, new Map<string, number>())].sort((a, b) => b[1] - a[1]);

  return (
    <div>
      {/* Asistente protagonista */}
      <section className="bg-gris-fondo">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="mb-8 text-center">
            <IconoEngranaje className="mx-auto h-10 w-10 text-naranja" />
            <h1 className="titulo-seccion mt-3 sm:text-4xl">¿Qué le sirve a mi máquina?</h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-gris-600">
              Nada de adivinar con fotos: elige la marca y el modelo de tu motosierra o
              desbrozadora y te mostramos únicamente los repuestos que le calzan.
            </p>
          </div>
          <BuscadorCompatibilidad />
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            ['1', 'Identifica tu máquina', 'La marca y el modelo están en la etiqueta del cuerpo del motor (ej: Stihl MS 250, Husqvarna 445).'],
            ['2', 'Filtra el catálogo', 'Te mostramos solo las piezas compatibles, incluidos los consumibles universales de la marca.'],
            ['3', 'Compra sin dudas', 'Si igual te queda una duda, nos escribes por WhatsApp con una foto y la verificamos por ti.'],
          ].map(([n, titulo, detalle]) => (
            <li key={n} className="tarjeta">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-verde font-display text-lg font-bold text-white">
                {n}
              </span>
              <h2 className="mt-3 font-bold">{titulo}</h2>
              <p className="mt-1 text-sm text-gris-600">{detalle}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Exploración directa por marca */}
      <section className="mx-auto max-w-4xl px-4 pb-10">
        <h2 className="titulo-seccion mb-4 text-xl sm:text-2xl">O parte por la marca</h2>
        {error && <EstadoError onReintentar={cargar} />}
        <div className="flex flex-wrap gap-2.5">
          {marcas.map(([m, n]) => (
            <Link
              key={m}
              to={`/tienda?marca=${encodeURIComponent(m)}`}
              className="rounded-lg border border-borde bg-white px-5 py-3 text-sm font-bold text-grafito transition-colors duration-150 hover:border-verde hover:text-verde"
            >
              {m} <span className="font-normal text-gris-600">({n})</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Rescate por WhatsApp */}
      <section className="border-t border-borde bg-gris-fondo">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">¿No aparece tu modelo?</h2>
            <p className="text-sm text-gris-600">
              Mándanos la marca, el modelo y una foto de la pieza: te confirmamos compatibilidad
              y, si no la tenemos, la conseguimos bajo pedido.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, necesito verificar la compatibilidad de un repuesto')}`}
            target="_blank"
            rel="noreferrer"
            className="btn-verde shrink-0"
          >
            <IconoWhatsApp className="h-4 w-4" /> Consultar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
