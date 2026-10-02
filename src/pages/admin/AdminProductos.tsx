// ============================================================
// Admin > Productos: crear/editar/eliminar, ajustar stock,
// subir fotos (Storage) e importación masiva por CSV.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MODO_DEMO, storage } from '../../config/firebase';
import {
  ajustarStock, eliminarProducto, guardarProducto, invalidarCacheProductos, obtenerCategorias, obtenerProductos,
} from '../../services/productos';
import { formatoCLP } from '../../utils/precio';
import BadgeStock from '../../components/BadgeStock';
import type { Categoria, Compatibilidad, Producto, TramoPrecio } from '../../types';

/**
 * Precio editable directo en la tabla: clic → input →
 * Enter/perder foco guarda, Escape cancela.
 */
function PrecioInline({ producto, alGuardar }: { producto: Producto; alGuardar: (p: Producto) => Promise<void> }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(String(producto.precio));

  const guardar = async () => {
    setEditando(false);
    const nuevo = parseInt(valor, 10);
    if (!Number.isNaN(nuevo) && nuevo > 0 && nuevo !== producto.precio) {
      await alGuardar({ ...producto, precio: nuevo });
    } else {
      setValor(String(producto.precio));
    }
  };

  if (editando) {
    return (
      <input
        autoFocus
        type="number"
        min={1}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onBlur={() => void guardar()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
          if (e.key === 'Escape') { setValor(String(producto.precio)); setEditando(false); }
        }}
        className="campo min-h-0 w-28 px-2 py-1 text-sm"
        aria-label={`Precio de ${producto.nombre}`}
      />
    );
  }

  const oferta = producto.precioOferta && producto.precioOferta < producto.precio;
  return (
    <button
      onClick={() => { setValor(String(producto.precio)); setEditando(true); }}
      title="Clic para editar el precio"
      className="rounded px-1 py-0.5 text-left underline decoration-borde decoration-dashed underline-offset-4 hover:decoration-verde"
    >
      {oferta ? (
        <span className="flex flex-col leading-tight">
          <span className="font-semibold text-oferta">{formatoCLP(producto.precioOferta!)}</span>
          <s className="text-xs text-gris-600">{formatoCLP(producto.precio)}</s>
        </span>
      ) : (
        formatoCLP(producto.precio)
      )}
    </button>
  );
}

/** Producto vacío para el formulario de creación */
function productoVacio(): Producto {
  return {
    id: `p${Date.now()}`,
    sku: '', nombre: '', descripcion: '',
    categoria: 'repuestos-varios', subcategoria: '',
    precio: 0, stock: 0, fotos: [],
    compatibilidades: [],
    preciosPorVolumen: [], destacado: false, activo: true,
  };
}

/**
 * Formato de texto para compatibilidades en CSV / campo libre:
 *   "Stihl:MS 250;MS 260|Husqvarna:445|Genérica/China:"
 * `|` separa marcas · `:` separa marca de sus modelos · `;` separa modelos.
 */
function compatibilidadesATexto(compat: Compatibilidad[]): string {
  return compat.map((c) => `${c.marca}:${c.modelos.join(';')}`).join('|');
}

