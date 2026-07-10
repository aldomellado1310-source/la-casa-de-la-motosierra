// Admin > Categorías: crear, editar y eliminar categorías del catálogo
import { useEffect, useState } from 'react';
import {
  eliminarCategoria, guardarCategoria, obtenerCategorias, obtenerProductos,
} from '../../services/productos';
import EstadoError from '../../components/EstadoError';
import type { Categoria } from '../../types';

/** Convierte un nombre en slug/id: "Aceites y Lubricantes" → "aceites-y-lubricantes" */
function slugDe(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [conteos, setConteos] = useState<Record<string, number>>({});
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [esNueva, setEsNueva] = useState(false);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState(false);

  const cargar = () => {
    setError(false);
    Promise.all([obtenerCategorias(), obtenerProductos(true)])
      .then(([cats, prods]) => {
        setCategorias(cats);
        const porCategoria: Record<string, number> = {};
        for (const p of prods) porCategoria[p.categoria] = (porCategoria[p.categoria] ?? 0) + 1;
        setConteos(porCategoria);
      })
      .catch(() => setError(true));
  };
  useEffect(cargar, []);

  const nueva = () => {
    setEsNueva(true);
    setEditando({
      id: '',
      nombre: '',
      slug: '',
      subcategorias: [],
      orden: categorias.length + 1,
    });
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;
    setAviso('');
    const id = editando.id || slugDe(editando.nombre);
    if (!id) {
      setAviso('Ingresa un nombre para la categoría.');
      return;
    }
    if (esNueva && categorias.some((c) => c.id === id)) {
      setAviso(`Ya existe una categoría con el id "${id}".`);
      return;
    }
    await guardarCategoria({ ...editando, id, slug: editando.slug || id });
    setEditando(null);
    setEsNueva(false);
    cargar();
  };

  const eliminar = async (c: Categoria) => {
    const enUso = conteos[c.id] ?? 0;
    if (enUso > 0) {
      setAviso(`No se puede eliminar "${c.nombre}": ${enUso} producto(s) la usan. Reasigna esos productos primero.`);
      return;
    }
    await eliminarCategoria(c.id);
    setAviso('');
    cargar();
  };

  if (error) return <EstadoError onReintentar={cargar} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gris-600">
          Las categorías ordenan el menú y los filtros de la tienda. El orden menor aparece primero.
        </p>
        <button onClick={nueva} className="btn-verde shrink-0">+ Nueva categoría</button>
      </div>

      {aviso && <p className="rounded-lg bg-naranja/10 p-3 text-sm font-semibold text-naranja-oscuro">{aviso}</p>}

      {/* Formulario de creación/edición */}
      {editando && (
        <form onSubmit={guardar} className="tarjeta space-y-3">
          <h2 className="font-bold">{esNueva ? 'Nueva categoría' : `Editar: ${editando.nombre}`}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="etiqueta" htmlFor="cat-nombre">Nombre</label>
              <input
                id="cat-nombre"
                required
                value={editando.nombre}
                onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                placeholder="Aceites y lubricantes"
                className="campo"
              />
            </div>
            <div>
              <label className="etiqueta" htmlFor="cat-orden">Orden</label>
              <input
                id="cat-orden"
                type="number"
                min={1}
                required
                value={editando.orden}
                onChange={(e) => setEditando({ ...editando, orden: parseInt(e.target.value, 10) || 1 })}
                className="campo"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="etiqueta" htmlFor="cat-subcategorias">Subcategorías (separadas por coma)</label>
              <input
                id="cat-subcategorias"
                value={editando.subcategorias.join(', ')}
                onChange={(e) => setEditando({
                  ...editando,
                  subcategorias: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })}
                placeholder="Aceite de mezcla 2T, Aceite de cadena"
                className="campo"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primario">Guardar categoría</button>
            <button type="button" onClick={() => { setEditando(null); setEsNueva(false); }} className="btn-secundario">
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
              <th className="px-3 py-2.5 font-semibold">Orden</th>
              <th className="px-3 py-2.5 font-semibold">Nombre</th>
              <th className="px-3 py-2.5 font-semibold">Subcategorías</th>
              <th className="px-3 py-2.5 font-semibold">Productos</th>
              <th className="px-3 py-2.5 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[...categorias].sort((a, b) => a.orden - b.orden).map((c) => (
              <tr key={c.id} className="border-t border-borde hover:bg-gris-fondo/60">
                <td className="px-3 py-2">{c.orden}</td>
                <td className="px-3 py-2 font-semibold">
                  {c.nombre}
                  <span className="block font-mono text-[11px] font-normal text-gris-600">{c.id}</span>
                </td>
                <td className="px-3 py-2 text-xs text-gris-600">{c.subcategorias.join(', ') || '—'}</td>
                <td className="px-3 py-2">{conteos[c.id] ?? 0}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditando(c); setEsNueva(false); setAviso(''); }}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
