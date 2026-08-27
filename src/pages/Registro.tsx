// Registro: cliente particular o empresa/taller (RUT + razón social)
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../stores/useAuth';
import { useCarrito } from '../stores/useCarrito';
import { formatearRut, validarRut } from '../utils/rut';
import { useSeo } from '../utils/seo';

export default function Registro() {
  useSeo({
    titulo: 'Crear cuenta',
    descripcion: 'Crea tu cuenta particular o de empresa/taller: precios mayoristas, cotizaciones formales con folio y compra más rápida.',
  });
  const navigate = useNavigate();
  const { registrar } = useAuth();
  const sincronizar = useCarrito((s) => s.sincronizarConUsuario);
  // Precarga desde /registro?nombre=...&email=... — p. ej. tras un pago
  // como invitado, para no volver a escribir los mismos datos.
  const [params] = useSearchParams();
  const [tipo, setTipo] = useState<'particular' | 'empresa'>('particular');
  const [nombre, setNombre] = useState(params.get('nombre') ?? '');
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [rut, setRut] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (tipo === 'empresa') {
      if (!validarRut(rut)) {
        setError('El RUT ingresado no es válido.');
        return;
      }
      if (!razonSocial.trim()) {
        setError('Ingresa la razón social de tu empresa o taller.');
        return;
      }
    }
    setCargando(true);
    try {
      await registrar({
        nombre, email, password, tipo,
        rut: tipo === 'empresa' ? formatearRut(rut) : undefined,
        razonSocial: tipo === 'empresa' ? razonSocial.trim() : undefined,
      });
      await sincronizar(useAuth.getState().usuario?.uid ?? null);
      navigate('/mi-cuenta', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="tarjeta">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-grafito">Crear cuenta</h1>

        {/* Selector de tipo de cuenta */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {([
            ['particular', 'Cliente particular', 'Compras a precio normal'],
            ['empresa', 'Empresa / Taller', 'Precios mayoristas y cotizaciones'],
          ] as const).map(([valor, titulo, detalle]) => (
            <button
              key={valor}
              type="button"
              onClick={() => setTipo(valor)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                tipo === valor ? 'border-naranja bg-naranja/5' : 'border-borde hover:border-verde'
              }`}
            >
              <span className="block text-sm font-bold">{titulo}</span>
              <span className="block text-[11px] text-gris-600">{detalle}</span>
            </button>
          ))}
        </div>

        <form onSubmit={crear} className="mt-4 space-y-3">
          <div>
            <label className="etiqueta" htmlFor="reg-nombre">Nombre completo</label>
            <input id="reg-nombre" autoComplete="name" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="campo" />
          </div>
          {tipo === 'empresa' && (
            <>
              <div>
                <label className="etiqueta" htmlFor="reg-rut">RUT empresa</label>
                <input
                  id="reg-rut"
                  required
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  onBlur={() => rut && setRut(formatearRut(rut))}
                  placeholder="76.543.210-K"
                  className="campo"
                />
              </div>
              <div>
                <label className="etiqueta" htmlFor="reg-razon">Razón social</label>
                <input id="reg-razon" required value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} placeholder="Forestal Río Simpson Ltda." className="campo" />
              </div>
            </>
          )}
          <div>
            <label className="etiqueta" htmlFor="reg-correo">Correo</label>
            <input id="reg-correo" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="campo" />
          </div>
          <div>
            <label className="etiqueta" htmlFor="reg-clave">Contraseña</label>
            <input id="reg-clave" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="campo" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={cargando} className="btn-primario w-full py-3">
            {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/ingresar" className="font-semibold text-verde hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
