// Carrito: edición de cantidades con recálculo de precio por
// volumen, y acceso a checkout o a solicitar cotización.
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../stores/useCarrito';
import { useAuth } from '../stores/useAuth';
import { formatoCLP } from '../utils/precio';
import { IconoCarrito, IconoDocumento } from '../components/Iconos';

export default function Carrito() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { items, cambiarCantidad, quitar, total } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <IconoCarrito className="mx-auto h-14 w-14 text-gris-600" />
        <h1 className="mt-4 text-xl font-extrabold">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-gris-600">Encuentra el repuesto justo para tu máquina.</p>
        <Link to="/tienda" className="btn-primario mt-6">Ir a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 titulo-seccion">Carrito de compras</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Ítems */}
        <div className="flex-1 space-y-3">
          {items.map((it) => (
            <div key={it.productoId} className="tarjeta flex gap-3">
              <img src={it.foto} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <Link to={`/producto/${it.productoId}`} className="line-clamp-2 text-sm font-semibold hover:text-verde">
                  {it.nombre}
                </Link>
                <p className="text-xs text-gris-600">SKU {it.sku}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center overflow-hidden rounded-lg border border-borde">
                    <button
                      onClick={() => cambiarCantidad(it.productoId, it.cantidad - 1)}
                      className="px-2.5 py-1.5 font-bold text-verde hover:bg-gris-fondo"
                      aria-label="Menos"
                    >−</button>
                    <span className="w-10 text-center text-sm">{it.cantidad}</span>
                    <button
                      onClick={() => cambiarCantidad(it.productoId, it.cantidad + 1)}
                      className="px-2.5 py-1.5 font-bold text-verde hover:bg-gris-fondo"
                      aria-label="Más"
                    >+</button>
                  </div>
                  <button onClick={() => quitar(it.productoId)} className="text-xs text-red-600 hover:underline">
                    Quitar
                  </button>
                </div>
                {it.precioUnitario < it.precioBase && (
                  <p className="mt-1 text-[11px] font-semibold text-verde">
                    Precio por volumen aplicado: {formatoCLP(it.precioUnitario)} c/u (antes {formatoCLP(it.precioBase)})
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-extrabold text-naranja-oscuro">{formatoCLP(it.precioUnitario * it.cantidad)}</p>
                <p className="text-[11px] text-gris-600">{formatoCLP(it.precioUnitario)} c/u</p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <aside className="lg:w-80 lg:shrink-0">
          <div className="tarjeta sticky top-28">
            <h2 className="mb-3 font-bold">Resumen</h2>
            <div className="flex justify-between border-b border-borde pb-3 text-sm">
              <span>Subtotal (IVA incluido)</span>
              <span className="font-bold">{formatoCLP(total())}</span>
            </div>
            <p className="mt-2 text-xs text-gris-600">El costo de envío se calcula y muestra en el siguiente paso, antes de pagar.</p>
            <button onClick={() => navigate('/checkout')} className="btn-primario mt-4 w-full py-3">
              Ir a pagar
            </button>
            <Link
              to="/cotizaciones/nueva"
              className="btn-secundario mt-2 w-full"
              title={usuario?.tipo === 'empresa' ? '' : 'Disponible para todos, ideal para empresas'}
            >
              <IconoDocumento className="h-4 w-4" /> Solicitar cotización formal
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
