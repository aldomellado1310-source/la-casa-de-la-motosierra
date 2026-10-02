// ============================================================
// Barra de navegación inferior (solo móvil), al alcance del
// pulgar: Inicio · Repuestos · Mi máquina · Carrito · Menú.
// Cada botón lleva ícono Y texto: el público no adivina íconos.
// "Menú" abre una hoja a pantalla completa con todo el sitio y
// los datos de contacto (WhatsApp, llamar, dirección, horario).
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { obtenerCategorias } from '../services/productos';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';
import { useFavoritos } from '../stores/useFavoritos';
import {
  DIRECCION_TIENDA, ENLACE_LLAMAR, HORARIO_CORTO, enlaceWhatsApp,
} from '../config/tienda';
import {
  IconoCarrito, IconoCasa, IconoEngranaje, IconoFlecha, IconoMenu, IconoPin, IconoReloj,
  IconoRepuesto, IconoTelefono, IconoWhatsApp,
} from './Iconos';
import LogoLCM from './LogoLCM';
import type { Categoria } from '../types';

/** Fila grande del menú: texto claro + flecha */
function FilaMenu({ a, children, alElegir }: { a: string; children: React.ReactNode; alElegir: () => void }) {
  return (
    <Link
      to={a}
      onClick={alElegir}
      className="flex min-h-[56px] items-center justify-between gap-3 border-b border-borde px-1 text-lg font-semibold text-grafito active:bg-gris-fondo"
    >
      <span>{children}</span>
      <IconoFlecha className="h-5 w-5 shrink-0 text-gris-600" />
    </Link>
  );
}

