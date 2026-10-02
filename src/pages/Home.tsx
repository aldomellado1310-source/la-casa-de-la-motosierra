// ============================================================
// Portada (propuesta A · "Naranja a fondo"):
// 1. Hero naranja a sangre: pregunta grande, buscador con sombra
//    dura y chips de categorías (en escritorio, el selector de
//    marca va al lado).
// 2. Cinta negra en movimiento con las garantías.
// 3. Elige tu marca (móvil) → repuestos que le sirven.
// 4. Riel "Lo más pedido" con stickers de oferta.
// 5. Ayuda humana, categorías, taller con foto, cómo comprar y
//    garantías.
// ============================================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BuscadorCompatibilidad from '../components/BuscadorCompatibilidad';
import BuscadorConSugerencias from '../components/BuscadorConSugerencias';
import EstadoError from '../components/EstadoError';
import TarjetaProducto from '../components/TarjetaProducto';
import { ICONO_CATEGORIA } from '../components/FotoProducto';
import {
  IconoCamara, IconoCamion, IconoCheck, IconoEngranaje, IconoEscudo, IconoFlecha, IconoLlave,
  IconoTelefono, IconoWhatsApp,
} from '../components/Iconos';
import { DIRECCION_TIENDA, ENLACE_LLAMAR, TELEFONO_VISIBLE, enlaceWhatsApp } from '../config/tienda';
import { obtenerCategorias, obtenerProductos } from '../services/productos';
import { estadoStock } from '../utils/precio';
import { useSeo } from '../utils/seo';
import type { Categoria, Producto } from '../types';

/** Garantías que recorren la cinta negra */
const CINTA = ['Retiro gratis en Aysén', 'Envío a todo Chile', 'Pago con Webpay', 'Taller propio', 'Stock real'];

/** Pasos reales de una compra, en orden */
const PASOS_COMPRA = [
  ['Busca tu repuesto', 'Por tu máquina, por categoría o escribiendo lo que necesitas.'],
  ['Agrégalo al carrito', 'Ves el precio final y el costo de envío antes de pagar.'],
  ['Paga y recíbelo', 'Webpay, Mercado Pago o transferencia. Retiro gratis en la tienda o despacho a todo Chile.'],
];

