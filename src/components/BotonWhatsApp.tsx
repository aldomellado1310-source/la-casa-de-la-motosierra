// Botón flotante de WhatsApp — atención directa y cercana.
// Escritorio: píldora con texto ("¿Dudas? WhatsApp"), no solo ícono.
// Móvil: círculo sobre la barra inferior. En páginas de compra se
// oculta en móvil para no tapar los botones "Agregar" (ahí WhatsApp
// está en el menú y dentro de la misma página).
import { useLocation } from 'react-router-dom';
import { enlaceWhatsApp } from '../config/tienda';
import { IconoWhatsApp } from './Iconos';

/** Rutas donde el botón flotante estorbaría en móvil */
const RUTAS_DE_COMPRA = ['/tienda', '/producto', '/carrito', '/checkout', '/favoritos'];

export default function BotonWhatsApp() {
  const { pathname } = useLocation();
  const ocultarEnMovil = RUTAS_DE_COMPRA.some((r) => pathname.startsWith(r));
  // En el panel admin no aporta: es de atención a clientes
  if (pathname.startsWith('/admin')) return null;
  return (
    <a
      href={enlaceWhatsApp()}
      target="_blank"
      rel="noreferrer"
      aria-label="¿Dudas? Escríbenos por WhatsApp"
      className={`${ocultarEnMovil ? 'hidden md:flex' : 'flex'} fixed bottom-[calc(96px+env(safe-area-inset-bottom))] right-4 z-flotante h-14 w-14 items-center justify-center gap-2 rounded-full bg-whatsapp text-white shadow-lg transition-[background-color,transform] duration-150 hover:bg-whatsapp-oscuro active:scale-95 md:bottom-6 md:right-6 md:h-auto md:w-auto md:py-3 md:pl-4 md:pr-5`}
    >
      <IconoWhatsApp className="h-8 w-8 md:h-6 md:w-6" />
      <span className="hidden text-base font-bold md:inline">¿Dudas? Escríbenos</span>
    </a>
  );
}
