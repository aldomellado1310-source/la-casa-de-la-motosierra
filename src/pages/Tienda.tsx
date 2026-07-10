// ============================================================
// Tienda: grilla de productos con filtros laterales
// (categoría, marca/modelo compatible, disponibilidad),
// búsqueda de texto y paginación.
// ============================================================
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BuscadorCompatibilidad from '../components/BuscadorCompatibilidad';
import EstadoError from '../components/EstadoError';
import TarjetaProducto from '../components/TarjetaProducto';
import { obtenerCategorias, obtenerProductos } from '../services/productos';
import { enOferta, estadoStock } from '../utils/precio';
import { useSeo } from '../utils/seo';
import type { Categoria, Producto } from '../types';

const POR_PAGINA = 12;

export default function Tienda() {
  useSeo({
    titulo: 'Tienda de repuestos y maquinaria',
    descripcion:
      'Catálogo de cadenas, espadas, filtros, bujías, carburación, aceites y herramientas para motosierras y desbrozadoras. Filtra por compatibilidad con tu máquina.',
  });
  const [params, setParams] = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Parámetros de la URL = estado de los filtros (compartible)
  const q = params.get('q') ?? '';
  const categoria = params.get('categoria') ?? '';
  const marca = params.get('marca') ?? '';
  const modelo = params.get('modelo') ?? '';
  const soloDisponibles = params.get('disp') === '1';
  const soloOfertas = params.get('ofertas') === '1';
  const pagina = Math.max(1, parseInt(params.get('pagina') ?? '1', 10));

  const cargar = () => {
    setCargando(true);
    setError(false);
    Promise.all([obtenerProductos(), obtenerCategorias()])
      .then(([ps, cs]) => {
        setProductos(ps);
        setCategorias(cs);
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  };
  useEffect(cargar, []);

  // Aplicación de todos los filtros en memoria
  const filtrados = useMemo(() => {
    let lista = productos;
    if (categoria) lista = lista.filter((p) => p.categoria === categoria);
    if (marca) {
      lista = lista.filter((p) => {
        if (!p.marcasCompatibles.includes(marca)) return false;
        if (!modelo) return true;
        // Consumibles sin modelos declarados sirven para toda la marca
        return p.modelosCompatibles.length === 0 || p.modelosCompatibles.includes(modelo);
      });
    }
    if (q) {
      const texto = q.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(texto) ||
          p.sku.toLowerCase().includes(texto) ||
          p.descripcion.toLowerCase().includes(texto),
      );
    }
    if (soloDisponibles) lista = lista.filter((p) => estadoStock(p) !== 'agotado');
    if (soloOfertas) lista = lista.filter((p) => enOferta(p));
    return lista;
  }, [productos, categoria, marca, modelo, q, soloDisponibles, soloOfertas]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  /** Actualiza un parámetro de filtro y resetea la paginación */
  const setFiltro = (clave: string, valor: string) => {
    const nuevos = new URLSearchParams(params);
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    nuevos.delete('pagina');
    setParams(nuevos);
  };

  const irAPagina = (n: number) => {
    const nuevos = new URLSearchParams(params);
    nuevos.set('pagina', String(n));
    setParams(nuevos);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Buscador de compatibilidad compacto */}
      <div className="tarjeta mb-6">
        <p className="mb-2 text-sm font-bold text-verde">Filtrar por tu máquina</p>
        <BuscadorCompatibilidad compacto marcaInicial={marca} modeloInicial={modelo} />
      </div>

      {/* Chips de filtros activos */}
      {(marca || q || categoria || soloDisponibles || soloOfertas) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gris-600">Filtros:</span>
          {q && (
            <button onClick={() => setFiltro('q', '')} className="rounded-full bg-verde px-3 py-1 text-white">
              “{q}” ✕
            </button>
          )}
          {categoria && (
            <button onClick={() => setFiltro('categoria', '')} className="rounded-full bg-verde px-3 py-1 text-white">
              {categorias.find((c) => c.id === categoria)?.nombre ?? categoria} ✕
            </button>
          )}
          {marca && (
            <button
              onClick={() => {
                const nuevos = new URLSearchParams(params);
                nuevos.delete('marca');
                nuevos.delete('modelo');
                nuevos.delete('pagina');
                setParams(nuevos);
              }}
              className="rounded-full bg-naranja px-3 py-1 text-white"
            >
              Compatible: {marca}{modelo ? ` ${modelo}` : ''} ✕
            </button>
          )}
          {soloDisponibles && (
            <button onClick={() => setFiltro('disp', '')} className="rounded-full bg-verde px-3 py-1 text-white">
              Solo con stock ✕
            </button>
          )}
          {soloOfertas && (
            <button onClick={() => setFiltro('ofertas', '')} className="rounded-full bg-verde px-3 py-1 text-white">
              Solo ofertas ✕
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filtros laterales */}
        <aside className="lg:w-60 lg:shrink-0">
          <button
            className="btn-secundario mb-3 w-full lg:hidden"
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          >
            {filtrosAbiertos ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
          <div className={`${filtrosAbiertos ? 'block' : 'hidden'} space-y-5 lg:block`}>
            <div className="tarjeta">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Categorías</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <button
                    onClick={() => setFiltro('categoria', '')}
                    className={`w-full rounded px-2 py-1.5 text-left hover:bg-gris-fondo ${!categoria ? 'bg-verde/10 font-bold text-verde' : ''}`}
                  >
                    Todas
                  </button>
                </li>
                {categorias.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setFiltro('categoria', c.id)}
                      className={`w-full rounded px-2 py-1.5 text-left hover:bg-gris-fondo ${categoria === c.id ? 'bg-verde/10 font-bold text-verde' : ''}`}
                    >
                      {c.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tarjeta">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Disponibilidad</h3>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={soloDisponibles}
                  onChange={(e) => setFiltro('disp', e.target.checked ? '1' : '')}
                  className="h-4 w-4 accent-verde"
                />
                Solo con stock
              </label>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={soloOfertas}
                  onChange={(e) => setFiltro('ofertas', e.target.checked ? '1' : '')}
                  className="h-4 w-4 accent-verde"
                />
                Solo ofertas
              </label>
            </div>
          </div>
        </aside>

        {/* Grilla */}
        <div className="flex-1">
          <div className="mb-3 text-sm text-gris-600">
            {cargando ? 'Cargando catálogo…' : error ? '' : `${filtrados.length} producto${filtrados.length === 1 ? '' : 's'}`}
          </div>

          {error && <EstadoError onReintentar={cargar} />}

          {!cargando && !error && filtrados.length === 0 && (
            <div className="tarjeta py-12 text-center">
              <p className="font-semibold">No encontramos productos con esos filtros.</p>
              <p className="mt-1 text-sm text-gris-600">
                Prueba con otra marca/modelo o escríbenos por WhatsApp: lo conseguimos bajo pedido.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {visibles.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Paginación">
              <button
                onClick={() => irAPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="btn-secundario px-3 py-1.5"
              >
                ←
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => irAPagina(n)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                    n === paginaActual ? 'bg-verde text-white' : 'bg-white text-verde hover:bg-gris-fondo'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => irAPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="btn-secundario px-3 py-1.5"
              >
                →
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
