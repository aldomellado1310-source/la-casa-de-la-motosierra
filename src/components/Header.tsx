// ============================================================
// Header.
// · Móvil: franja informativa, logo + botón "Llamar" rotulado y
//   buscador grande. La navegación vive en la BarraInferior
//   (fija abajo, al alcance del pulgar), así el header no se
//   desborda ni esconde el carrito.
// · Escritorio (md+): 3 franjas fijas arriba — (1) barra carbón
//   con despachos/ubicación/horario/teléfono, (2) logo + buscador
//   + cuenta/favoritos/carrito con rótulo, (3) nav verde.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { obtenerCategorias } from '../services/productos';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';
import { useFavoritos } from '../stores/useFavoritos';
import { formatoCLP } from '../utils/precio';
import { ENLACE_LLAMAR, HORARIO_CORTO, TELEFONO_VISIBLE } from '../config/tienda';
import LogoLCM from './LogoLCM';
import BuscadorConSugerencias from './BuscadorConSugerencias';
import {
  IconoCamion, IconoCarrito, IconoCorazon, IconoEngranaje, IconoMenu, IconoPin, IconoReloj,
  IconoTelefono, IconoUsuario,
} from './Iconos';
import type { Categoria } from '../types';

/** Enlaces de la nav verde (escritorio). El 3er valor oculta el enlace bajo lg. */
const ENLACES_NAV: [string, string, boolean?][] = [
  ['/compatibilidad', 'Buscar por mi máquina'],
  ['/tienda?ofertas=1', 'Ofertas'],
  ['/marcas', 'Marcas'],
  ['/nosotros', 'Servicio técnico'],
  ['/cotizaciones/nueva', 'Empresas', true],
  ['/seguimiento', 'Mi pedido', true],
  ['/preguntas-frecuentes', 'Ayuda', true],
];

/** Acceso con ícono y rótulo debajo (cuenta, favoritos, carrito) */
function AccesoRotulado({
  a, icono, rotulo, detalle, contador, etiquetaAria,
}: {
  a: string;
  icono: React.ReactNode;
  rotulo: string;
  detalle?: string;
  contador?: number;
  etiquetaAria?: string;
}) {
  return (
    <Link
      to={a}
      aria-label={etiquetaAria}
      className="relative flex min-h-[52px] items-center gap-4 rounded-[10px] px-3 py-1.5 text-grafito transition-colors hover:bg-gris-fondo"
    >
      <span className="relative">
        {icono}
        {contador !== undefined && contador > 0 && (
          <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-naranja px-1 text-xs font-bold text-carbon">
            {contador}
          </span>
        )}
      </span>
      <span className="hidden text-left leading-tight lg:block">
        <span className="block text-sm font-bold">{rotulo}</span>
        {detalle && <span className="block text-xs text-gris-600">{detalle}</span>}
      </span>
    </Link>
  );
}

