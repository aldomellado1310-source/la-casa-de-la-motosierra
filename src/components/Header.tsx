// ============================================================
// Header en 3 franjas (según mockup aprobado):
// 1. Barra carbón: despachos, ubicación, horario, WhatsApp.
// 2. Barra blanca: logo, buscador con botón, cuenta, favoritos,
//    carrito con total.
// 3. Nav verde: botón "Todas las categorías" + enlaces.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMERO } from '../config/firebase';
import { obtenerCategorias } from '../services/productos';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';
import { useFavoritos } from '../stores/useFavoritos';
import { formatoCLP } from '../utils/precio';
import LogoLCM from './LogoLCM';
import BuscadorConSugerencias from './BuscadorConSugerencias';
import { IconoCarrito, IconoCorazon, IconoEngranaje, IconoMenu, IconoPin, IconoReloj, IconoUsuario, IconoWhatsApp } from './Iconos';
import type { Categoria } from '../types';

const ENLACES_NAV: [string, string, boolean?][] = [
  ['/', 'Inicio'],
  ['/tienda', 'Repuestos'],
  ['/tienda?compat=1', 'Buscar por compatibilidad', true],
  ['/tienda?ofertas=1', 'Ofertas'],
  ['/marcas', 'Marcas'],
  ['/cotizaciones/nueva', 'Cotizaciones'],
  ['/nosotros', 'Nosotros'],
  ['/preguntas-frecuentes', 'Ayuda'],
];