function textoACompatibilidades(texto: string): Compatibilidad[] {
  return texto
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entrada) => {
      const idx = entrada.indexOf(':');
      const marca = (idx >= 0 ? entrada.slice(0, idx) : entrada).trim();
      const modelos = (idx >= 0 ? entrada.slice(idx + 1) : '')
        .split(';')
        .map((m) => m.trim())
        .filter(Boolean);
      return { marca, modelos };
    })
    .filter((c) => c.marca);
}

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [filtro, setFiltro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const inputCsv = useRef<HTMLInputElement>(null);

  const recargar = async () => {
    invalidarCacheProductos();
    setProductos(await obtenerProductos(true));
  };

  useEffect(() => {
    void recargar();
    void obtenerCategorias().then(setCategorias);
  }, []);

  const visibles = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      p.sku.toLowerCase().includes(filtro.toLowerCase()),
  );

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;
    await guardarProducto(editando);
    setEditando(null);
    setMensaje('Producto guardado.');
    await recargar();
  };

  const borrar = async (p: Producto) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}" (${p.sku})? Esta acción no se puede deshacer.`)) return;
    await eliminarProducto(p.id);
    setMensaje('Producto eliminado.');
    await recargar();
  };

  const cambiarStock = async (p: Producto, delta: number) => {
    const nuevo = Math.max(0, p.stock + delta);
    await ajustarStock(p.id, nuevo);
    await recargar();
  };

  /** Sube fotos a Storage y agrega las URLs al producto en edición */
  const subirFotos = async (archivos: FileList | null) => {
    if (!archivos || !editando) return;
    if (MODO_DEMO) {
      // En demo usamos URLs locales temporales
      const urls = [...archivos].map((f) => URL.createObjectURL(f));
      setEditando({ ...editando, fotos: [...editando.fotos, ...urls] });
      return;
    }
    const urls: string[] = [];
    for (const archivo of archivos) {
      const rutaStorage = ref(storage!, `productos/${editando.id}/${archivo.name}`);
      await uploadBytes(rutaStorage, archivo);
      urls.push(await getDownloadURL(rutaStorage));
    }
    setEditando({ ...editando, fotos: [...editando.fotos, ...urls] });
  };

  /**
   * Importación masiva por CSV. Columnas esperadas (con encabezado):
   * sku,nombre,descripcion,categoria,subcategoria,precio,precioOferta,stock,compatibilidades
   * `compatibilidades`: "Stihl:MS 250;MS 260|Husqvarna:445" (| marcas, : modelos, ; entre modelos).
   * Retrocompat: si solo viene `marcascompatibles` (listas con "|"), se toma como marcas sin modelos.
   */
  const importarCsv = async (archivo: File | null) => {
    if (!archivo) return;
    const texto = await archivo.text();
    const lineas = texto.split(/\r?\n/).filter((l) => l.trim());
    const encabezado = lineas[0].split(',').map((h) => h.trim().toLowerCase());
    const idx = (col: string) => encabezado.indexOf(col);
    let importados = 0;

    for (const linea of lineas.slice(1)) {
      // Parseo CSV simple con soporte de comillas
      const celdas = linea.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((c) =>
        c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim(),
      ) ?? [];
      const sku = celdas[idx('sku')];
      if (!sku) continue;
      const precio = parseInt(celdas[idx('precio')] ?? '0', 10) || 0;
      const precioOferta = parseInt(celdas[idx('preciooferta')] ?? '', 10);
      const producto: Producto = {
        id: `csv-${sku.toLowerCase()}`,
        sku,
        nombre: celdas[idx('nombre')] ?? sku,
        descripcion: celdas[idx('descripcion')] ?? '',
        categoria: celdas[idx('categoria')] || 'repuestos-varios',
        subcategoria: celdas[idx('subcategoria')] ?? '',
        precio,
        precioOferta: Number.isNaN(precioOferta) || precioOferta <= 0 ? undefined : precioOferta,
        stock: parseInt(celdas[idx('stock')] ?? '0', 10) || 0,
        fotos: [`https://placehold.co/600x600/FFFFFF/9AA09B/png?text=${encodeURIComponent(sku)}`],
        compatibilidades: celdas[idx('compatibilidades')]
          ? textoACompatibilidades(celdas[idx('compatibilidades')])
          : (celdas[idx('marcascompatibles')] ?? '')
              .split('|').map((s) => s.trim()).filter(Boolean)
              .map((marca) => ({ marca, modelos: [] })),
        preciosPorVolumen: [{ desde: 1, hasta: null, precioUnitario: precio }],
        destacado: false,
        activo: true,
      };
      await guardarProducto(producto);
      importados++;
    }
    setMensaje(`Importación CSV completada: ${importados} producto(s).`);
    if (inputCsv.current) inputCsv.current.value = '';
    await recargar();
  };

  /** Exporta el inventario completo a CSV (mismas columnas que la importación) */
  const exportarCsv = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const encabezado = 'sku,nombre,descripcion,categoria,subcategoria,precio,precioOferta,stock,compatibilidades';
    const filas = productos.map((p) =>
      [
        esc(p.sku), esc(p.nombre), esc(p.descripcion), esc(p.categoria), esc(p.subcategoria),
        String(p.precio), p.precioOferta ? String(p.precioOferta) : '',
        String(p.stock), esc(compatibilidadesATexto(p.compatibilidades)),
      ].join(','),
    );
    // BOM para que Excel abra las tildes correctamente
    const blob = new Blob(['﻿' + [encabezado, ...filas].join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `inventario-${new Date().toISOString().slice(0, 10)}.csv`;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
    setMensaje(`Inventario exportado: ${productos.length} producto(s).`);
  };

  // --- Helpers del formulario de tramos de volumen ---
  const setTramo = (i: number, campo: keyof TramoPrecio, valor: string) => {
    if (!editando) return;
    const tramos = [...editando.preciosPorVolumen];
    tramos[i] = {
      ...tramos[i],
      [campo]: campo === 'hasta' && valor === '' ? null : parseInt(valor, 10) || 0,
    };
    setEditando({ ...editando, preciosPorVolumen: tramos });
  };

  return (
    <div>
      {mensaje && <p className="animar-entrada mb-4 rounded-lg bg-verde/10 p-3 text-sm font-semibold text-verde">{mensaje}</p>}

      {/* Barra de acciones */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar por nombre o SKU…"
          className="campo max-w-xs"
        />
        <button onClick={() => setEditando(productoVacio())} className="btn-primario">+ Nuevo producto</button>
        <label className="btn-secundario cursor-pointer">
          Importar CSV
          <input
            ref={inputCsv}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => void importarCsv(e.target.files?.[0] ?? null)}
          />
        </label>
        <button onClick={exportarCsv} className="btn-secundario">Exportar CSV</button>
        <span className="text-xs text-gris-600">
          CSV: sku,nombre,descripcion,categoria,subcategoria,precio,precioOferta,stock,compatibilidades — compatibilidades como “Stihl:MS 250;MS 260|Husqvarna:445”
        </span>
      </div>

      {/* Formulario de edición */}
      {editando && (
        <form onSubmit={guardar} className="tarjeta animar-entrada mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">{productos.some((p) => p.id === editando.id) ? 'Editar' : 'Nuevo'} producto</h2>
            <button type="button" onClick={() => setEditando(null)} className="text-sm text-gris-600 hover:text-red-600">✕ Cancelar</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="etiqueta" htmlFor="prod-sku">SKU</label>
              <input id="prod-sku" required value={editando.sku} onChange={(e) => setEditando({ ...editando, sku: e.target.value })} className="campo" />
            </div>
            <div className="lg:col-span-3">
              <label className="etiqueta" htmlFor="prod-nombre">Nombre</label>
              <input id="prod-nombre" required value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} className="campo" />
            </div>
            <div>
              <label className="etiqueta" htmlFor="prod-categoria">Categoría</label>
              <select id="prod-categoria" value={editando.categoria} onChange={(e) => setEditando({ ...editando, categoria: e.target.value })} className="campo">
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="etiqueta" htmlFor="prod-subcategoria">Subcategoría</label>
              <input id="prod-subcategoria" value={editando.subcategoria} onChange={(e) => setEditando({ ...editando, subcategoria: e.target.value })} className="campo" />
            </div>
            <div>
              <label className="etiqueta" htmlFor="prod-precio">Precio (CLP)</label>
              <input id="prod-precio" type="number" min={0} required value={editando.precio} onChange={(e) => setEditando({ ...editando, precio: parseInt(e.target.value, 10) || 0 })} className="campo" />
            </div>
            <div>
              <label className="etiqueta" htmlFor="prod-oferta">Precio oferta (CLP)</label>
              <input
                id="prod-oferta"
                type="number"
                min={0}
                value={editando.precioOferta ?? ''}
                placeholder="Sin oferta"
                onChange={(e) => {
                  const valor = parseInt(e.target.value, 10);
                  setEditando({ ...editando, precioOferta: Number.isNaN(valor) || valor <= 0 ? undefined : valor });
                }}
                className="campo"
              />
              <p className="mt-1 text-xs text-gris-600">
                {editando.precioOferta && editando.precioOferta < editando.precio
                  ? `Se mostrará −${Math.round((1 - editando.precioOferta / editando.precio) * 100)}% y el precio tachado.`
                  : 'Déjalo vacío para vender a precio normal.'}
              </p>
            </div>
            <div>
              <label className="etiqueta" htmlFor="prod-stock">Stock</label>
              <input id="prod-stock" type="number" min={0} required value={editando.stock} onChange={(e) => setEditando({ ...editando, stock: parseInt(e.target.value, 10) || 0 })} className="campo" />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="etiqueta" htmlFor="prod-descripcion">Descripción</label>
              <textarea id="prod-descripcion" rows={2} value={editando.descripcion} onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} className="campo" />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="mb-1 flex items-center gap-3">
                <label className="etiqueta mb-0">Compatibilidad por marca</label>
                <button
                  type="button"
                  onClick={() => setEditando({
                    ...editando,
                    compatibilidades: [...editando.compatibilidades, { marca: '', modelos: [] }],
                  })}
                  className="text-xs font-semibold text-verde hover:underline"
                >
                  + Agregar marca
                </button>
              </div>
              {editando.compatibilidades.map((c, i) => (
                <div key={i} className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                  <input
                    value={c.marca}
                    onChange={(e) => {
                      const compat = [...editando.compatibilidades];
                      compat[i] = { ...compat[i], marca: e.target.value };
                      setEditando({ ...editando, compatibilidades: compat });
                    }}
                    placeholder="Marca (ej: Stihl)"
                    className="campo w-40"
                    aria-label={`Marca compatible ${i + 1}`}
                  />
                  <input
                    value={c.modelos.join(', ')}
                    onChange={(e) => {
                      const compat = [...editando.compatibilidades];
                      compat[i] = { ...compat[i], modelos: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) };
                      setEditando({ ...editando, compatibilidades: compat });
                    }}
                    placeholder="Modelos separados por coma (vacío = toda la marca)"
                    className="campo flex-1"
                    aria-label={`Modelos compatibles de ${c.marca || `marca ${i + 1}`}`}
                  />
                  <button
                    type="button"
                    onClick={() => setEditando({ ...editando, compatibilidades: editando.compatibilidades.filter((_, j) => j !== i) })}
                    className="text-red-600"
                    aria-label="Quitar marca compatible"
                  >✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Tramos de precio por volumen */}
          <div>
            <div className="mb-1 flex items-center gap-3">
              <label className="etiqueta mb-0">Precios por volumen</label>
              <button
                type="button"
                onClick={() => setEditando({
                  ...editando,
                  preciosPorVolumen: [...editando.preciosPorVolumen, { desde: 1, hasta: null, precioUnitario: editando.precio }],
                })}
                className="text-xs font-semibold text-verde hover:underline"
              >
                + Agregar tramo
              </button>
            </div>
            {editando.preciosPorVolumen.map((t, i) => (
              <div key={i} className="mb-1 flex items-center gap-2 text-sm">
                <span>Desde</span>
                <input type="number" min={1} value={t.desde} onChange={(e) => setTramo(i, 'desde', e.target.value)} className="campo w-20" />
                <span>hasta</span>
                <input type="number" min={1} value={t.hasta ?? ''} placeholder="∞" onChange={(e) => setTramo(i, 'hasta', e.target.value)} className="campo w-20" />
                <span>→</span>
                <input type="number" min={0} value={t.precioUnitario} onChange={(e) => setTramo(i, 'precioUnitario', e.target.value)} className="campo w-28" />
                <span>CLP c/u</span>
                <button
                  type="button"
                  onClick={() => setEditando({ ...editando, preciosPorVolumen: editando.preciosPorVolumen.filter((_, j) => j !== i) })}
                  className="text-red-600"
                  aria-label="Quitar tramo"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Fotos */}
          <div>
            <p className="etiqueta">Fotos</p>
            <div className="flex flex-wrap items-center gap-2">
              {editando.fotos.map((f, i) => (
                <div key={f} className="relative">
                  <img src={f} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => setEditando({ ...editando, fotos: editando.fotos.filter((_, j) => j !== i) })}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white"
                    aria-label="Quitar foto"
                  >✕</button>
                </div>
              ))}
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-borde text-2xl text-gris-600 hover:border-verde">
                +
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => void subirFotos(e.target.files)} />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editando.destacado} onChange={(e) => setEditando({ ...editando, destacado: e.target.checked })} className="h-4 w-4 accent-verde" />
              Destacado en el home
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editando.activo} onChange={(e) => setEditando({ ...editando, activo: e.target.checked })} className="h-4 w-4 accent-verde" />
              Activo (visible en tienda)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editando.bajoPedido ?? false} onChange={(e) => setEditando({ ...editando, bajoPedido: e.target.checked })} className="h-4 w-4 accent-verde" />
              Permitir compra bajo pedido sin stock
            </label>
          </div>
          <button type="submit" className="btn-primario">Guardar producto</button>
        </form>
      )}

      {/* Tabla de productos */}
      <div className="overflow-x-auto rounded-xl border border-borde bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-verde text-left text-white">
            <tr>
              <th className="px-3 py-2.5 font-semibold">SKU</th>
              <th className="px-3 py-2.5 font-semibold">Producto</th>
              <th className="px-3 py-2.5 font-semibold">Precio</th>
              <th className="px-3 py-2.5 font-semibold">Stock</th>
              <th className="px-3 py-2.5 font-semibold">Estado</th>
              <th className="px-3 py-2.5 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id} className="border-t border-borde hover:bg-gris-fondo/60">
                <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                <td className="px-3 py-2">
                  {p.nombre}
                  {!p.activo && <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">INACTIVO</span>}
                </td>
                <td className="px-3 py-2">
                  <PrecioInline
                    producto={p}
                    alGuardar={async (nuevo) => {
                      await guardarProducto(nuevo);
                      setMensaje(`Precio de ${nuevo.sku} actualizado.`);
                      await recargar();
                    }}
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button onClick={() => void cambiarStock(p, -1)} className="h-6 w-6 rounded bg-gris-fondo font-bold hover:bg-borde" aria-label="Restar stock">−</button>
                    {/* key por valor: re-monta el nodo y dispara el pulso al cambiar el stock */}
                    <span key={p.stock} className="animar-pulso w-8 text-center font-semibold">{p.stock}</span>
                    <button onClick={() => void cambiarStock(p, 1)} className="h-6 w-6 rounded bg-gris-fondo font-bold hover:bg-borde" aria-label="Sumar stock">+</button>
                  </div>
                </td>
                <td className="px-3 py-2"><BadgeStock producto={p} compacto /></td>
                <td className="px-3 py-2">
                  <button onClick={() => setEditando({ ...p })} className="mr-3 font-semibold text-verde hover:underline">Editar</button>
                  <button onClick={() => void borrar(p)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
