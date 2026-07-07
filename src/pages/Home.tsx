// ============================================================
// Portada (mockup aprobado): hero fotográfico con buscador de
// compatibilidad + tarjeta de beneficios, categorías en fila,
// destacados con ofertas, marcas, servicio técnico y franja de
// confianza.
// ============================================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BuscadorCompatibilidad from '../components/BuscadorCompatibilidad';
import TarjetaProducto from '../components/TarjetaProducto';
import {
  IconoCadena, IconoCamion, IconoCarrito, IconoDocumento, IconoEngranaje, IconoEscudo,
  IconoHoja, IconoLlave, IconoMotosierra, IconoPin, IconoWhatsApp,
} from '../components/Iconos';
import { MarcaMotosierra } from '../components/LogoLCM';
import { WHATSAPP_NUMERO } from '../config/firebase';
import { obtenerCategorias, obtenerMarcasCompatibles, obtenerProductos } from '../services/productos';
import { useSeo } from '../utils/seo';
import type { Categoria, Producto } from '../types';

/** Icono de línea por categoría */
const ICONO_CATEGORIA: Record<string, React.ComponentType<{ className?: string }>> = {
  motosierras: IconoMotosierra,
  desbrozadoras: IconoHoja,
  'espadas-cadenas': IconoCadena,
  'filtros-bujias': IconoEngranaje,
  'carburacion-arranque': IconoEngranaje,
  'aceites-lubricantes': IconoHoja,
  'herramientas-seguridad': IconoEscudo,
  'repuestos-varios': IconoEngranaje,
};

