// ============================================================
// Buscador de texto con autocompletado: sugiere productos con
// foto, nombre y precio mientras se escribe (debounce 200 ms).
// Enter → resultados en la tienda · clic/Enter en sugerencia → ficha.
// Patrón combobox accesible: flechas para recorrer, Esc cierra.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarPorTexto } from '../services/productos';
import { formatoCLP, precioVigente } from '../utils/precio';
import { IconoBuscar, IconoFlecha } from './Iconos';
import FotoProducto from './FotoProducto';
import type { Producto } from '../types';

const MAX_SUGERENCIAS = 6;

export default function BuscadorConSugerencias() {
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(-1); // sugerencia resaltada con el teclado
  const contenedor = useRef<HTMLDivElement>(null);

  // Búsqueda con debounce mientras se escribe
  useEffect(() => {
    if (texto.trim().length < 2) {
      setSugerencias([]);
      return;
    }
    const timer = setTimeout(() => {
      void buscarPorTexto(texto).then((ps) => {
        setSugerencias(ps.slice(0, MAX_SUGERENCIAS));
        setAbierto(true);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [texto]);

  // Al cambiar las sugerencias se pierde el resaltado
  useEffect(() => setActiva(-1), [sugerencias]);

  // Cierra el desplegable al hacer clic fuera
  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const irATienda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setAbierto(false);
    navigate(`/tienda?q=${encodeURIComponent(texto.trim())}`);
    setTexto('');
  };

  const irAProducto = (id: string) => {
    setAbierto(false);
    setTexto('');
    navigate(`/producto/${id}`);
  };

  /** Navegación por teclado dentro de las sugerencias */
  const alTeclear = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setAbierto(false);
      setActiva(-1);
      return;
    }
    if (!abierto || sugerencias.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiva((i) => (i + 1) % sugerencias.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiva((i) => (i <= 0 ? sugerencias.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activa >= 0) {
      // Con una sugerencia resaltada, Enter abre la ficha (no el submit)
      e.preventDefault();
      irAProducto(sugerencias[activa].id);
    }
  };

  const desplegableVisible = abierto && sugerencias.length > 0;

  return (
    <div ref={contenedor} className="relative w-full">
      <form onSubmit={irATienda} role="search">
        <div className="flex overflow-hidden rounded-[12px] border-2 border-carbon bg-white focus-within:ring-4 focus-within:ring-verde/30">
          <input
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onFocus={() => sugerencias.length > 0 && setAbierto(true)}
            onKeyDown={alTeclear}
            placeholder="Ej: cadena, filtro, bujía…"
            aria-label="¿Qué repuesto buscas?"
            role="combobox"
            aria-expanded={desplegableVisible}
            aria-controls="lista-sugerencias"
            aria-autocomplete="list"
            aria-activedescendant={activa >= 0 ? `sugerencia-${sugerencias[activa].id}` : undefined}
            autoComplete="off"
            className="min-h-[52px] w-full min-w-0 border-0 px-4 text-base outline-none placeholder:text-gris-600 [&::-webkit-search-cancel-button]:h-5 [&::-webkit-search-cancel-button]:w-5"
          />
          <button
            type="submit"
            className="m-1 flex min-h-[44px] shrink-0 items-center gap-2 rounded-[9px] bg-carbon px-4 text-base font-bold text-white transition-colors hover:bg-grafito md:px-6"
          >
            <IconoBuscar className="h-5 w-5" />
            Buscar
          </button>
        </div>
      </form>

      {/* Sugerencias */}
      {desplegableVisible && (
        <div className="animar-entrada absolute left-0 right-0 top-full z-flotante mt-2 overflow-hidden rounded-2xl border-2 border-carbon bg-white shadow-dura">
          <ul id="lista-sugerencias" role="listbox" aria-label="Sugerencias de productos">
            {sugerencias.map((p, i) => (
              <li
                key={p.id}
                id={`sugerencia-${p.id}`}
                role="option"
                aria-selected={i === activa}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => irAProducto(p.id)}
                onMouseEnter={() => setActiva(i)}
                className={`flex min-h-[64px] cursor-pointer items-center gap-3 border-b border-borde px-3 py-2.5 transition-colors ${i === activa ? 'bg-gris-fondo' : ''}`}
              >
                <FotoProducto src={p.fotos[0]} alt="" categoria={p.categoria} tamano="chico" width={48} height={48} className="h-12 w-12 shrink-0 rounded-lg border border-borde object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-base font-semibold leading-snug text-grafito">{p.nombre}</span>
                  <span className="text-sm text-gris-600">Código {p.sku}</span>
                </span>
                <span className="shrink-0 text-base font-bold text-grafito">{formatoCLP(precioVigente(p))}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => { setAbierto(false); navigate(`/tienda?q=${encodeURIComponent(texto.trim())}`); setTexto(''); }}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 px-3 text-center text-base font-bold text-verde hover:bg-gris-fondo"
          >
            Ver todos los resultados de “{texto.trim()}” <IconoFlecha className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
