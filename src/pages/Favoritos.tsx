// Página de favoritos: resuelve los ids guardados contra el catálogo
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoError from '../components/EstadoError';
import TarjetaProducto from '../components/TarjetaProducto';
import { obtenerProductos } from '../services/productos';
import { useFavoritos } from '../stores/useFavoritos';
import { useSeo } from '../utils/seo';
import type { Producto } from '../types';

export default function Favoritos() {
  useSeo({
    titulo: 'Mis favoritos',
    descripcion: 'Tus repuestos guardados para comprarlos cuando los necesites.',
  });
  const ids = useFavoritos((s) => s.ids);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const cargar = () => {
    setCargando(true);
    setError(false);
    obtenerProductos()
      .then(setProductos)
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  };
  useEffect(cargar, []);

  const favoritos = productos.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="titulo-seccion mb-6">Mis favoritos</h1>

      {error ? (
        <EstadoError onReintentar={cargar} />
      ) : cargando ? (
        <p className="text-sm text-gris-600">Cargando…</p>
      ) : favoritos.length === 0 ? (
        <div className="tarjeta py-14 text-center">
          <svg className="mx-auto h-12 w-12 text-borde" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />
          </svg>
          <p className="mt-3 font-semibold">Aún no guardas favoritos</p>
          <p className="mt-1 text-sm text-gris-600">
            Toca el corazón de cualquier producto para tenerlo a mano aquí.
          </p>
          <Link to="/tienda" className="btn-primario mt-6">Explorar la tienda</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {favoritos.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
