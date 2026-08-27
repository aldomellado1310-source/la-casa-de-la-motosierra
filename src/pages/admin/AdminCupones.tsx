// Admin > Cupones: crear, editar y eliminar cupones de descuento del checkout
import { useEffect, useState } from 'react';
import { cuponVigente, eliminarCupon, guardarCupon, obtenerCupones } from '../../services/cupones';
import EstadoError from '../../components/EstadoError';
import type { Cupon } from '../../types';

export default function AdminCupones() {
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [editando, setEditando] = useState<Cupon | null>(null);
  const [esNuevo, setEsNuevo] = useState(false);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState(false);

  const cargar = () => {
    setError(false);
    obtenerCupones().then(setCupones).catch(() => setError(true));
  };
  useEffect(cargar, []);

  const nuevo = () => {
    setEsNuevo(true);
    setAviso('');
    setEditando({ codigo: '', tipo: 'porcentaje', valor: 10, activo: true, descripcion: '' });
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;
    setAviso('');
    const codigo = editando.codigo.trim().toUpperCase();
    if (!codigo) {
      setAviso('Ingresa un código para el cupón.');
      return;
    }
    if (editando.valor <= 0) {
      setAviso('El valor del descuento debe ser mayor a 0.');
      return;
    }
    if (editando.tipo === 'porcentaje' && editando.valor > 100) {
      setAviso('Un descuento porcentual no puede superar el 100%.');
      return;
    }
    if (esNuevo && cupones.some((c) => c.codigo === codigo)) {
      setAviso(`Ya existe un cupón con el código "${codigo}".`);
      return;
    }
    await guardarCupon({ ...editando, codigo });
    setEditando(null);
    setEsNuevo(false);
    cargar();
  };

  const eliminar = async (c: Cupon) => {
    await eliminarCupon(c.codigo);
    cargar();
  };

  if (error) return <EstadoError onReintentar={cargar} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gris-600">
          Los cupones se aplican en el checkout sobre el subtotal (antes del envío).
        </p>
        <button onClick={nuevo} className="btn-verde shrink-0">+ Nuevo cupón</button>
      </div>

      {aviso && <p className="rounded-lg bg-naranja/10 p-3 text-sm font-semibold text-naranja-oscuro">{aviso}</p>}

      {/* Formulario de creación/edición */}
      {editando && (
        <form onSubmit={guardar} className="tarjeta space-y-3">
          <h2 className="font-bold">{esNuevo ? 'Nuevo cupón' : `Editar: ${editando.codigo}`}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="etiqueta" htmlFor="cup-codigo">Código</label>
              <input
                id="cup-codigo"
                required
                disabled={!esNuevo}
                value={editando.codigo}
                onChange={(e) => setEditando({ ...editando, codigo: e.target.value.toUpperCase() })}
                placeholder="VERANO10"
                className="campo font-mono uppercase"
              />
            </div>
            <div>
              <label className="etiqueta" htmlFor="cup-descripcion">Descripción</label>
              <input
                id="cup-descripcion"
                value={editando.descripcion ?? ''}
                onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
                placeholder="Descuento de temporada"
                className="campo"
              />
            </div>
            <div>
              <label className="etiqueta" htmlFor="cup-tipo">Tipo de descuento</label>
              <select
                id="cup-tipo"
                value={editando.tipo}
                onChange={(e) => setEditando({ ...editando, tipo: e.target.value as Cupon['tipo'] })}
                className="campo"
              >
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto">Monto fijo (CLP)</option>
              </select>
            </div>
            <div>
              <label className="etiqueta" htmlFor="cup-valor">
                Valor {editando.tipo === 'porcentaje' ? '(%)' : '(CLP)'}
              </label>
              <input
                id="cup-valor"
                type="number"
                min={1}
                required
                value={editando.valor}
                onChange={(e) => setEditando({ ...editando, valor: parseInt(e.target.value, 10) || 0 })}
                className="campo"
              />
            </div>
            <div>
              <label className="etiqueta" htmlFor="cup-expira">Expira (opcional)</label>
              <input
                id="cup-expira"
                type="date"
                value={editando.fechaExpiracion?.slice(0, 10) ?? ''}
                onChange={(e) => setEditando({ ...editando, fechaExpiracion: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                className="campo"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={editando.activo}
                  onChange={(e) => setEditando({ ...editando, activo: e.target.checked })}
                  className="accent-naranja"
                />
                Activo
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primario">Guardar cupón</button>
            <button type="button" onClick={() => { setEditando(null); setEsNuevo(false); }} className="btn-secundario">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Listado */}
      <div className="overflow-x-auto rounded-xl border border-borde bg-white">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-verde text-left text-white">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Código</th>
              <th className="px-3 py-2.5 font-semibold">Descuento</th>
              <th className="px-3 py-2.5 font-semibold">Expira</th>
              <th className="px-3 py-2.5 font-semibold">Estado</th>
              <th className="px-3 py-2.5 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cupones.map((c) => (
              <tr key={c.codigo} className="border-t border-borde hover:bg-gris-fondo/60">
                <td className="px-3 py-2 font-mono font-semibold">{c.codigo}</td>
                <td className="px-3 py-2">
                  {c.tipo === 'porcentaje' ? `${c.valor}%` : c.valor.toLocaleString('es-CL')}
                  {c.descripcion && <span className="block text-[11px] text-gris-600">{c.descripcion}</span>}
                </td>
                <td className="px-3 py-2 text-xs text-gris-600">
                  {c.fechaExpiracion ? new Date(c.fechaExpiracion).toLocaleDateString('es-CL') : 'Sin tope'}
                </td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    cuponVigente(c) ? 'bg-verde/10 text-verde' : 'bg-gris-fondo text-gris-600'
                  }`}>
                    {cuponVigente(c) ? 'Vigente' : c.activo ? 'Vencido' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditando(c); setEsNuevo(false); setAviso(''); }}
                      className="font-semibold text-verde hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => void eliminar(c)}
                      className="font-semibold text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {cupones.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gris-600">No hay cupones creados todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
