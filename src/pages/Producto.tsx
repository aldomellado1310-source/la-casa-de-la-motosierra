// ============================================================
// Ficha de producto: galería con zoom, stock real, tabla de
// precios por volumen, compatibilidades y "avísame cuando llegue".
// ============================================================
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BadgeStock from '../components/BadgeStock';
import EstadoError from '../components/EstadoError';
import GaleriaFotos from '../components/GaleriaFotos';
import TablaVolumen from '../components/TablaVolumen';
import { obtenerProducto, obtenerProductos, registrarAvisoStock } from '../services/productos';
import { envioDesde } from '../services/envios';
import TarjetaProducto from '../components/TarjetaProducto';
import { useCarrito } from '../stores/useCarrito';
import { useFavoritos } from '../stores/useFavoritos';
import { IconoCorazon } from '../components/Iconos';
import { enOferta, estadoStock, formatoCLP, porcentajeOferta, precioPorCantidad, precioVigente } from '../utils/precio';
import { jsonLdProducto, useSeo } from '../utils/seo';
import type { Producto as TipoProducto } from '../types';

/** Corazón de favorito para la ficha */
function BotonFavorito({ productoId, nombre }: { productoId: string; nombre: string }) {
  const esFavorito = useFavoritos((s) => s.esFavorito(productoId));
  const alternar = useFavoritos((s) => s.alternar);
  return (
    <button
      onClick={() => alternar(productoId)}
      aria-label={esFavorito ? `Quitar ${nombre} de favoritos` : `Agregar ${nombre} a favoritos`}
      aria-pressed={esFavorito}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
        esFavorito ? 'border-oferta bg-white text-oferta' : 'border-borde bg-white text-gris-600 hover:text-oferta'
      }`}
    >
      <IconoCorazon className="h-5 w-5" relleno={esFavorito} />
    </button>
  );
}

export default function Producto() {
  const { id } = useParams<{ id: string }>();
  const agregar = useCarrito((s) => s.agregar);
  const [producto, setProducto] = useState<TipoProducto | null>(null);
  const [relacionados, setRelacionados] = useState<TipoProducto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [reintento, setReintento] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [emailAviso, setEmailAviso] = useState('');
  const [avisoOk, setAvisoOk] = useState(false);

  // Metadatos + schema.org/Product para aparecer en Google con precio y stock
  useSeo({
    titulo: producto?.nombre ?? 'Producto',
    descripcion: producto
      ? `${producto.descripcion.slice(0, 150)} SKU ${producto.sku}. Despacho a todo Chile desde Puerto Aysén.`
      : 'Repuestos forestales con despacho a todo Chile.',
    imagen: producto?.fotos[0],
    jsonLd: producto ? jsonLdProducto(producto) : undefined,
  });

  useEffect(() => {
    if (!id) return;
    setCargando(true);
    setError(false);
    void obtenerProducto(id).then(async (p) => {
      setProducto(p);
      setCargando(false);
      if (!p) return;
      // Relacionados: comparten máquina compatible o categoría.
      // Prioriza categorías distintas (cross-sell: cadena → espada → lima).
      const todos = await obtenerProductos();
      const puntaje = (x: TipoProducto): number => {
        if (x.id === p.id) return -1;
        const compartenModelo = x.modelosCompatibles.some((m) => p.modelosCompatibles.includes(m));
        const compartenMarca = x.marcasCompatibles.some((m) => p.marcasCompatibles.includes(m));
        const mismaCategoria = x.categoria === p.categoria;
        if (!compartenMarca && !mismaCategoria) return -1;
        let s = 0;
        if (compartenModelo) s += 3;
        if (compartenMarca) s += 2;
        if (!mismaCategoria) s += 2; // complementario pesa más que sustituto
        if (x.destacado) s += 1;
        return s;
      };
      setRelacionados(
        todos
          .map((x) => ({ x, s: puntaje(x) }))
          .filter(({ s }) => s > 0)
          .sort((a, b) => b.s - a.s)
          .slice(0, 4)
          .map(({ x }) => x),
      );
    }).catch(() => {
      setError(true);
      setCargando(false);
    });
  }, [id, reintento]);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <EstadoError onReintentar={() => setReintento((n) => n + 1)} />
      </div>
    );
  }
  if (cargando) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-verde">Cargando producto…</div>;
  }
  if (!producto) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="font-semibold">Producto no encontrado.</p>
        <Link to="/tienda" className="btn-primario mt-4">Volver a la tienda</Link>
      </div>
    );
  }

  const estado = estadoStock(producto);
  const sinCompra = estado === 'agotado';
  // El precio de oferta actúa como techo del precio por volumen
  const precioActual = Math.min(
    precioPorCantidad(producto.preciosPorVolumen, producto.precio, cantidad),
    precioVigente(producto),
  );
  const maxCantidad = producto.stock > 0 ? producto.stock : 99; // bajo pedido no limita

  const alAgregar = () => {
    agregar(producto, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2500);
  };

  const solicitarAviso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAviso) return;
    await registrarAvisoStock(producto.id, producto.sku, emailAviso);
    setAvisoOk(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Miga de pan */}
      <nav className="mb-4 text-xs text-gris-600">
        <Link to="/" className="hover:text-verde">Inicio</Link> ·{' '}
        <Link to="/tienda" className="hover:text-verde">Tienda</Link> ·{' '}
        <Link to={`/tienda?categoria=${producto.categoria}`} className="hover:text-verde">
          {producto.subcategoria}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <GaleriaFotos fotos={producto.fotos} alt={producto.nombre} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gris-600">SKU {producto.sku}</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{producto.nombre}</h1>
            <BotonFavorito productoId={producto.id} nombre={producto.nombre} />
          </div>
          <div className="mt-3"><BadgeStock producto={producto} /></div>

          {/* Precio dinámico según cantidad y oferta */}
          <div className="mt-4">
            <p className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-grafito">{formatoCLP(precioActual)}</span>
              {precioActual < producto.precio && (
                <s className="text-lg text-gris-600">{formatoCLP(producto.precio)}</s>
              )}
              {enOferta(producto) && (
                <span className="rounded-full bg-oferta px-2.5 py-1 text-xs font-bold text-white">
                  Oferta −{porcentajeOferta(producto)}%
                </span>
              )}
            </p>
            {!enOferta(producto) && precioActual < producto.precio && (
              <p className="text-sm font-medium text-verde">Precio por volumen aplicado</p>
            )}
            <p className="text-xs text-gris-600">IVA incluido</p>
            <p className="mt-1 text-xs text-gris-600">
              Retiro gratis en Puerto Aysén, o envío a todo Chile desde {formatoCLP(envioDesde(cantidad))}
            </p>
          </div>

          {/* Compra */}
          {!sinCompra ? (
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="cantidad" className="etiqueta">Cantidad</label>
                <div className="flex items-center overflow-hidden rounded-lg border border-borde bg-white">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="px-3 py-2.5 font-bold text-verde hover:bg-gris-fondo"
                    aria-label="Menos"
                  >
                    −
                  </button>
                  <input
                    id="cantidad"
                    type="number"
                    min={1}
                    max={maxCantidad}
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.min(maxCantidad, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                    className="w-16 border-0 py-2.5 text-center text-sm outline-none"
                  />
                  <button
                    onClick={() => setCantidad(Math.min(maxCantidad, cantidad + 1))}
                    className="px-3 py-2.5 font-bold text-verde hover:bg-gris-fondo"
                    aria-label="Más"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={alAgregar}
                className={`${agregado ? 'btn-verde' : 'btn-primario'} flex-1 py-3 sm:flex-none sm:px-8`}
                aria-live="polite"
              >
                {agregado ? '✓ Agregado al carrito' : estado === 'bajo_pedido' ? 'Comprar bajo pedido' : 'Agregar al carrito'}
              </button>
            </div>
          ) : (
            /* Avísame cuando llegue */
            <div className="mt-5 rounded-xl border border-naranja/40 bg-naranja/5 p-4">
              <h3 className="font-bold text-naranja-oscuro">Producto agotado</h3>
              {avisoOk ? (
                <p className="mt-2 text-sm text-verde">✓ Listo. Te avisaremos a {emailAviso} cuando vuelva el stock.</p>
              ) : (
                <form onSubmit={solicitarAviso} className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={emailAviso}
                    onChange={(e) => setEmailAviso(e.target.value)}
                    placeholder="tu@correo.cl"
                    aria-label="Correo para avisarte cuando vuelva el stock"
                    className="campo flex-1"
                  />
                  <button type="submit" className="btn-primario">Avísame cuando llegue</button>
                </form>
              )}
            </div>
          )}

          {/* Tabla de precios por volumen */}
          {producto.preciosPorVolumen.length > 1 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">
                Precios por volumen — mayorista
              </h2>
              <TablaVolumen tramos={producto.preciosPorVolumen} cantidadActual={cantidad} />
            </div>
          )}

          {/* Compatibilidad */}
          {(producto.marcasCompatibles.length > 0 || producto.modelosCompatibles.length > 0) && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Compatible con</h2>
              <div className="flex flex-wrap gap-1.5">
                {producto.marcasCompatibles.map((m) => (
                  <Link
                    key={m}
                    to={`/tienda?marca=${encodeURIComponent(m)}`}
                    className="rounded-full bg-verde/10 px-3 py-1 text-xs font-semibold text-verde hover:bg-verde/20"
                  >
                    {m}
                  </Link>
                ))}
                {producto.modelosCompatibles.map((m) => (
                  <span key={m} className="rounded-full border border-borde px-3 py-1 text-xs text-grafito/80">
                    {m}
                  </span>
                ))}
              </div>
              {producto.modelosCompatibles.length === 0 && producto.marcasCompatibles.length > 0 && (
                <p className="mt-2 text-xs text-gris-600">Producto universal: sirve para todos los modelos de estas marcas.</p>
              )}
            </div>
          )}

          {/* Descripción */}
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Descripción</h2>
            <p className="text-sm leading-relaxed text-grafito/90">{producto.descripcion}</p>
          </div>
        </div>
      </div>

      {/* Productos relacionados — cross-sell por compatibilidad */}
      {relacionados.length > 0 && (
        <section className="mt-12 border-t border-borde pt-8">
          <h2 className="titulo-seccion mb-2">Completa tu mantención</h2>
          <p className="mb-5 text-sm text-gris-600">
            Repuestos compatibles con las mismas máquinas que {producto.nombre.toLowerCase().startsWith('kit') ? 'este kit' : 'este producto'}.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {relacionados.map((r) => (
              <TarjetaProducto key={r.id} producto={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
