// ============================================================
// Tienda: título claro de lo que se está viendo, filtro por
// máquina arriba, filtros (categoría, disponibilidad) en panel
// lateral — en móvil tras un botón "Filtrar" rotulado —, grilla
// y paginación simple "Anterior / Página X de Y / Siguiente".
// ============================================================
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BuscadorCompatibilidad from '../components/BuscadorCompatibilidad';
import EstadoError from '../components/EstadoError';
import TarjetaProducto from '../components/TarjetaProducto';
import { IconoFiltro, IconoFlecha, IconoWhatsApp } from '../components/Iconos';
import { enlaceWhatsApp } from '../config/tienda';
import { obtenerCategorias, obtenerProductos } from '../services/productos';
import { enOferta, estadoStock } from '../utils/precio';
import { useSeo } from '../utils/seo';
import type { Categoria, Producto } from '../types';

const POR_PAGINA = 12;

/** Chip de filtro activo con "✕" visible y texto para lector de pantalla */
function ChipFiltro({ children, alQuitar }: { children: React.ReactNode; alQuitar: () => void }) {
  return (
    <button
      onClick={alQuitar}
      className="flex min-h-[44px] items-center gap-2 rounded-full border-2 border-carbon bg-naranja-suave pl-4 pr-3 text-base font-bold text-carbon transition-colors hover:bg-naranja"
    >
      {children}
      <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-grafito text-sm text-white">✕</span>
      <span className="sr-only">(quitar filtro)</span>
    </button>
  );
}

