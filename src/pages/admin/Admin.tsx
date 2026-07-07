// Panel de administración con pestañas (solo rol admin)
import { useState } from 'react';
import AdminResumen from './AdminResumen';
import AdminProductos from './AdminProductos';
import AdminPedidos from './AdminPedidos';
import AdminCotizaciones from './AdminCotizaciones';
import AdminClientes from './AdminClientes';
import { MODO_DEMO } from '../../config/firebase';

type Pestania = 'resumen' | 'productos' | 'pedidos' | 'cotizaciones' | 'clientes';

export default function Admin() {
  const [pestania, setPestania] = useState<Pestania>('resumen');

  const PESTANIAS: { id: Pestania; texto: string }[] = [
    { id: 'resumen', texto: 'Resumen' },
    { id: 'productos', texto: 'Productos' },
    { id: 'pedidos', texto: 'Pedidos' },
    { id: 'cotizaciones', texto: 'Cotizaciones' },
    { id: 'clientes', texto: 'Clientes' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="titulo-seccion">Panel de administración</h1>
      {MODO_DEMO && (
        <p className="mt-2 rounded-lg bg-sky-50 p-3 text-xs text-sky-800">
          <strong>Modo demo:</strong> los cambios viven solo en esta sesión del navegador. Con Firebase configurado se
          guardan en Firestore.
        </p>
      )}

      <div className="mb-6 mt-4 flex gap-1 overflow-x-auto border-b border-borde">
        {PESTANIAS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPestania(p.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              pestania === p.id ? 'border-naranja text-naranja-oscuro' : 'border-transparent text-gris-600 hover:text-verde'
            }`}
          >
            {p.texto}
          </button>
        ))}
      </div>

      {pestania === 'resumen' && <AdminResumen irA={setPestania} />}
      {pestania === 'productos' && <AdminProductos />}
      {pestania === 'pedidos' && <AdminPedidos />}
      {pestania === 'cotizaciones' && <AdminCotizaciones />}
      {pestania === 'clientes' && <AdminClientes />}
    </div>
  );
}
