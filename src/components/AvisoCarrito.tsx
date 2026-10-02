// Aviso flotante de confirmación al agregar al carrito, con acceso
// directo "Ver carrito". En móvil aparece sobre la barra inferior.
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAviso } from '../stores/useAviso';
import { IconoCheck } from './Iconos';

export default function AvisoCarrito() {
  const { texto, version, ocultar } = useAviso();
  const { pathname } = useLocation();

  // Al navegar, el aviso ya cumplió su función
  useEffect(() => {
    ocultar();
  }, [pathname, ocultar]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom))] z-modal flex justify-center px-4 md:bottom-8">
      {texto && (
        <div
          key={version}
          className="animar-entrada pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl bg-carbon py-2.5 pl-4 pr-2.5 text-white shadow-lg"
        >
          <IconoCheck className="h-6 w-6 shrink-0 text-[#7CD69A]" />
          <p className="min-w-0 flex-1 text-base font-semibold">{texto}</p>
          {pathname !== '/carrito' && (
            <Link to="/carrito" className="btn min-h-[44px] shrink-0 bg-naranja px-4 text-carbon hover:bg-naranja-hover">
              Ver carrito
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