/** Opción de lista de filtros: fila grande, marcada con check y color */
function OpcionFiltro({ activa, children, onClick }: { activa: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activa}
      className={`flex min-h-[48px] w-full items-center gap-3 rounded-[10px] px-3 text-left text-base transition-colors ${
        activa ? 'bg-carbon font-bold text-white' : 'text-grafito hover:bg-gris-fondo'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          activa ? 'border-naranja bg-naranja' : 'border-gris-600'
        }`}
      >
        {activa && <span className="h-2 w-2 rounded-full bg-carbon" />}
      </span>
      {children}
    </button>
  );
}

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
  const pagina = Math.max(1, parseInt(params.get('pagina') ?? '1', 10) || 1);

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
        const c = p.compatibilidades.find((x) => x.marca === marca);
        if (!c) return false;
        if (!modelo) return true;
        // Sin modelos declarados para esta marca = sirve para toda la marca
        return c.modelos.length === 0 || c.modelos.includes(modelo);
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

  const quitarMaquina = () => {
    const nuevos = new URLSearchParams(params);
    nuevos.delete('marca');
    nuevos.delete('modelo');
    nuevos.delete('pagina');
    setParams(nuevos);
  };

  const irAPagina = (n: number) => {
    const nuevos = new URLSearchParams(params);
    nuevos.set('pagina', String(n));
    setParams(nuevos);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nombreCategoria = categorias.find((c) => c.id === categoria)?.nombre ?? categoria;
  // Título: dice en palabras qué se está viendo
  const titulo = q
    ? `Resultados para “${q}”`
    : soloOfertas
      ? 'Ofertas'
      : categoria
        ? nombreCategoria
        : marca
          ? `Repuestos para ${marca}${modelo ? ` ${modelo}` : ''}`
          : 'Todos los repuestos';

  const filtrosLaterales = (categoria ? 1 : 0) + (soloDisponibles ? 1 : 0) + (soloOfertas ? 1 : 0);
  const hayFiltros = Boolean(marca || q || categoria || soloDisponibles || soloOfertas);

  return (
    <div className="contenedor py-6 sm:py-8">
      <h1 className="titulo-seccion">{titulo}</h1>
      <p className="mt-2 text-base text-gris-600" aria-live="polite">
        {cargando ? 'Cargando catálogo…' : error ? '' : `${filtrados.length} producto${filtrados.length === 1 ? '' : 's'} · Precios con IVA incluido`}
      </p>

      {/* Filtro por máquina */}
      <div className="mt-5 rounded-[22px] border-2 border-carbon bg-naranja-suave p-4 sm:p-5">
        <p className="mb-3 text-lg font-bold">¿Para qué máquina es?</p>
        <BuscadorCompatibilidad compacto marcaInicial={marca} modeloInicial={modelo} />
      </div>

      {/* Filtros activos */}
      {hayFiltros && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-base text-gris-600">Mostrando:</span>
          {q && <ChipFiltro alQuitar={() => setFiltro('q', '')}>“{q}”</ChipFiltro>}
          {categoria && <ChipFiltro alQuitar={() => setFiltro('categoria', '')}>{nombreCategoria}</ChipFiltro>}
          {marca && <ChipFiltro alQuitar={quitarMaquina}>Para {marca}{modelo ? ` ${modelo}` : ''}</ChipFiltro>}
          {soloDisponibles && <ChipFiltro alQuitar={() => setFiltro('disp', '')}>Solo con stock</ChipFiltro>}
          {soloOfertas && <ChipFiltro alQuitar={() => setFiltro('ofertas', '')}>Solo ofertas</ChipFiltro>}
          <Link to="/tienda" className="enlace ml-1 min-h-[44px] content-center px-1 text-base">
            Borrar todo
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Filtros laterales */}
        <aside className="lg:w-64 lg:shrink-0">
          <button
            className="btn-secundario w-full lg:hidden"
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
            aria-expanded={filtrosAbiertos}
            aria-controls="panel-filtros"
          >
            <IconoFiltro className="h-5 w-5" />
            {filtrosAbiertos ? 'Ocultar filtros' : `Filtrar por categoría${filtrosLaterales ? ` (${filtrosLaterales})` : ''}`}
          </button>
          <div id="panel-filtros" className={`${filtrosAbiertos ? 'block animar-entrada' : 'hidden'} mt-3 space-y-6 lg:mt-0 lg:block`}>
            <div>
              <h2 className="mb-2 px-3 text-lg font-bold">Categoría</h2>
              <div className="space-y-0.5">
                <OpcionFiltro activa={!categoria} onClick={() => setFiltro('categoria', '')}>Todas</OpcionFiltro>
                {categorias.map((c) => (
                  <OpcionFiltro key={c.id} activa={categoria === c.id} onClick={() => setFiltro('categoria', c.id)}>
                    {c.nombre}
                  </OpcionFiltro>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-2 px-3 text-lg font-bold">Mostrar solo</h2>
              <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-[10px] px-3 text-base hover:bg-gris-fondo">
                <input
                  type="checkbox"
                  checked={soloDisponibles}
                  onChange={(e) => setFiltro('disp', e.target.checked ? '1' : '')}
                  className="control-grande mt-0"
                />
                Con stock disponible
              </label>
              <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-[10px] px-3 text-base hover:bg-gris-fondo">
                <input
                  type="checkbox"
                  checked={soloOfertas}
                  onChange={(e) => setFiltro('ofertas', e.target.checked ? '1' : '')}
                  className="control-grande mt-0"
                />
                En oferta
              </label>
            </div>
            <button className="btn-verde w-full lg:hidden" onClick={() => setFiltrosAbiertos(false)}>
              Ver {filtrados.length} productos
            </button>
          </div>
        </aside>

        {/* Grilla */}
        <div className="min-w-0 flex-1">
          {error && <EstadoError onReintentar={cargar} />}

          {!cargando && !error && filtrados.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-borde px-5 py-12 text-center">
              <p className="text-xl font-bold">No encontramos productos con esos filtros</p>
              <p className="mx-auto mt-2 max-w-md text-base text-gris-600">
                Prueba quitando un filtro, o escríbenos: muchos repuestos los conseguimos bajo pedido.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={enlaceWhatsApp(`Hola, busco un repuesto${q ? `: ${q}` : ''}${marca ? ` para ${marca}${modelo ? ` ${modelo}` : ''}` : ''}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  <IconoWhatsApp className="h-5 w-5" /> Preguntar por WhatsApp
                </a>
                <Link to="/tienda" className="btn-secundario">Ver todos los repuestos</Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {cargando
              ? Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="aspect-[3/5] animate-pulse rounded-xl bg-gris-fondo" />
                ))
              : visibles.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
          </div>

          {/* Paginación simple: pocas decisiones, botones grandes */}
          {totalPaginas > 1 && (
            <nav className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between" aria-label="Paginación">
              <button
                onClick={() => irAPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="btn-secundario px-4"
              >
                <IconoFlecha direccion="izquierda" className="h-5 w-5" />
                Anterior
              </button>
              <p className="col-span-2 row-start-1 text-center text-base">
                Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
              </p>
              <button
                onClick={() => irAPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="btn-primario px-4"
              >
                Siguiente
                <IconoFlecha className="h-5 w-5" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
