// Admin > Clientes: listado de usuarios registrados
import { useEffect, useState } from 'react';
import { obtenerTodosLosUsuarios } from '../../services/usuarios';
import type { Usuario } from '../../types';

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Usuario[]>([]);

  useEffect(() => {
    void obtenerTodosLosUsuarios().then(setClientes);
  }, []);

  if (clientes.length === 0) {
    return <p className="text-sm text-gris-600">No hay clientes registrados todavía.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-borde bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-verde text-left text-white">
          <tr>
            <th className="px-3 py-2.5 font-semibold">Nombre</th>
            <th className="px-3 py-2.5 font-semibold">Correo</th>
            <th className="px-3 py-2.5 font-semibold">Tipo</th>
            <th className="px-3 py-2.5 font-semibold">Empresa</th>
            <th className="px-3 py-2.5 font-semibold">Direcciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.uid} className="border-t border-borde hover:bg-gris-fondo/60">
              <td className="px-3 py-2 font-semibold">{c.nombre}</td>
              <td className="px-3 py-2">{c.email}</td>
              <td className="px-3 py-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  c.tipo === 'empresa' ? 'bg-naranja/15 text-naranja-oscuro' : 'bg-verde/10 text-verde'
                }`}>
                  {c.tipo === 'empresa' ? 'Empresa / Taller' : 'Particular'}
                </span>
              </td>
              <td className="px-3 py-2 text-xs">
                {c.tipo === 'empresa' ? <>{c.razonSocial}<span className="block text-gris-600">{c.rut}</span></> : '—'}
              </td>
              <td className="px-3 py-2 text-xs">{c.direcciones.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