export default function Home() {
  useSeo({
    titulo: 'Repuestos forestales con buscador por marca y modelo',
    descripcion:
      'Repuestos para motosierras y desbrozadoras en Puerto Aysén: busca por marca y modelo, stock real visible y despacho a todo Chile con costo conocido antes de pagar.',
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);

  useEffect(() => {
    void obtenerProductos().then(setProductos);
    void obtenerCategorias().then(setCategorias);
    void obtenerMarcasCompatibles().then(setMarcas);
  }, []);

  const destacados = productos.filter((p) => p.destacado || (p.precioOferta && p.precioOferta < p.precio)).slice(0, 8);
  const conteoPorCategoria = (id: string) => productos.filter((p) => p.categoria === id).length;

  return (
    <div>
      {/* ── Hero fotográfico ─────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-carbon">
        <img
          src="/hero.jpg"
          alt=""
          aria-hidden="true"
          className="animar-kenburns absolute inset-0 h-full w-full object-cover opacity-45"
        />
        {/* Velo para legibilidad del texto blanco */}
        <div className="absolute inset-0 bg-gradient-to-r from-carbon/80 via-carbon/45 to-carbon/25" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1.1fr_1fr_0.8fr] lg:items-center lg:py-14">
          {/* Titular — entrada única del hero, con la marca como protagonista */}
          <div className="animar-hero text-white">
            <p className="mb-3 inline-block border-b-[3px] border-naranja pb-1.5 font-display text-xl font-bold uppercase tracking-[0.14em] sm:text-2xl">
              La Casa de la Motosierra
            </p>
            <h1 className="font-display text-4xl font-bold uppercase leading-none sm:text-5xl">
              Todo para tu trabajo<br />
              <span className="text-naranja">forestal y agrícola</span>
            </h1>
            <p className="mt-4 max-w-md text-white/85 sm:text-lg">
              Repuestos originales y alternativos, maquinaria y accesorios.
              Envíos rápidos a todo Chile.
            </p>
            <ul className="mt-8 hidden max-w-md grid-cols-2 gap-x-6 gap-y-4 text-sm lg:grid">
              {[
                ['Stock real', 'Siempre actualizado'],
                ['Envíos a todo Chile', 'Rápidos y seguros'],
                ['Asesoría experta', 'Te ayudamos a elegir'],
                ['Compra segura', 'Webpay y más'],
              ].map(([titulo, detalle]) => (
                <li key={titulo}>
                  <span className="block font-bold">{titulo}</span>
                  <span className="text-white/70">{detalle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buscador de compatibilidad — protagonista, entra 80 ms después del titular */}
          <div className="animar-hero [animation-delay:80ms]">
            <BuscadorCompatibilidad />
          </div>

          {/* Beneficios */}
          <aside className="hidden rounded-2xl bg-white p-2 shadow-tarjeta lg:block">
            {[
              [IconoCarrito, 'Retiro en tienda', 'Gratis en Puerto Aysén'],
              [IconoCamion, 'Despachos a todo Chile', 'Cotiza tu envío en el checkout'],
              [IconoEscudo, 'Métodos de pago', 'Webpay, Mercado Pago, transferencia'],
              [IconoDocumento, 'Cotizaciones para empresas', 'Genera cotizaciones formales en PDF'],
            ].map(([Icono, titulo, detalle], i) => (
              <div key={titulo as string} className={`flex items-start gap-3 p-3.5 ${i > 0 ? 'border-t border-borde' : ''}`}>
                <Icono className="mt-0.5 h-6 w-6 shrink-0 text-verde" />
                <div>
                  <p className="text-sm font-bold">{titulo as string}</p>
                  <p className="text-xs text-gris-600">{detalle as string}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* ── Categorías principales ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="titulo-seccion mb-5">Categorías principales</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categorias.map((c) => {
            const Icono = ICONO_CATEGORIA[c.id] ?? IconoEngranaje;
            const n = conteoPorCategoria(c.id);
            return (
              <Link
                key={c.id}
                to={`/tienda?categoria=${c.id}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-borde bg-white p-4 text-center transition-colors duration-150 hover:border-verde"
              >
                <Icono className="h-8 w-8 text-grafito transition-colors group-hover:text-verde" />
                <span className="text-sm font-semibold leading-tight">{c.nombre}</span>
                <span className="text-xs text-gris-600">{n} producto{n === 1 ? '' : 's'}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Productos destacados ─────────────────────────── */}
      <section className="bg-gris-fondo">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="titulo-seccion">Productos destacados</h2>
              <span className="rounded-full bg-verde-badge px-3 py-1 text-xs font-bold text-verde-oscuro">
                Ofertas y novedades
              </span>
            </div>
            <Link to="/tienda" className="text-sm font-semibold text-verde hover:underline">
              Ver todos los productos →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {destacados.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Marcas compatibles ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="titulo-seccion">Repuestos por marca</h2>
          <Link to="/marcas" className="text-sm font-semibold text-verde hover:underline">
            Ver todas las marcas →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {marcas.map((m) => (
            <Link
              key={m}
              to={`/tienda?marca=${encodeURIComponent(m)}`}
              className="rounded-lg border border-borde bg-white px-5 py-3 text-sm font-bold text-grafito transition-colors duration-150 hover:border-verde hover:text-verde"
            >
              {m}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Servicio técnico + lema ──────────────────────── */}
      <section className="relative isolate overflow-hidden bg-carbon text-white">
        {/* Marca de agua: la motosierra del logo, gigante y tenue */}
        <MarcaMotosierra
          mono
          className="pointer-events-none absolute -bottom-10 -right-6 -z-10 h-56 w-auto rotate-[-8deg] text-white opacity-[0.06] sm:h-96"
        />
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-lg font-semibold uppercase tracking-wide text-naranja">
              “Economía para la Gente de Aysén”
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
              Repuestos y servicio técnico
            </h2>
            <p className="mt-3 text-white/75">
              ¿Tu máquina falla y no sabes qué pieza es? Tráela al taller o envíanos una foto
              por WhatsApp: la diagnosticamos, cotizamos la reparación y te avisamos cuando
              esté lista.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, necesito servicio técnico para mi máquina')}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primario px-6 py-3"
            >
              <IconoWhatsApp className="h-5 w-5" /> Consultar por WhatsApp
            </a>
            <Link to="/nosotros" className="btn-secundario border-white/30 bg-transparent px-6 py-3 text-white hover:border-white">
              <IconoLlave className="h-5 w-5" /> Conocer el taller
            </Link>
          </div>
        </div>
      </section>

      {/* ── Franja de confianza ──────────────────────────── */}
      <section className="border-t border-borde bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [IconoWhatsApp, 'Atención personalizada', 'Te asesoramos por WhatsApp'],
            [IconoEscudo, 'Garantía de calidad', 'Repuestos originales y alternativos'],
            [IconoCamion, 'Devoluciones fáciles', '10 días para cambios'],
            [IconoCarrito, 'Compra segura', 'Protegido por Webpay'],
            [IconoPin, 'Empresa local', 'Comprometidos con Aysén'],
          ].map(([Icono, titulo, detalle]) => (
            <div key={titulo as string} className="flex items-start gap-3">
              <Icono className="mt-0.5 h-6 w-6 shrink-0 text-verde" />
              <div>
                <p className="text-sm font-bold">{titulo as string}</p>
                <p className="text-xs text-gris-600">{detalle as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