export default function BarraInferior() {
  const ubicacion = useLocation();
  const { usuario } = useAuth();
  const unidades = useCarrito((s) => s.unidades());
  const totalFavoritos = useFavoritos((s) => s.ids.length);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const refCerrar = useRef<HTMLButtonElement>(null);

  // Cierra el menú al cambiar de página
  useEffect(() => setMenuAbierto(false), [ubicacion.pathname, ubicacion.search]);

  // Con el menú abierto: bloquea el scroll de fondo, foco en "Cerrar", Escape cierra
  useEffect(() => {
    if (!menuAbierto) return;
    if (categorias.length === 0) void obtenerCategorias().then(setCategorias);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    refCerrar.current?.focus();
    const alEscape = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAbierto(false);
    document.addEventListener('keydown', alEscape);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener('keydown', alEscape);
    };
  }, [menuAbierto, categorias.length]);

  const cerrar = () => setMenuAbierto(false);

  const pestanas = [
    { a: '/', texto: 'Inicio', icono: IconoCasa, activa: ubicacion.pathname === '/' },
    { a: '/tienda', texto: 'Repuestos', icono: IconoRepuesto, activa: ubicacion.pathname === '/tienda' || ubicacion.pathname.startsWith('/producto') },
    { a: '/compatibilidad', texto: 'Mi máquina', icono: IconoEngranaje, activa: ubicacion.pathname === '/compatibilidad' },
    { a: '/carrito', texto: 'Carrito', icono: IconoCarrito, activa: ubicacion.pathname === '/carrito' || ubicacion.pathname === '/checkout', contador: unidades },
  ];

  const claseBoton = (activa: boolean) =>
    `relative flex min-h-[60px] min-w-0 flex-1 flex-col items-center justify-center gap-1 whitespace-nowrap rounded-2xl text-[0.8125rem] font-bold leading-none transition-colors duration-200 ${
      activa ? 'bg-naranja text-carbon' : 'text-white active:bg-white/10'
    }`;

  return (
    <>
      {/* Barra flotante negra con píldora naranja en la pestaña activa */}
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-2.5 bottom-[calc(10px+env(safe-area-inset-bottom))] z-nav rounded-[22px] bg-carbon p-1.5 shadow-[0_6px_16px_rgb(14_15_14/0.28)] md:hidden"
      >
        <div className="flex gap-1">
          {pestanas.map(({ a, texto, icono: Icono, activa, contador }) => (
            <Link key={a} to={a} className={claseBoton(activa)} aria-current={activa ? 'page' : undefined}>
              <span className="relative">
                <Icono className="h-6 w-6" />
                {contador !== undefined && contador > 0 && (
                  <span
                    key={contador}
                    className={`animar-pulso absolute -right-3 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                      activa ? 'bg-carbon text-white' : 'bg-naranja text-carbon'
                    }`}
                  >
                    {contador}
                  </span>
                )}
              </span>
              {texto}
              {contador !== undefined && contador > 0 && <span className="sr-only">({contador} productos)</span>}
            </Link>
          ))}
          <button
            onClick={() => setMenuAbierto(true)}
            className={claseBoton(menuAbierto)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
          >
            <IconoMenu className="h-6 w-6" />
            Menú
          </button>
        </div>
      </nav>

      {/* Hoja de menú a pantalla completa */}
      {menuAbierto && (
        <div
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="animar-entrada fixed inset-0 z-modal flex flex-col bg-white md:hidden"
        >
          <div className="flex items-center justify-between border-b border-borde px-4 py-3">
            <LogoLCM tamano="md" />
            <button
              ref={refCerrar}
              onClick={cerrar}
              className="btn-secundario min-h-[48px] px-4"
            >
              <IconoMenu abierto className="h-5 w-5" /> Cerrar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-10 pt-2">
            {/* Contacto directo primero: es lo que más resuelve */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={enlaceWhatsApp()} target="_blank" rel="noreferrer" className="btn-whatsapp">
                <IconoWhatsApp className="h-5 w-5" /> WhatsApp
              </a>
              <a href={ENLACE_LLAMAR} className="btn-secundario">
                <IconoTelefono className="h-5 w-5 text-verde" /> Llamar
              </a>
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-wide text-gris-600">Comprar</p>
            <FilaMenu a="/tienda" alElegir={cerrar}>Todos los repuestos</FilaMenu>
            <FilaMenu a="/compatibilidad" alElegir={cerrar}>Buscar por mi máquina</FilaMenu>
            <FilaMenu a="/tienda?ofertas=1" alElegir={cerrar}>Ofertas</FilaMenu>
            <FilaMenu a="/marcas" alElegir={cerrar}>Repuestos por marca</FilaMenu>

            <details className="group border-b border-borde">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between px-1 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                Categorías
                <span className="text-2xl font-bold text-gris-600 group-open:hidden" aria-hidden="true">+</span>
                <span className="hidden text-2xl font-bold text-gris-600 group-open:inline" aria-hidden="true">−</span>
              </summary>
              <div className="pb-2 pl-3">
                {categorias.map((c) => (
                  <Link
                    key={c.id}
                    to={`/tienda?categoria=${c.id}`}
                    onClick={cerrar}
                    className="flex min-h-[48px] items-center text-base font-medium text-grafito"
                  >
                    {c.nombre}
                  </Link>
                ))}
              </div>
            </details>

            <p className="mt-6 text-sm font-bold uppercase tracking-wide text-gris-600">Mi cuenta</p>
            <FilaMenu a={usuario ? '/mi-cuenta' : '/ingresar'} alElegir={cerrar}>
              {usuario ? `Mi cuenta (${usuario.nombre.split(' ')[0]})` : 'Ingresar o crear cuenta'}
            </FilaMenu>
            <FilaMenu a="/favoritos" alElegir={cerrar}>
              Mis favoritos{totalFavoritos > 0 ? ` (${totalFavoritos})` : ''}
            </FilaMenu>
            <FilaMenu a="/seguimiento" alElegir={cerrar}>¿Dónde está mi pedido?</FilaMenu>

            <p className="mt-6 text-sm font-bold uppercase tracking-wide text-gris-600">La tienda</p>
            <FilaMenu a="/nosotros" alElegir={cerrar}>Servicio técnico y taller</FilaMenu>
            <FilaMenu a="/cotizaciones/nueva" alElegir={cerrar}>Cotizaciones para empresas</FilaMenu>
            <FilaMenu a="/preguntas-frecuentes" alElegir={cerrar}>Preguntas frecuentes</FilaMenu>
            {usuario?.rol === 'admin' && <FilaMenu a="/admin" alElegir={cerrar}>Panel admin</FilaMenu>}

            <div className="mt-6 space-y-2 rounded-xl bg-gris-fondo p-4 text-base">
              <p className="flex items-start gap-2"><IconoPin className="mt-0.5 h-5 w-5 shrink-0 text-verde" /> {DIRECCION_TIENDA}</p>
              <p className="flex items-start gap-2"><IconoReloj className="mt-0.5 h-5 w-5 shrink-0 text-verde" /> {HORARIO_CORTO}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