export default function Header() {
  const { usuario } = useAuth();
  const totalCarrito = useCarrito((s) => s.total());
  const unidades = useCarrito((s) => s.unidades());
  const totalFavoritos = useFavoritos((s) => s.ids.length);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [compacto, setCompacto] = useState(false);
  const refCategorias = useRef<HTMLDivElement>(null);

  // Compacta el header al hacer scroll (logo grande arriba, pequeño al bajar)
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

  // Cierra el desplegable de categorías al hacer clic fuera
  useEffect(() => {
    if (!categoriasAbiertas) return;
    const cerrar = (e: MouseEvent) => {
      if (!refCategorias.current?.contains(e.target as Node)) setCategoriasAbiertas(false);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, [categoriasAbiertas]);

  return (
    <header className="sticky top-0 z-nav shadow-md">
      {/* 1 · Barra superior carbón */}
      <div className="bg-carbon text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
          <p className="font-medium">
            Despachos a todo Chile <span className="text-white/50">·</span> Especialistas en Aysén
          </p>
          <div className="hidden items-center gap-5 md:flex">
            <span className="flex items-center gap-1.5"><IconoPin className="h-3.5 w-3.5" /> Puerto Aysén, Patagonia</span>
            <span className="flex items-center gap-1.5"><IconoReloj className="h-3.5 w-3.5" /> Lun a Vie 9:00–18:30 · Sáb 9:30–13:30</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-semibold hover:text-naranja"
            >
              <IconoWhatsApp className="h-3.5 w-3.5" /> +56 9 1234 5678
            </a>
          </div>
        </div>
      </div>

      {/* 2 · Barra principal blanca (se compacta al hacer scroll) */}
      <div className="border-b border-borde bg-white">
        <div
          className={`mx-auto flex max-w-7xl items-center gap-3 px-4 transition-[padding] duration-200 lg:gap-6 ${
            compacto ? 'py-1.5' : 'py-3'
          }`}
        >
          <Link to="/" aria-label="Inicio — La Casa de la Motosierra" className="shrink-0">
            <LogoLCM tamano={compacto ? 'md' : 'lg'} conBajada={!compacto} />
          </Link>

          {/* Buscador de texto libre con autocompletado */}
          <div className="hidden flex-1 md:block">
            <BuscadorConSugerencias />
          </div>

          {/* Acciones */}
          <nav className="ml-auto flex items-center gap-1 md:ml-0 lg:gap-2" aria-label="Cuenta y carrito">
            <Link
              to={usuario ? '/mi-cuenta' : '/ingresar'}
              className="flex min-h-[44px] items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-gris-fondo"
            >
              <IconoUsuario className="h-6 w-6 text-grafito" />
              <span className="hidden text-left leading-tight xl:block">
                <span className="block text-sm font-semibold">Mi cuenta</span>
                <span className="block text-xs text-gris-600">{usuario ? `Hola, ${usuario.nombre.split(' ')[0]}` : 'Ingresar'}</span>
              </span>
            </Link>
            <Link to="/favoritos" className="relative flex min-h-[44px] items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-gris-fondo" aria-label={`Favoritos (${totalFavoritos})`}>
              <IconoCorazon className="h-6 w-6 text-grafito" />
              <span className="hidden text-sm font-semibold xl:block">Favoritos</span>
              {totalFavoritos > 0 && (
                <span className="absolute -right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-naranja px-1 text-[10px] font-bold text-white xl:right-auto xl:left-6">
                  {totalFavoritos}
                </span>
              )}
            </Link>
            <Link to="/carrito" className="relative flex min-h-[44px] items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-gris-fondo" aria-label={`Carrito, ${unidades} productos, total ${formatoCLP(totalCarrito)}`}>
              <IconoCarrito className="h-6 w-6 text-grafito" />
              <span className="hidden text-left leading-tight xl:block">
                <span className="block text-sm font-semibold">Carrito</span>
                <span className="block text-xs text-gris-600">{formatoCLP(totalCarrito)}</span>
              </span>
              {unidades > 0 && (
                <span className="absolute -right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-naranja px-1 text-[10px] font-bold text-white xl:right-auto xl:left-6">
                  {unidades}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gris-fondo md:hidden"
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuAbierto}
            >
              <IconoMenu abierto={menuAbierto} className="h-6 w-6" />
            </button>
          </nav>
        </div>

        {/* Buscador móvil con autocompletado */}
        <div className="px-4 pb-3 md:hidden">
          <BuscadorConSugerencias />
        </div>
      </div>

      {/* 3 · Nav verde */}
      <nav className={`bg-verde text-white ${menuAbierto ? 'block' : 'hidden'} md:block`} aria-label="Navegación principal">
        <div className="mx-auto flex max-w-7xl flex-col px-4 md:flex-row md:items-stretch md:gap-1">
          {/* Todas las categorías */}
          <div className="relative py-2 md:py-1.5" ref={refCategorias}>
            <button
              onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
              className="flex min-h-[40px] w-full items-center gap-2 rounded-lg bg-naranja px-4 text-sm font-bold transition-colors hover:bg-naranja-oscuro md:w-auto"
              aria-expanded={categoriasAbiertas}
              aria-haspopup="true"
            >
              <IconoMenu className="h-4 w-4" /> Todas las categorías
            </button>
            {categoriasAbiertas && (
              <div className="animar-entrada md:absolute md:left-0 md:top-full md:w-72 md:rounded-b-xl md:border md:border-borde md:bg-white md:py-2 md:shadow-tarjeta">
                {categorias.map((c) => (
                  <Link
                    key={c.id}
                    to={`/tienda?categoria=${c.id}`}
                    onClick={() => { setCategoriasAbiertas(false); setMenuAbierto(false); }}
                    className="block px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 md:text-grafito md:hover:bg-gris-fondo"
                  >
                    {c.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Enlaces */}
          <div className="flex flex-1 flex-col pb-2 md:flex-row md:items-center md:pb-0">
            {ENLACES_NAV.map(([ruta, texto, nuevo]) => (
              <Link
                key={texto}
                to={ruta}
                onClick={() => setMenuAbierto(false)}
                className="flex min-h-[44px] items-center gap-2 rounded px-3 text-sm font-medium hover:bg-white/10"
              >
                {texto}
                {nuevo && (
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase text-verde">
                    Nuevo
                  </span>
                )}
              </Link>
            ))}

            {/* Acceso al panel — solo cuentas con rol admin */}
            {usuario?.rol === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMenuAbierto(false)}
                className="mt-1 flex min-h-[40px] items-center gap-2 rounded-lg border border-white/40 px-4 text-sm font-bold transition-colors hover:bg-white hover:text-verde md:ml-auto md:mt-0"
              >
                <IconoEngranaje className="h-4 w-4" /> Panel admin
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
