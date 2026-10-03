// Admin > Cupones: crear, editar y eliminar códigos de descuento del checkout
import { useEffect, useState } from 'react';
import { eliminarCupon, guardarCupon, normalizarCodigoCupon, obtenerCupones } from '../../services/cupones';
import { cuponVigente } from '../../utils/cupones';
import { formatoCLP } from '../../utils/precio';
import EstadoError from '../../components/EstadoError';
import type { Cupon } from '../../types';

/** "AAAA-MM-DD" del input date → fin de ese día en la hora del navegador */
function finDelDia(valor: string): string {
  return new Date(`${valor}T23:59:59`).toISOString();
}

/** ISO → "AAAA-MM-DD" en la hora local (para el input date) */
function aInputFecha(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

export default function AdminCupones() {
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [editando, setEditando] = useState<Cupon | null>(null);
  const [esNuevo, setEsNuevo] = useState(false);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargar = () => {
    setError(false);
    obtenerCupones()
      .then((lista) => setCupones(lista.sort((a, b) => a.codigo.localeCompare(b.codigo))))
      .catch(() => setError(true));
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
    const codigo = normalizarCodigoCupon(editando.codigo);
    if (!codigo) {
      setAviso('El código debe tener entre 3 y 30 letras, números, guiones o guiones bajos (sin espacios).');
      return;
    }
    if (!(editando.valor > 0)) {
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
    setGuardando(true);
    try {
      await guardarCupon({ ...editando, codigo, descripcion: editando.descripcion?.trim() || undefined });
      setEditando(null);
      setEsNuevo(false);
      cargar();
    } catch {
      setAviso('No se pudo guardar el cupón. Revisa tu conexión e inténtalo otra vez.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (c: Cupon) => {
    // Sin confirm() del navegador: se pide confirmar escribiendo en un segundo clic
    if (aviso !== `confirmar-${c.codigo}`) {
      setAviso(`confirmar-${c.codigo}`);
      return;
    }
    setAviso('');
    await eliminarCupon(c.codigo);
    cargar();
  };

  if (error) return <EstadoError onReintentar={cargar} />;

  const avisoVisible = aviso && !aviso.startsWith('confirmar-') ? aviso : '';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gris-600">
          El cliente escribe el código en el checkout. El descuento se aplica sobre los productos (antes del envío)
          y solo con pago en línea.
        </p>
        <button onClick={nuevo} className="btn btn-verde shrink-0">+ Nuevo cupón</button>
      </div>

      {avisoVisible && (
        <p className="rounded-lg bg-naranja-suave p-3 text-sm font-semibold text-naranja-oscuro" role="alert">{avisoVisible}</p>
      )}

      {editando && (
        <form onSubmit={(e) => void guardar(e)} className="tarjeta space-y-3">
          <h2 className="font-bold">{esNuevo ? 'Nuevo cupón' : `Editar: ${editando.codigo}`}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="etiqueta" htmlFor="cup-codigo">Código</label>
              <input
                id="cup-codigo"
                required
                disabled={!esNuevo}
                maxLength={30}
                value={editando.codigo}
                onChange={(e) => setEditando({ ...editando, codigo: e.target.value.toUpperCase() })}
                placeholder="INVIERNO10"
                className="campo font-mono uppercase"
              />
            </div>
            <div>
              <label className="etiqueta" htmlFor="cup-descripcion">Descripción (solo para ti)</label>
              <input
                id="cup-descripcion"
                maxLength={120}
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
                <option value="monto">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="etiqueta" htmlFor="cup-valor">
                Valor {editando.tipo === 'porcentaje' ? '(%)' : '($)'}
              </label>
              <input
                id="cup-valor"
                type="number"
                inputMode="numeric"
                min={1}
                max={editando.tipo === 'porcentaje' ? 100 : undefined}
                required
                value={editando.valor}
                onChange={(e) => setEditando({ ...editando, valor: parseInt(e.target.value, 10) || 0 })}
                className="campo"
              />
            </div>
            <div>
              <label className="etiqueta" htmlFor="cup-expira">Vence (opcional, último día válido)</label>
              <input
                id="cup-expira"
                type="date"
                value={aInputFecha(editando.fechaExpiracion)}
                onChange={(e) => setEditando({ ...editando, fechaExpiracion: e.target.value ? finDelDia(e.target.value) : undefined })}
                className="campo"
              />
            </div>
            <div className="flex items-end">
              <label className="flex min-h-12 items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={editando.activo}
                  onChange={(e) => setEditando({ ...editando, activo: e.target.checked })}
                  className="control-grande accent-naranja"
                />
                Activo
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={guardando} className="btn btn-primario">
              {guardando ? 'Guardando…' : 'Guardar cupón'}
            </button>
            <button type="button" onClick={() => { setEditando(null); setEsNuevo(false); }} className="btn btn-secundario">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-borde bg-white">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-carbon text-left text-white">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Código</th>
              <th className="px-3 py-2.5 font-semibold">Descuento</th>
              <th className="px-3 py-2.5 font-semibold">Vence</th>
              <th className="px-3 py-2.5 font-semibold">Estado</th>
              <th className="px-3 py-2.5 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cupones.map((c) => {
              const vigente = cuponVigente(c);
              return (
                <tr key={c.codigo} className="border-t border-borde">
                  <td className="px-3 py-2 font-mono font-semibold">{c.codigo}</td>
                  <td className="px-3 py-2">
                    {c.tipo === 'porcentaje' ? `${c.valor}%` : formatoCLP(c.valor)}
                    {c.descripcion && <span className="block text-xs text-gris-600">{c.descripcion}</span>}
                  </td>
                  <td className="px-3 py-2 text-gris-600">
                    {c.fechaExpiracion ? new Date(c.fechaExpiracion).toLocaleDateString('es-CL') : 'Sin fecha'}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      vigente ? 'bg-verde-badge text-verde-oscuro' : 'bg-gris-fondo text-gris-600'
                    }`}>
                      {vigente ? 'Vigente' : c.activo ? 'Vencido' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-4">
                      <button
                        onClick={() => { setEditando(c); setEsNuevo(false); setAviso(''); }}
                        className="enlace font-semibold"
                      >
                        Editar
                      </button>
                      <button onClick={() => void eliminar(c)} className="font-semibold text-oferta hover:underline">
                        {aviso === `confirmar-${c.codigo}` ? '¿Seguro? Toca otra vez' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {cupones.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gris-600">No hay cupones creados todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