export default function Home() {
  useSeo({
    titulo: 'Repuestos forestales con buscador por marca y modelo',
    descripcion:
      'Repuestos para motosierras y desbrozadoras en Puerto Aysén: busca por marca y modelo, stock real visible y despacho a todo Chile con costo conocido antes de pagar.',
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const cargar = () => {
    setError(false);
    setCargando(true);
    Promise.all([obtenerProductos(), obtenerCategorias()])
      .then(([ps, cs]) => {
        setProductos(ps);
        setCategorias(cs);
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  };
  useEffect(cargar, []);

  const marcados = productos.filter((p) => p.destacado || (p.precioOferta && p.precioOferta < p.precio));
  // Sin destacados ni ofertas (catálogo recién importado): mostrar productos con stock
  const destacados = (marcados.length > 0 ? marcados : productos.filter((p) => estadoStock(p) !== 'agotado')).slice(0, 8);
  const conteoPorCategoria = (id: string) => productos.filter((p) => p.categoria === id).length;

  return (
    <div>
      {/* ── Hero naranja a sangre ────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-naranja text-carbon">
        {/* Silueta de motosierra gigante y tenue (decorativa) */}
        <svg viewBox="0 0 200 120" className="pointer-events-none absolute -right-16 top-8 -z-10 w-[320px] opacity-[0.12] sm:w-[520px] lg:right-[38%]" aria-hidden="true">
          <rect x="4" y="62" width="130" height="20" rx="10" fill="#0E0F0E" />
          <path d="M116 40h54a18 18 0 0 1 18 18v26a12 12 0 0 1-12 12h-58a12 12 0 0 1-12-12V52a12 12 0 0 1 10-12z" fill="#0E0F0E" />
          <path d="M128 40V22a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v18h-12V26h-20v14z" fill="#0E0F0E" />
        </svg>

        <div className="contenedor grid gap-8 pb-12 pt-6 sm:pb-16 sm:pt-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:py-16">
          <div className="animar-hero flex min-w-0 flex-col gap-5">
            <h1 className="font-display text-[3.1rem] font-extrabold uppercase leading-[0.9] sm:text-7xl">
              ¿Qué le hace falta a tu máquina?
            </h1>
            <p className="max-w-xl text-lg font-medium sm:text-xl">
              Repuestos para motosierras y desbrozadoras, con stock real y envío a todo Chile.
            </p>

            {/* Buscador con sombra dura */}
            <div className="rounded-[12px] shadow-dura">
              <BuscadorConSugerencias />
            </div>

            {/* Chips de categorías: un toque y listo */}
            <div className="riel -mx-4 gap-2 px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {categorias.map((c) => (
                <Link
                  key={c.id}
                  to={`/tienda?categoria=${c.id}`}
                  className="flex min-h-[48px] shrink-0 items-center whitespace-nowrap rounded-full border-2 border-carbon bg-naranja-suave px-4 text-base font-bold text-carbon transition-transform duration-150 hover:-translate-y-0.5 active:scale-95"
                >
                  {c.nombre}
                </Link>
              ))}
            </div>
          </div>

          {/* Selector de marca: al lado en escritorio, debajo de la cinta en móvil */}
          <div className="animar-hero hidden [animation-delay:80ms] lg:block">
            <BuscadorCompatibilidad />
          </div>
        </div>
      </section>

      {/* ── Cinta negra en movimiento ────────────────────── */}
      {/* El contenedor recorta la cinta inclinada para que no desborde el ancho */}
      <div className="relative z-[1] -mt-7 overflow-hidden py-3" aria-hidden="true">
        <div className="-mx-4 -rotate-2 overflow-hidden bg-carbon py-3 text-white">
          <div className="cinta-movil flex w-max gap-7 whitespace-nowrap font-display text-xl font-bold uppercase tracking-wide">
            {[...CINTA, ...CINTA, ...CINTA, ...CINTA].map((t, i) => (
              <span key={i} className="flex items-center gap-7">
                {t}
                <span className="text-naranja">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Las garantías para lectores de pantalla (la cinta es decorativa) */}
      <p className="sr-only">{CINTA.join(', ')}.</p>

      {/* ── Elige tu marca (móvil y tablet) ──────────────── */}
      <section className="contenedor pt-7 lg:hidden">
        <BuscadorCompatibilidad />
      </section>

      {/* Error de carga del catálogo (no bloquea el hero) */}
      {error && (
        <div className="contenedor pt-10">
          <EstadoError onReintentar={cargar} />
        </div>
      )}

      {/* ── Lo más pedido: riel con stickers ─────────────── */}
      <section className="pt-12">
        <div className="contenedor flex items-end justify-between gap-4">
          <div>
            <h2 className="titulo-seccion">Lo más pedido</h2>
            <p className="bajada-seccion">Precios con IVA incluido. Desliza para ver más.</p>
          </div>
          <Link to="/tienda" className="enlace hidden shrink-0 text-lg sm:inline">Ver todo</Link>
        </div>
        <div className="riel mx-auto mt-5 max-w-7xl gap-3 px-4 pb-5 pt-1 sm:gap-4 sm:px-6">
          {cargando && productos.length === 0
            ? Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-[420px] w-[210px] shrink-0 animate-pulse rounded-[18px] bg-gris-fondo sm:w-[250px]" />
              ))
            : destacados.map((p) => (
                <div key={p.id} className="w-[210px] shrink-0 sm:w-[250px]">
                  <TarjetaProducto producto={p} />
                </div>
              ))}
        </div>
        <div className="contenedor">
          <Link to="/tienda" className="btn-secundario w-full sm:w-auto">
            Ver todos los repuestos <IconoFlecha className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ── Ayuda humana: foto o llamada ─────────────────── */}
      <section className="contenedor pt-12">
        <div className="flex flex-col gap-5 rounded-[22px] border-2 border-carbon bg-naranja-suave p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-carbon text-naranja">
              <IconoCamara className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase leading-none">¿No sabes qué pieza es?</h2>
              <p className="mt-2 max-w-xl text-base">
                Mándanos una foto de la pieza o de tu máquina por WhatsApp y te decimos cuál es.
                O llámanos al <strong className="whitespace-nowrap">{TELEFONO_VISIBLE}</strong>.
              </p>
            </div>
          </div>
          <div className="grid shrink-0 gap-3 sm:grid-cols-2 md:flex">
            <a
              href={enlaceWhatsApp('Hola, les envío una foto de la pieza que necesito:')}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <IconoWhatsApp className="h-6 w-6" /> Enviar foto
            </a>
            <a href={ENLACE_LLAMAR} className="btn-secundario">
              <IconoTelefono className="h-5 w-5" /> Llamar
            </a>
          </div>
        </div>
      </section>

      {/* ── Categorías en lista grande ───────────────────── */}
      <section className="contenedor pt-12">
        <h2 className="titulo-seccion">Todas las categorías</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cargando && categorias.length === 0
            ? Array.from({ length: 8 }, (_, i) => <div key={i} className="h-[76px] animate-pulse rounded-2xl bg-gris-fondo" />)
            : categorias.map((c) => {
                const Icono = ICONO_CATEGORIA[c.id] ?? IconoEngranaje;
                const n = conteoPorCategoria(c.id);
                return (
                  <Link
                    key={c.id}
                    to={`/tienda?categoria=${c.id}`}
                    className="group flex min-h-[76px] min-w-0 items-center gap-4 rounded-2xl border-2 border-carbon bg-white px-4 py-3 transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-dura"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-naranja text-carbon">
                      <Icono className="h-7 w-7" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold leading-tight">
                        {/* Corte permitido tras "/" (ej: Desbrozadoras/Orilladoras) */}
                        {c.nombre.replace(/\//g, '/​')}
                      </span>
                      <span className="block text-sm text-gris-600">
                        {n > 0 ? `${n} producto${n === 1 ? '' : 's'}` : 'Consultar disponibilidad'}
                      </span>
                    </span>
                    <IconoFlecha className="h-5 w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
        </div>
      </section>

      {/* ── Taller con foto ──────────────────────────────── */}
      <section className="contenedor pt-12">
        <div className="relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[22px] bg-carbon text-white sm:min-h-[360px]">
          <img src="/hero.webp" alt="" loading="lazy" width={1600} height={840} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" />
          <div className="flex flex-col items-start gap-3 p-5 sm:max-w-xl sm:p-8">
            <span className="rounded-full bg-naranja px-3.5 py-1 text-sm font-bold text-carbon">Taller en Puerto Aysén</span>
            <h2 className="font-display text-[2.6rem] font-extrabold uppercase leading-[0.95] sm:text-5xl">¿Tu máquina falla?</h2>
            <p className="text-lg">
              Tráela al taller o mándanos un video. Te decimos qué tiene y cuánto cuesta arreglarla.
            </p>
            <div className="mt-1 flex w-full flex-col gap-3 sm:flex-row">
              <a
                href={enlaceWhatsApp('Hola, necesito servicio técnico para mi máquina')}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                <IconoWhatsApp className="h-6 w-6" /> Enviar video por WhatsApp
              </a>
              <Link to="/nosotros" className="btn border-2 border-white text-white hover:bg-white hover:text-carbon">
                <IconoLlave className="h-5 w-5" /> Conocer el taller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo comprar: secuencia real en 3 pasos ──────── */}
      <section className="contenedor pt-14">
        <h2 className="titulo-seccion">Comprar es fácil</h2>
        <p className="bajada-seccion">
          Y si prefieres, ven a la tienda en {DIRECCION_TIENDA} o pídelo por teléfono.
        </p>
        <ol className="mt-7 grid gap-6 md:grid-cols-3 md:gap-8">
          {PASOS_COMPRA.map(([titulo, detalle], i) => (
            <li key={titulo} className="flex gap-4 md:flex-col md:gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-carbon bg-naranja font-display text-4xl font-extrabold text-carbon shadow-dura-sm">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-bold">{titulo}</h3>
                <p className="mt-1 text-base text-gris-600">{detalle}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Garantías ────────────────────────────────────── */}
      <section className="contenedor pt-14">
        <div className="grid gap-6 rounded-[22px] bg-gris-fondo p-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [IconoEscudo, 'Compra protegida', 'Pagas con Webpay de Transbank.'],
            [IconoCheck, 'Garantía', 'Repuestos originales y alternativos de calidad.'],
            [IconoCamion, 'Cambios en 10 días', 'Si no le sirve a tu máquina, lo cambiamos.'],
            [IconoTelefono, 'Atención de persona', 'Te responde alguien de la tienda, no un robot.'],
          ].map(([Icono, titulo, detalle]) => {
            const I = Icono as React.ComponentType<{ className?: string }>;
            return (
              <div key={titulo as string} className="flex items-start gap-3">
                <I className="mt-0.5 h-7 w-7 shrink-0 text-verde" />
                <div>
                  <p className="text-lg font-bold leading-tight">{titulo as string}</p>
                  <p className="mt-0.5 text-base text-gris-600">{detalle as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
