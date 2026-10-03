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
import TarjetaProducto from '../components/TarjetaProducto';
import { useCarrito } from '../stores/useCarrito';
import { useFavoritos } from '../stores/useFavoritos';
import {
  IconoCamion, IconoCarrito, IconoCheck, IconoCorazon, IconoEscudo, IconoFlecha, IconoPin, IconoWhatsApp,
} from '../components/Iconos';
import { enlaceWhatsApp } from '../config/tienda';
import { useAviso } from '../stores/useAviso';
import { enOferta, estadoStock, formatoCLP, porcentajeOferta, precioPorCantidad, precioVigente } from '../utils/precio';
import { envioDesde } from '../services/envios';
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
      className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors duration-150 ${
        esFavorito ? 'border-oferta bg-white text-oferta' : 'border-borde bg-white text-grafito hover:border-oferta hover:text-oferta'
      }`}
    >
      <span key={String(esFavorito)} className={esFavorito ? 'animar-favorito' : ''}>
        <IconoCorazon className="h-5 w-5" relleno={esFavorito} />
      </span>
      {esFavorito ? 'Guardado' : 'Guardar'}
    </button>
  );
}

export default function Producto() {
  const { id } = useParams<{ id: string }>();
  const agregar = useCarrito((s) => s.agregar);
  const mostrarAviso = useAviso((s) => s.mostrar);
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
        const marcasX = x.compatibilidades.map((c) => c.marca);
        const marcasP = p.compatibilidades.map((c) => c.marca);
        const modelosX = x.compatibilidades.flatMap((c) => c.modelos);
        const modelosP = p.compatibilidades.flatMap((c) => c.modelos);
        const compartenModelo = modelosX.some((m) => modelosP.includes(m));
        const compartenMarca = marcasX.some((m) => marcasP.includes(m));
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
      <div className="contenedor py-16">
        <EstadoError onReintentar={() => setReintento((n) => n + 1)} />
      </div>
    );
  }
  if (cargando) {
    return (
      <div className="contenedor grid gap-8 py-8 lg:grid-cols-2" role="status" aria-label="Cargando producto">
        <div className="aspect-square animate-pulse rounded-xl bg-gris-fondo" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gris-fondo" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-gris-fondo" />
          <div className="h-12 w-1/2 animate-pulse rounded bg-gris-fondo" />
          <div className="h-14 w-full animate-pulse rounded bg-gris-fondo" />
        </div>
      </div>
    );
  }
  if (!producto) {
    return (
      <div className="contenedor py-16 text-center">
        <p className="text-xl font-bold">No encontramos este producto.</p>
        <p className="mt-2 text-base text-gris-600">Puede que ya no esté en el catálogo.</p>
        <Link to="/tienda" className="btn-primario mt-6">Ver todos los repuestos</Link>
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
    mostrarAviso(cantidad === 1 ? 'Agregado al carrito' : `${cantidad} unidades agregadas al carrito`);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2500);
  };

  const solicitarAviso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAviso) return;
    await registrarAvisoStock(producto.id, producto.sku, emailAviso);
    setAvisoOk(true);
  };

  const mensajeConsulta = `Hola, quiero consultar por el repuesto ${producto.nombre} (código ${producto.sku}). ¿Le sirve a mi máquina?`;

  return (
    <div className="contenedor py-5 sm:py-8">
      {/* Volver + miga de pan */}
      <nav aria-label="Ubicación" className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-gris-600">
        <Link to="/tienda" className="flex min-h-[44px] items-center gap-1.5 font-semibold text-verde hover:underline">
          <IconoFlecha direccion="izquierda" className="h-5 w-5" /> Repuestos
        </Link>
        <span aria-hidden="true">/</span>
        <Link to={`/tienda?categoria=${producto.categoria}`} className="hover:text-verde hover:underline">
          {producto.subcategoria}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <GaleriaFotos fotos={producto.fotos} alt={producto.nombre} categoria={producto.categoria} />

        <div>
          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-4xl">{producto.nombre}</h1>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-base text-gris-600">Código: <span className="font-semibold text-grafito">{producto.sku}</span></p>
            <BotonFavorito productoId={producto.id} nombre={producto.nombre} />
          </div>

          {/* Precio dinámico según cantidad y oferta */}
          <div className="mt-5 border-t border-borde pt-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-display text-5xl font-extrabold leading-none text-carbon sm:text-6xl">{formatoCLP(precioActual)}</span>
              {precioActual < producto.precio && (
                <s className="text-xl text-gris-600"><span className="sr-only">Antes </span>{formatoCLP(producto.precio)}</s>
              )}
              {enOferta(producto) && (
                <span className="rounded-full bg-oferta px-3 py-1 text-sm font-bold text-white">
                  Oferta −{porcentajeOferta(producto)}%
                </span>
              )}
            </div>
            <p className="mt-1 text-base text-gris-600">
              {cantidad > 1 ? 'Precio por unidad · ' : ''}IVA incluido
              {!enOferta(producto) && precioActual < producto.precio && (
                <span className="font-semibold text-verde"> · Precio por volumen aplicado</span>
              )}
            </p>
            <div className="mt-3"><BadgeStock producto={producto} /></div>
          </div>

          {/* Compra */}
          {!sinCompra ? (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-4">
                <label htmlFor="cantidad" className="text-lg font-semibold">Cantidad</label>
                <div className="stepper h-[52px]">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                    aria-label="Quitar una unidad"
                  >
                    −
                  </button>
                  <input
                    id="cantidad"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={maxCantidad}
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.min(maxCantidad, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                    className="w-16 border-x-2 border-carbon text-center text-xl font-bold outline-none [appearance:textfield] focus:bg-naranja-suave [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => setCantidad(Math.min(maxCantidad, cantidad + 1))}
                    disabled={cantidad >= maxCantidad}
                    aria-label="Agregar una unidad"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={alAgregar}
                className={`${agregado ? 'btn-verde' : 'btn-primario'} btn-grande w-full`}
                aria-live="polite"
              >
                {agregado ? (
                  '✓ Agregado al carrito'
                ) : (
                  <>
                    <IconoCarrito className="h-6 w-6" />
                    {estado === 'bajo_pedido' ? 'Pedir bajo encargo' : 'Agregar al carrito'}
                    {cantidad > 1 && ` · ${formatoCLP(precioActual * cantidad)}`}
                  </>
                )}
              </button>
              <p className="flex items-start gap-2 text-base text-gris-600">
                <IconoPin className="mt-0.5 h-5 w-5 shrink-0 text-verde" />
                <span>Retiro gratis en Puerto Aysén, o envío a todo Chile desde {formatoCLP(envioDesde(cantidad))}.</span>
              </p>
              {agregado && (
                <Link to="/carrito" className="btn-secundario animar-entrada w-full">
                  Ir al carrito y pagar <IconoFlecha className="h-5 w-5" />
                </Link>
              )}
            </div>
          ) : (
            /* Avísame cuando llegue */
            <div className="mt-6 rounded-xl border-2 border-borde bg-gris-fondo p-5">
              <h2 className="text-xl font-bold">Este producto está agotado</h2>
              {avisoOk ? (
                <p className="mt-2 flex items-start gap-2 text-base font-semibold text-verde">
                  <IconoCheck className="h-6 w-6 shrink-0" /> Listo. Te avisaremos a {emailAviso} cuando vuelva.
                </p>
              ) : (
                <form onSubmit={solicitarAviso} className="mt-3 space-y-3">
                  <label htmlFor="correo-aviso" className="etiqueta">Déjanos tu correo y te avisamos cuando llegue</label>
                  <input
                    id="correo-aviso"
                    type="email"
                    required
                    autoComplete="email"
                    value={emailAviso}
                    onChange={(e) => setEmailAviso(e.target.value)}
                    placeholder="tu@correo.cl"
                    className="campo"
                  />
                  <button type="submit" className="btn-primario w-full">Avísame cuando llegue</button>
                </form>
              )}
            </div>
          )}

          {/* Duda de compatibilidad: salida humana */}
          <div className="mt-4 rounded-xl bg-verde-badge p-4">
            <p className="text-base font-semibold text-verde-oscuro">¿No estás seguro si le sirve a tu máquina?</p>
            <a href={enlaceWhatsApp(mensajeConsulta)} target="_blank" rel="noreferrer" className="btn-whatsapp mt-3 w-full">
              <IconoWhatsApp className="h-5 w-5" /> Preguntar por WhatsApp
            </a>
          </div>

          {/* Entrega y garantías */}
          <ul className="mt-6 space-y-3 text-base">
            <li className="flex items-start gap-3">
              <IconoPin className="mt-0.5 h-6 w-6 shrink-0 text-verde" />
              <span><strong>Retiro gratis</strong> en nuestra tienda de Puerto Aysén</span>
            </li>
            <li className="flex items-start gap-3">
              <IconoCamion className="mt-0.5 h-6 w-6 shrink-0 text-verde" />
              <span><strong>Envío a todo Chile.</strong> Ves el costo antes de pagar</span>
            </li>
            <li className="flex items-start gap-3">
              <IconoEscudo className="mt-0.5 h-6 w-6 shrink-0 text-verde" />
              <span><strong>Pago seguro</strong> con Webpay, Mercado Pago o transferencia</span>
            </li>
          </ul>

          {/* Tabla de precios por volumen */}
          {producto.preciosPorVolumen.length > 1 && (
            <div className="mt-8">
              <h2 className="mb-1 text-xl font-bold">Más barato por cantidad</h2>
              <p className="mb-3 text-base text-gris-600">Mientras más unidades lleves, menor es el precio de cada una.</p>
              <TablaVolumen tramos={producto.preciosPorVolumen} cantidadActual={cantidad} />
            </div>
          )}

          {/* Compatibilidad */}
          {producto.compatibilidades.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-xl font-bold">Le sirve a estas máquinas</h2>
              <ul className="divide-y divide-borde rounded-xl border border-borde">
                {producto.compatibilidades.map((c) => (
                  <li key={c.marca} className="flex flex-wrap items-center gap-2 p-3">
                    <Link
                      to={`/tienda?marca=${encodeURIComponent(c.marca)}`}
                      className="enlace mr-1 text-lg"
                    >
                      {c.marca}
                    </Link>
                    {c.modelos.length > 0 ? (
                      c.modelos.map((m) => (
                        <span key={m} className="rounded-full border border-borde bg-gris-fondo px-3 py-1 text-base text-grafito">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-base text-gris-600">Todos los modelos</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Descripción */}
          <div className="mt-8">
            <h2 className="mb-2 text-xl font-bold">Descripción</h2>
            {producto.descripcion.trim() ? (
              <p className="max-w-prose text-base leading-relaxed text-grafito">{producto.descripcion}</p>
            ) : (
              <p className="text-base leading-relaxed text-gris-600">
                Aún no tenemos una descripción detallada. Escríbenos y te confirmamos si le sirve a tu máquina.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Productos relacionados — cross-sell por compatibilidad */}
      {relacionados.length > 0 && (
        <section className="mt-14 border-t border-borde pt-10">
          <h2 className="titulo-seccion">Completa tu mantención</h2>
          <p className="bajada-seccion">
            Repuestos que sirven a las mismas máquinas que {producto.nombre.toLowerCase().startsWith('kit') ? 'este kit' : 'este producto'}.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {relacionados.map((r) => (
              <TarjetaProducto key={r.id} producto={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