export default function Header() {
  const { usuario } = useAuth();
  const ubicacion = useLocation();
  const totalCarrito = useCarrito((s) => s.total());
  const unidades = useCarrito((s) => s.unidades());
  const totalFavoritos = useFavoritos((s) => s.ids.length);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [compacto, setCompacto] = useState(false);
  const refCategorias = useRef<HTMLDivElement>(null);

  // Compacta el header de escritorio al hacer scroll
  useEffect(() => {
    let rafId = 0;
    const alDesplazar = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setCompacto(window.scrollY > 72));
    };
    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => {
      window.removeEventListener('scroll', alDesplazar);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    void obtenerCategorias().then(setCategorias);
  }, []);

  // Cierra el desplegable de categorías al hacer clic fuera o con Escape
  useEffect(() => {
    if (!categoriasAbiertas) return;
    const cerrar = (e: MouseEvent) => {
      if (!refCategorias.current?.contains(e.target as Node)) setCategoriasAbiertas(false);
    };
    const alEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCategoriasAbiertas(false);
    };
    document.addEventListener('mousedown', cerrar);
    document.addEventListener('keydown', alEscape);
    return () => {
      document.removeEventListener('mousedown', cerrar);
      document.removeEventListener('keydown', alEscape);
    };
  }, [categoriasAbiertas]);

  return (
    <header className="z-nav bg-white md:sticky md:top-0 md:shadow-md">
      {/* 1 · Barra superior carbón */}
      <div className="bg-carbon text-white">
        <div className="contenedor flex items-center justify-between gap-4 py-2 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <IconoCamion className="h-4 w-4 shrink-0 text-naranja" />
            <span>
              Despacho a todo Chile <span className="text-white/50">·</span>{' '}
              <span className="whitespace-nowrap">Retiro gratis en Aysén</span>
            </span>
          </p>
          <div className="hidden items-center gap-5 lg:flex">
            <span className="flex items-center gap-1.5"><IconoPin className="h-4 w-4 text-naranja" /> Puerto Aysén</span>
            <span className="flex items-center gap-1.5"><IconoReloj className="h-4 w-4 text-naranja" /> {HORARIO_CORTO}</span>
            <a href={ENLACE_LLAMAR} className="flex items-center gap-1.5 font-bold hover:text-naranja">
              <IconoTelefono className="h-4 w-4 text-naranja" /> {TELEFONO_VISIBLE}
            </a>
          </div>
        </div>
      </div>

      {/* 2 · Barra principal blanca */}
      <div className="border-b border-borde bg-white">
        <div
          className={`contenedor flex items-center gap-3 transition-[padding] duration-200 lg:gap-6 ${
            compacto ? 'md:py-1.5' : 'md:py-3'
          } py-2.5`}
        >
          <Link to="/" aria-label="Ir al inicio: La Casa de la Motosierra" className="shrink-0">
            {/* Logo real del cliente; se achica al hacer scroll en escritorio */}
            <span className="md:hidden"><LogoLCM tamano="lg" /></span>
            <span className="hidden md:block"><LogoLCM tamano={compacto ? 'lg' : 'xl'} /></span>
          </Link>

          {/* Buscador de escritorio (en la portada aparece al bajar: arriba ya está el del hero) */}
          <div className="hidden flex-1 md:block">
            {(ubicacion.pathname !== '/' || compacto) && <BuscadorConSugerencias />}
          </div>

          {/* Móvil: llamar con un toque (rotulado, no solo ícono) */}
          <a
            href={ENLACE_LLAMAR}
            className="ml-auto flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-carbon px-4 text-base font-bold text-white md:hidden"
          >
            <IconoTelefono className="h-5 w-5 text-naranja" /> Llamar
          </a>

          {/* Escritorio: cuenta, favoritos, carrito */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Cuenta y carrito">
            <AccesoRotulado
              a={usuario ? '/mi-cuenta' : '/ingresar'}
              icono={<IconoUsuario className="h-7 w-7" />}
              rotulo="Mi cuenta"
              detalle={usuario ? `Hola, ${usuario.nombre.split(' ')[0]}` : 'Ingresar'}
              etiquetaAria={usuario ? 'Mi cuenta' : 'Ingresar a mi cuenta'}
            />
            <AccesoRotulado
              a="/favoritos"
              icono={<IconoCorazon className="h-7 w-7" />}
              rotulo="Favoritos"
              contador={totalFavoritos}
              etiquetaAria={`Favoritos (${totalFavoritos})`}
            />
            <AccesoRotulado
              a="/carrito"
              icono={<IconoCarrito className="h-7 w-7" />}
              rotulo="Carrito"
              detalle={formatoCLP(totalCarrito)}
              contador={unidades}
              etiquetaAria={`Carrito: ${unidades} productos, total ${formatoCLP(totalCarrito)}`}
            />
          </nav>
        </div>

        {/* Buscador móvil (en la portada lo trae el hero naranja) */}
        {ubicacion.pathname !== '/' && (
          <div className="contenedor pb-3 md:hidden">
            <BuscadorConSugerencias />
          </div>
        )}
      </div>

      {/* 3 · Nav verde (solo escritorio; en móvil está la barra inferior) */}
      <nav className="hidden bg-carbon text-white md:block" aria-label="Navegación principal">
        <div className="contenedor flex items-center gap-1 py-1.5">
          {/* Categorías */}
          <div className="relative" ref={refCategorias}>
            <button
              onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
              className="flex min-h-[44px] items-center gap-2 rounded-full bg-naranja px-5 text-base font-bold text-carbon transition-colors hover:bg-naranja-hover"
              aria-expanded={categoriasAbiertas}
              aria-haspopup="true"
            >
              <IconoMenu className="h-5 w-5" /> Categorías
            </button>
            {categoriasAbiertas && (
              <div className="animar-entrada absolute left-0 top-full z-flotante mt-2 w-80 overflow-hidden rounded-xl border border-borde bg-white py-2 shadow-tarjeta">
                <Link
                  to="/tienda"
                  onClick={() => setCategoriasAbiertas(false)}
                  className="block px-5 py-3 text-base font-bold text-verde hover:bg-gris-fondo"
                >
                  Ver todos los repuestos
                </Link>
                {categorias.map((c) => (
                  <Link
                    key={c.id}
                    to={`/tienda?categoria=${c.id}`}
                    onClick={() => setCategoriasAbiertas(false)}
                    className="block border-t border-borde px-5 py-3 text-base font-medium text-grafito hover:bg-gris-fondo"
                  >
                    {c.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {ENLACES_NAV.map(([ruta, texto, soloAncho]) => {
            // Activo = misma ruta y mismo query (Ofertas ≠ resto de la tienda)
            const activo = ruta === ubicacion.pathname + ubicacion.search;
            return (
              <Link
                key={texto}
                to={ruta}
                aria-current={activo ? 'page' : undefined}
                className={`${soloAncho ? 'hidden lg:flex' : 'flex'} min-h-[44px] items-center whitespace-nowrap rounded-full px-4 text-base font-semibold transition-colors ${
                  activo ? 'bg-white text-carbon' : 'hover:bg-white/15'
                }`}
              >
                {texto}
              </Link>
            );
          })}

          {/* Acceso al panel — solo cuentas con rol admin */}
          {usuario?.rol === 'admin' && (
            <Link
              to="/admin"
              className="ml-auto flex min-h-[44px] items-center gap-2 rounded-[10px] border-2 border-white/40 px-4 text-sm font-bold transition-colors hover:bg-white hover:text-verde"
            >
              <IconoEngranaje className="h-4 w-4" /> Panel admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
