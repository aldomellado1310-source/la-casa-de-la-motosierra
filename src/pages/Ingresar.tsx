// Inicio de sesión: email/contraseña + Google
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MODO_DEMO } from '../config/firebase';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';

export default function Ingresar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ingresar, ingresarConGoogle, usuario } = useAuth();
  const sincronizar = useCarrito((s) => s.sincronizarConUsuario);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const destino = (location.state as { desde?: string } | null)?.desde ?? '/mi-cuenta';
  if (usuario) navigate(destino, { replace: true });

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

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="tarjeta">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-grafito">Iniciar sesión</h1>
        {MODO_DEMO && (
          <p className="mt-2 rounded-lg bg-sky-50 p-3 text-xs text-sky-800">
            <strong>Modo demo:</strong> usa <code>cliente@demo.cl</code>, <code>empresa@demo.cl</code> o{' '}
            <code>admin@demo.cl</code> con clave <code>demo1234</code>.
          </p>
        )}
        <form onSubmit={entrar} className="mt-4 space-y-3">
          <div>
            <label className="etiqueta">Correo</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="campo" />
          </div>
          <div>
            <label className="etiqueta">Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="campo" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={cargando} className="btn-primario w-full py-3">
            {cargando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <button onClick={entrarGoogle} className="btn-secundario mt-3 w-full py-3">
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.3-4.8 3.3-8.1z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9C3.9 20.5 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.8 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7H2.1C1.4 8.5 1 10.2 1 12s.4 3.5 1.1 5l3.7-2.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.5 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z"/></svg>
          Continuar con Google
        </button>
        <p className="mt-4 text-center text-sm">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-semibold text-verde hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
