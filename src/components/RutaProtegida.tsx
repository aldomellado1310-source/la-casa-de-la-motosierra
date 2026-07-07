// Protege rutas que requieren sesión o rol admin
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../stores/useAuth';

interface Props {
  children: React.ReactNode;
  /** Si es true, exige rol admin además de sesión */
  soloAdmin?: boolean;
}

export default function RutaProtegida({ children, soloAdmin = false }: Props) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-verde">
        Cargando…
      </div>
    );
  }
  if (!usuario) {
    return <Navigate to="/ingresar" state={{ desde: location.pathname }} replace />;
  }
  if (soloAdmin && usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
