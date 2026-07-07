// Tarjeta de producto (mockup): badge de estado/oferta, corazón
// de favorito, foto sobre blanco, precio con tachado en oferta y
// stepper de cantidad + botón "Agregar".
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../stores/useCarrito';
import { useFavoritos } from '../stores/useFavoritos';
import { enOferta, estadoStock, formatoCLP, porcentajeOferta, precioVigente } from '../utils/precio';
import BadgeStock from './BadgeStock';
import { IconoCorazon } from './Iconos';
import type { Producto } from '../types';

export default function TarjetaProducto({ producto }: { producto: Producto }) {
  const agregar = useCarrito((s) => s.agregar);
  const esFavorito = useFavoritos((s) => s.esFavorito(producto.id));
  const alternarFavorito = useFavoritos((s) => s.alternar);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const oferta = enOferta(producto);
  const estado = estadoStock(producto);
  const agotado = estado === 'agotado';
  const maxCantidad = producto.stock > 0 ? producto.stock : 99;

  const alAgregar = () => {
    agregar(producto, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1800);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-borde bg-white transition-[transform,box-shadow] duration-200 ease-[var(--ease-salida)] hover:-translate-y-0.5 hover:shadow-tarjeta">
      {/* Foto con badges */}
      <div className="relative">
        <Link to={`/producto/${producto.id}`} className="block aspect-square overflow-hidden bg-white">
          <img
            src={producto.fotos[0]}
            alt={producto.nombre}
            loading="lazy"
            width={600}
            height={600}
            className="h-full w-full object-cover transition-transform duration-200 ease-[var(--ease-salida)] group-hover:scale-[1.04]"
          />
        </Link>
        <div className="absolute left-2 top-2">
          {oferta ? (
            <span className="rounded-full bg-oferta px-2.5 py-1 text-[11px] font-bold text-white">
              Oferta −{porcentajeOferta(producto)}%
            </span>
          ) : (
            <BadgeStock producto={producto} compacto />
          )}
        </div>
        <button
          onClick={() => alternarFavorito(producto.id)}
          aria-label={esFavorito ? `Quitar ${producto.nombre} de favoritos` : `Agregar ${producto.nombre} a favoritos`}
          aria-pressed={esFavorito}
          className={`absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-150 ${
            esFavorito
              ? 'border-oferta bg-white text-oferta'
              : 'border-borde bg-white text-gris-600 hover:text-oferta'
          }`}
        >
          {/* key por estado: dispara el pop al marcar favorito */}
          <span key={String(esFavorito)} className={esFavorito ? 'animar-favorito' : ''}>
            <IconoCorazon className="h-5 w-5" relleno={esFavorito} />
          </span>
        </button>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link to={`/producto/${producto.id}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug hover:text-verde">
          {producto.nombre}
        </Link>
        <p className="text-xs text-gris-600">SKU: {producto.sku}</p>
        {oferta && <BadgeStock producto={producto} compacto />}

        <div className="mt-auto pt-1">
          <p className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-grafito">{formatoCLP(precioVigente(producto))}</span>
            {oferta && <s className="text-sm text-gris-600">{formatoCLP(producto.precio)}</s>}
          </p>

          {/* Stepper + Agregar */}
          {!agotado ? (
            <div className="mt-2 flex items-stretch gap-2">
              <div className="flex items-center overflow-hidden rounded-lg border border-borde">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="flex h-11 w-9 items-center justify-center font-bold text-grafito transition-colors hover:bg-gris-fondo"
                  aria-label="Disminuir cantidad"
                >−</button>
                <span className="w-7 text-center text-sm font-semibold" aria-live="polite">{cantidad}</span>
                <button
                  onClick={() => setCantidad(Math.min(maxCantidad, cantidad + 1))}
                  className="flex h-11 w-9 items-center justify-center font-bold text-grafito transition-colors hover:bg-gris-fondo"
                  aria-label="Aumentar cantidad"
                >+</button>
              </div>
              <button
                onClick={alAgregar}
                className={`${agregado ? 'btn-verde' : 'btn-primario'} flex-1 px-2 text-sm`}
                aria-live="polite"
              >
                {agregado ? '✓ Agregado' : 'Agregar'}
              </button>
            </div>
          ) : (
            <Link to={`/producto/${producto.id}`} className="btn-secundario mt-2 w-full text-sm">
              Avísame cuando llegue
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
