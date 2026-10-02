// Tarjeta de producto, pensada para leerse de un vistazo en el
// teléfono: foto, nombre grande, código, stock en palabras, precio
// destacado y UN botón ancho "Agregar". La cantidad se ajusta en la
// ficha o en el carrito (en 2 columnas móviles no cabe un stepper
// cómodo para dedos grandes).
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../stores/useCarrito';
import { useAviso } from '../stores/useAviso';
import { useFavoritos } from '../stores/useFavoritos';
import { enOferta, estadoStock, formatoCLP, porcentajeOferta, precioVigente } from '../utils/precio';
import BadgeStock from './BadgeStock';
import FotoProducto from './FotoProducto';
import { IconoCarrito, IconoCorazon } from './Iconos';
import type { Producto } from '../types';

export default function TarjetaProducto({ producto }: { producto: Producto }) {
  const agregar = useCarrito((s) => s.agregar);
  const mostrarAviso = useAviso((s) => s.mostrar);
  const esFavorito = useFavoritos((s) => s.esFavorito(producto.id));
  const alternarFavorito = useFavoritos((s) => s.alternar);
  const [agregado, setAgregado] = useState(false);
  const temporizador = useRef<number>();

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  const oferta = enOferta(producto);
  const agotado = estadoStock(producto) === 'agotado';
  const urlFicha = `/producto/${producto.id}`;

  const alAgregar = () => {
    agregar(producto, 1);
    mostrarAviso('Agregado al carrito');
    setAgregado(true);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setAgregado(false), 2200);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border-2 border-carbon bg-white transition-[transform,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-y-0.5 hover:shadow-dura">
      {/* Foto con oferta y favorito */}
      <div className="relative">
        <Link to={urlFicha} tabIndex={-1} aria-hidden="true" className="block aspect-square overflow-hidden bg-white">
          <FotoProducto
            src={producto.fotos[0]}
            alt=""
            categoria={producto.categoria}
            width={600}
            height={600}
            className="h-full w-full object-cover transition-transform duration-200 ease-[var(--ease-salida)] group-hover:scale-[1.03]"
          />
        </Link>
        {oferta && (
          <span className="animar-sticker absolute left-2.5 top-2.5 rounded-[10px] bg-oferta px-2.5 py-1 font-display text-lg font-extrabold uppercase leading-none text-white">
            Oferta −{porcentajeOferta(producto)}%
          </span>
        )}
        <button
          onClick={() => alternarFavorito(producto.id)}
          aria-label={esFavorito ? `Quitar ${producto.nombre} de favoritos` : `Guardar ${producto.nombre} en favoritos`}
          aria-pressed={esFavorito}
          className={`absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full border bg-white/95 transition-colors duration-150 ${
            esFavorito ? 'border-oferta text-oferta' : 'border-borde text-gris-600 hover:text-oferta'
          }`}
        >
          {/* key por estado: dispara el pop al marcar favorito */}
          <span key={String(esFavorito)} className={esFavorito ? 'animar-favorito' : ''}>
            <IconoCorazon className="h-5 w-5" relleno={esFavorito} />
          </span>
        </button>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-1 border-t-2 border-carbon p-3 sm:p-4">
        <h3 className="text-base font-bold leading-snug">
          <Link to={urlFicha} className="line-clamp-2 min-h-[3.25rem] hover:text-verde hover:underline">
            {producto.nombre}
          </Link>
        </h3>
        <p className="truncate text-sm text-gris-600">Código: {producto.sku}</p>
        <BadgeStock producto={producto} linea />

        <div className="mt-auto pt-2">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-[1.9rem] font-extrabold leading-none text-carbon">{formatoCLP(precioVigente(producto))}</span>
            {oferta && (
              <s className="text-sm text-gris-600">
                <span className="sr-only">Antes </span>{formatoCLP(producto.precio)}
              </s>
            )}
          </p>

          {!agotado ? (
            <button
              onClick={alAgregar}
              className={`${agregado ? 'btn-verde' : 'btn-oscuro'} mt-2.5 w-full px-2`}
              aria-live="polite"
            >
              {agregado ? (
                <>✓ Agregado</>
              ) : (
                <>
                  <IconoCarrito className="h-5 w-5 shrink-0" /> Agregar
                </>
              )}
            </button>
          ) : (
            <Link to={urlFicha} className="btn-secundario mt-2.5 w-full px-2 text-center">
              Avísame
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
