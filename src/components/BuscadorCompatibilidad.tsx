// ============================================================
// Buscador por compatibilidad de máquina — el diferenciador
// clave. Selector Marca → Modelo con conteo en vivo de
// repuestos compatibles, más búsqueda de texto libre.
// ============================================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buscarPorCompatibilidad, obtenerMarcasCompatibles, obtenerModelosPorMarca,
} from '../services/productos';
import { useAuth } from '../stores/useAuth';
import { IconoBuscar, IconoEngranaje } from './Iconos';

interface Props {
  /** Variante compacta para la barra de la tienda (sin tarjeta ni texto libre) */
  compacto?: boolean;
  marcaInicial?: string;
  modeloInicial?: string;
}

export default function BuscadorCompatibilidad({ compacto = false, marcaInicial = '', modeloInicial = '' }: Props) {
  const navigate = useNavigate();
  const usuario = useAuth((s) => s.usuario);
  const misMaquinas = usuario?.maquinas ?? [];
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [marca, setMarca] = useState(marcaInicial);
  const [modelo, setModelo] = useState(modeloInicial);
  const [conteo, setConteo] = useState<number | null>(null);
  const [textoLibre, setTextoLibre] = useState('');

  useEffect(() => {
    void obtenerMarcasCompatibles().then(setMarcas);
  }, []);

  // Al cambiar la marca se recargan sus modelos y el conteo
  useEffect(() => {
    if (!marca) {
      setModelos([]);
      setModelo('');
      setConteo(null);
      return;
    }
    void obtenerModelosPorMarca(marca).then((ms) => {
      setModelos(ms);
      if (modelo && !ms.includes(modelo)) setModelo('');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marca]);

  // Conteo en vivo de repuestos compatibles
  useEffect(() => {
    if (!marca) return;
    void buscarPorCompatibilidad(marca, modelo || undefined).then((ps) => setConteo(ps.length));
  }, [marca, modelo]);

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marca) return;
    const params = new URLSearchParams({ marca });
    if (modelo) params.set('modelo', modelo);
    navigate(`/tienda?${params.toString()}`);
  };

  const buscarTexto = (e: React.FormEvent) => {
    e.preventDefault();
    if (textoLibre.trim()) navigate(`/tienda?q=${encodeURIComponent(textoLibre.trim())}`);
  };

  const selects = (
    <>
      <div className="flex-1">
        <label className="etiqueta" htmlFor="sel-marca">
          {compacto ? 'Marca' : '1. Selecciona la marca'}
        </label>
        <select id="sel-marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="campo">
          <option value="">Marca (ej: Stihl)…</option>
          {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label className="etiqueta" htmlFor="sel-modelo">
          {compacto ? 'Modelo' : '2. Selecciona el modelo'}
        </label>
        <select id="sel-modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} className="campo" disabled={!marca}>
          <option value="">{marca ? 'Todos los modelos' : 'Modelo (ej: MS 250)'}</option>
          {modelos.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </>
  );

  const botonTexto = conteo !== null ? `Ver repuestos compatibles (${conteo})` : 'Ver repuestos compatibles';

  /** Chips "Compatible con tu máquina" para clientes con máquinas guardadas */
  const irAMiMaquina = (marcaMaq: string, modeloMaq: string) => {
    const params = new URLSearchParams({ marca: marcaMaq });
    if (modeloMaq) params.set('modelo', modeloMaq);
    navigate(`/tienda?${params.toString()}`);
  };

  const chipsMaquinas = misMaquinas.length > 0 && (
    <div className={compacto ? 'mt-2' : 'mt-4 border-t border-borde pt-3'}>
      <p className="mb-1.5 text-xs font-semibold text-gris-600">Tus máquinas guardadas:</p>
      <div className="flex flex-wrap gap-1.5">
        {misMaquinas.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => irAMiMaquina(m.marca, m.modelo)}
            className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-verde-badge px-3 py-1 text-xs font-bold text-verde-oscuro transition-colors hover:bg-verde hover:text-white"
          >
            <IconoEngranaje className="h-3.5 w-3.5" />
            Compatible con tu {m.marca}{m.modelo ? ` ${m.modelo}` : ''}
          </button>
        ))}
      </div>
    </div>
  );

  if (compacto) {
    return (
      <div>
        <form onSubmit={buscar} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          {selects}
          <button type="submit" disabled={!marca} className="btn-verde sm:shrink-0">
            {conteo !== null ? `Ver repuestos (${conteo})` : 'Ver repuestos'}
          </button>
        </form>
        {chipsMaquinas}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-tarjeta sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <IconoBuscar className="h-6 w-6 shrink-0 text-verde" />
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-grafito">
            Buscar por compatibilidad
          </h2>
          <p className="text-sm text-gris-600">Encuentra el repuesto exacto para tu máquina</p>
        </div>
      </div>

      <form onSubmit={buscar} className="space-y-3">
        {selects}
        <button type="submit" disabled={!marca} className="btn-verde w-full py-3">
          {botonTexto} <span aria-hidden="true">→</span>
        </button>
      </form>

      {chipsMaquinas}

      {/* Búsqueda de texto libre */}
      <form onSubmit={buscarTexto} className="mt-4 border-t border-borde pt-4">
        <label className="etiqueta" htmlFor="busqueda-libre">O busca por texto libre</label>
        <div className="relative">
          <input
            id="busqueda-libre"
            type="search"
            value={textoLibre}
            onChange={(e) => setTextoLibre(e.target.value)}
            placeholder="Ej: carburador, filtro de aire, cadena 3/8…"
            className="campo pr-11"
          />
          <button type="submit" className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-verde hover:bg-gris-fondo" aria-label="Buscar texto libre">
            <IconoBuscar className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
