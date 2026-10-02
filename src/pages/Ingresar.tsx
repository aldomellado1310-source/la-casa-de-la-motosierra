// Inicio de sesión: email/contraseña + Google + recuperación de clave
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MODO_DEMO } from '../config/firebase';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';
import { useSeo } from '../utils/seo';

export default function Ingresar() {
  useSeo({
    titulo: 'Iniciar sesión',
    descripcion: 'Ingresa a tu cuenta para usar tus direcciones guardadas, tus máquinas registradas y tu historial de pedidos.',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { ingresar, ingresarConGoogle, recuperarPassword, usuario } = useAuth();
  const sincronizar = useCarrito((s) => s.sincronizarConUsuario);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [avisoReset, setAvisoReset] = useState('');
  const [cargando, setCargando] = useState(false);

  const destino = (location.state as { desde?: string } | null)?.desde ?? '/mi-cuenta';
  if (usuario) return <Navigate to={destino} replace />;

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await ingresar(email, password);
      await sincronizar(useAuth.getState().usuario?.uid ?? null);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión. Revisa tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  const entrarGoogle = async () => {
    setError('');
    try {
      await ingresarConGoogle();
      await sincronizar(useAuth.getState().usuario?.uid ?? null);
      navigate(destino, { replace: true });
    } catch {
      setError('No se pudo iniciar sesión con Google.');
    }
  };

  const olvidoPassword = async () => {
    setError('');
    setAvisoReset('');
    if (!email) {
      setError('Escribe tu correo arriba y vuelve a tocar “¿Olvidaste tu contraseña?”.');
      return;
    }
    try {
      await recuperarPassword(email);
      setAvisoReset(`Te enviamos un enlace de recuperación a ${email}. Revisa tu bandeja de entrada (y el spam).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el correo de recuperación.');
    }
  };

  return (
    <div className="contenedor max-w-md py-10">
      <div className="tarjeta">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-grafito">Iniciar sesión</h1>
        {MODO_DEMO && (
          <p className="mt-2 rounded-lg bg-sky-50 p-3 text-sm text-sky-800">
            <strong>Modo demo:</strong> usa <code>cliente@demo.cl</code>, <code>empresa@demo.cl</code> o{' '}
            <code>admin@demo.cl</code> con clave <code>demo1234</code>.
          </p>
        )}
        <form onSubmit={entrar} className="mt-5 space-y-4">
          <div>
            <label className="etiqueta" htmlFor="login-correo">Correo</label>
            <input id="login-correo" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="campo" />
          </div>
          <div>
            <label className="etiqueta" htmlFor="login-clave">Contraseña</label>
            <input id="login-clave" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="campo" />
            <button type="button" onClick={olvidoPassword} className="enlace mt-2 min-h-[44px] text-base">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          {error && <p role="alert" className="rounded-lg bg-oferta/10 p-3 text-base font-semibold text-oferta">{error}</p>}
          {avisoReset && <p className="rounded-lg bg-verde-badge p-3 text-base text-verde-oscuro">{avisoReset}</p>}
          <button type="submit" disabled={cargando} className="btn-primario btn-grande w-full">
            {cargando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <button onClick={entrarGoogle} className="btn-secundario mt-3 w-full py-3">
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.3-4.8 3.3-8.1z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9C3.9 20.5 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.8 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7H2.1C1.4 8.5 1 10.2 1 12s.4 3.5 1.1 5l3.7-2.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.5 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z"/></svg>
          Continuar con Google
        </button>
        <p className="mt-4 text-center text-base">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="enlace">Crea tu cuenta aquí</Link>
        </p>
      </div>
    </div>
  );
}
