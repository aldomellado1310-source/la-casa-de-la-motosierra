// Carrito: edición de cantidades con recálculo de precio por
// volumen, y acceso a checkout o a solicitar cotización.
// En móvil, el total y "Continuar" quedan fijos sobre la barra
// inferior: pagar nunca queda escondido al final de la lista.
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../stores/useCarrito';
import { formatoCLP } from '../utils/precio';
import { useSeo } from '../utils/seo';
import FotoProducto from '../components/FotoProducto';
import { IconoBasura, IconoCarrito, IconoDocumento, IconoFlecha, IconoPin } from '../components/Iconos';

export default function Carrito() {
  useSeo({
    titulo: 'Carrito de compras',
    descripcion: 'Revisa tu carrito: precios por volumen aplicados automáticamente y costo de envío visible antes de pagar.',
  });
  const navigate = useNavigate();
  const { items, cambiarCantidad, quitar, total, unidades } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="contenedor max-w-xl py-16 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gris-fondo">
          <IconoCarrito className="h-10 w-10 text-gris-600" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-base text-gris-600">
          Busca el repuesto para tu máquina y toca <strong>“Agregar”</strong>. Aparecerá aquí.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/compatibilidad" className="btn-primario">Buscar por mi máquina</Link>
          <Link to="/tienda" className="btn-secundario">Ver todos los repuestos</Link>
        </div>
      </div>
    );
  }

  const n = unidades();

  return (
    <div className="contenedor max-w-5xl py-6 pb-32 sm:py-8 md:pb-8">
      <h1 className="titulo-seccion">Tu carrito</h1>
      <p className="mt-2 text-base text-gris-600">
        {n} producto{n === 1 ? '' : 's'} · Precios con IVA incluido
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Ítems */}
        <ul className="flex-1 divide-y-2 divide-gris-fondo rounded-[22px] border-2 border-carbon bg-white">
          {items.map((it) => (
            <li key={it.productoId} className="flex gap-3 p-4 sm:gap-4">
              <Link to={`/producto/${it.productoId}`} tabIndex={-1} aria-hidden="true" className="shrink-0">
                <FotoProducto src={it.foto} alt="" tamano="chico" width={96} height={96} className="h-20 w-20 rounded-lg border border-borde object-cover sm:h-24 sm:w-24" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/producto/${it.productoId}`} className="line-clamp-2 text-base font-semibold leading-snug hover:text-verde hover:underline">
                      {it.nombre}
                    </Link>
                    <p className="text-sm text-gris-600">Código: {it.sku}</p>
                  </div>
                  <p className="shrink-0 text-right text-lg font-bold">{formatoCLP(it.precioUnitario * it.cantidad)}</p>
                </div>

                <p className="mt-1 text-sm text-gris-600">
                  {formatoCLP(it.precioUnitario)} c/u
                  {it.precioUnitario < it.precioBase && (
                    <span className="font-semibold text-verde"> · Precio por volumen (antes {formatoCLP(it.precioBase)})</span>
                  )}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="stepper h-12" role="group" aria-label={`Cantidad de ${it.nombre}`}>
                    <button
                      onClick={() => cambiarCantidad(it.productoId, it.cantidad - 1)}
                      disabled={it.cantidad <= 1}
                      aria-label="Quitar una unidad"
                    >−</button>
                    <span className="flex w-12 items-center justify-center border-x-2 border-carbon text-lg font-bold" aria-live="polite">
                      {it.cantidad}
                    </span>
                    <button
                      onClick={() => cambiarCantidad(it.productoId, it.cantidad + 1)}
                      aria-label="Agregar una unidad"
                    >+</button>
                  </div>
                  <button
                    onClick={() => quitar(it.productoId)}
                    className="flex min-h-[44px] items-center gap-1.5 rounded-[10px] px-2 text-base font-semibold text-oferta hover:bg-oferta/5"
                  >
                    <IconoBasura className="h-5 w-5" /> Quitar
                    <span className="sr-only"> {it.nombre} del carrito</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Resumen */}
        <aside className="lg:sticky lg:top-44 lg:w-80 lg:shrink-0">
          <div className="tarjeta">
            <h2 className="text-xl font-bold">Resumen</h2>
            <div className="mt-3 flex items-baseline justify-between gap-3 border-b border-borde pb-3">
              <span className="text-base">Total productos</span>
              <span className="text-2xl font-bold">{formatoCLP(total())}</span>
            </div>
            <p className="mt-3 flex items-start gap-2 text-base text-gris-600">
              <IconoPin className="mt-0.5 h-5 w-5 shrink-0 text-verde" />
              En el siguiente paso eliges retiro gratis en tienda o envío, y ves su costo antes de pagar.
            </p>
            <button onClick={() => navigate('/checkout')} className="btn-primario btn-grande mt-5 hidden w-full md:flex">
              Continuar con la compra <IconoFlecha className="h-5 w-5" />
            </button>
            <Link to="/tienda" className="btn-secundario mt-3 w-full">
              Seguir comprando
            </Link>
            <Link to="/cotizaciones/nueva" className="enlace mt-4 flex min-h-[44px] items-center justify-center gap-2 text-base">
              <IconoDocumento className="h-5 w-5" /> ¿Empresa? Pide una cotización formal
            </Link>
          </div>
        </aside>
      </div>

      {/* Barra fija móvil: total + continuar, sobre la navegación inferior */}
      <div className="fixed inset-x-2.5 bottom-[calc(90px+env(safe-area-inset-bottom))] z-flotante rounded-[20px] border-2 border-carbon bg-white px-3 py-2.5 shadow-dura md:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-sm text-gris-600">Total</p>
            <p className="text-xl font-bold leading-tight">{formatoCLP(total())}</p>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primario flex-1">
            Continuar <IconoFlecha className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
