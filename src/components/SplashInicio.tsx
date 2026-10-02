// ============================================================
// Splash de entrada: el logo con la cadena girando, una sola
// vez por sesión y por ~1 segundo. Se omite por completo si el
// usuario prefiere movimiento reducido, y un clic lo descarta.
// No bloquea la carga: la app renderiza debajo mientras tanto.
// ============================================================
import { useEffect, useState } from 'react';
import LogoLCM from './LogoLCM';

type Estado = 'visible' | 'saliendo' | 'oculto';

export default function SplashInicio() {
  const [estado, setEstado] = useState<Estado>(() => {
    const visto = sessionStorage.getItem('splash-visto');
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return visto || reducido ? 'oculto' : 'visible';
  });

  useEffect(() => {
    if (estado !== 'visible') return;
    sessionStorage.setItem('splash-visto', '1');
    const salida = setTimeout(() => setEstado('saliendo'), 950);
    const fin = setTimeout(() => setEstado('oculto'), 1300);
    return () => {
      clearTimeout(salida);
      clearTimeout(fin);
    };
  }, [estado]);

  if (estado === 'oculto') return null;

  return (
    <div
      onClick={() => setEstado('saliendo')}
      className={`fixed inset-0 z-modal flex items-center justify-center bg-naranja ${
        estado === 'saliendo' ? 'splash-salida' : ''
      }`}
      aria-hidden="true"
    >
      <div className="animar-hero">
        <LogoLCM tono="claro" tamano="lg" />
      </div>
    </div>
  );
}
