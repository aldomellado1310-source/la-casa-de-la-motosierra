// ============================================================
// Buscador de texto con autocompletado: sugiere productos con
// foto, nombre y precio mientras se escribe (debounce 200 ms).
// Enter → resultados en la tienda · clic en sugerencia → ficha.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarPorTexto } from '../services/productos';
import { formatoCLP, precioVigente } from '../utils/precio';
import { IconoBuscar } from './Iconos';
import type { Producto } from '../types';

const MAX_SUGERENCIAS = 6;

export default function BuscadorConSugerencias() {
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [abierto, setAbierto] = useState(false);
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

  return (
    <div ref={contenedor} className="relative w-full">
      <form onSubmit={irATienda} role="search">
        <div className="flex overflow-hidden rounded-lg border border-borde focus-within:border-verde focus-within:ring-2 focus-within:ring-verde/25">
          <input
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onFocus={() => sugerencias.length > 0 && setAbierto(true)}
            placeholder="Buscar por nombre, SKU o producto…"
            aria-label="Buscar productos"
            aria-expanded={abierto}
            autoComplete="off"
            className="min-h-[44px] w-full border-0 px-4 text-base outline-none placeholder:text-gris-600 md:text-sm"
          />
          <button
            type="submit"
            className="flex min-h-[44px] items-center gap-2 bg-naranja px-4 text-sm font-bold text-white transition-colors hover:bg-naranja-oscuro md:px-5"
            aria-label="Buscar"
          >
            <IconoBuscar className="h-4 w-4" />
            <span className="hidden lg:inline">Buscar</span>
          </button>
        </div>
      </form>

      {/* Sugerencias */}
      {abierto && sugerencias.length > 0 && (
        <ul className="animar-entrada absolute left-0 right-0 top-full z-flotante mt-1 overflow-hidden rounded-xl border border-borde bg-white shadow-tarjeta">
          {sugerencias.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => irAProducto(p.id)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gris-fondo"
              >
                <img src={p.fotos[0]} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg border border-borde object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-semibold text-grafito">{p.nombre}</span>
                  <span className="text-xs text-gris-600">SKU {p.sku}</span>
                </span>
                <span className="shrink-0 text-sm font-bold text-grafito">{formatoCLP(precioVigente(p))}</span>
              </button>
            </li>
          ))}
          <li className="border-t border-borde">
            <button
              onClick={() => { setAbierto(false); navigate(`/tienda?q=${encodeURIComponent(texto.trim())}`); setTexto(''); }}
              className="w-full px-3 py-2.5 text-center text-sm font-semibold text-verde hover:bg-gris-fondo"
            >
              Ver todos los resultados de “{texto.trim()}” →
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
