// ============================================================
// Buscador por máquina (compatibilidad) — el diferenciador clave.
// Dos pasos numerados en lenguaje simple: marca → modelo, con
// conteo en vivo de repuestos que le sirven. Incluye la salida
// humana para quien no sabe el modelo (foto por WhatsApp).
// ============================================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buscarPorCompatibilidad, obtenerMarcasCompatibles, obtenerModelosPorMarca,
} from '../services/productos';
import { useAuth } from '../stores/useAuth';
import { enlaceWhatsApp } from '../config/tienda';
import { IconoEngranaje, IconoFlecha, IconoWhatsApp } from './Iconos';

interface Props {
  /** Variante compacta para la barra de la tienda (sin tarjeta ni ayuda) */
  compacto?: boolean;
  marcaInicial?: string;
  modeloInicial?: string;
}

/** Número de paso dentro de un círculo */
function Paso({ n }: { n: number }) {
  return (
    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-carbon text-sm font-bold text-white" aria-hidden="true">
      {n}
    </span>
  );
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

  useEffect(() => {
    void obtenerMarcasCompatibles().then(setMarcas);
  }, []);

  // Sincroniza con la URL cuando la tienda cambia los filtros desde afuera
  useEffect(() => setMarca(marcaInicial), [marcaInicial]);
  useEffect(() => setModelo(modeloInicial), [modeloInicial]);

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

  const irAResultados = (marcaDestino: string, modeloDestino: string) => {
    const params = new URLSearchParams({ marca: marcaDestino });
    if (modeloDestino) params.set('modelo', modeloDestino);
    navigate(`/tienda?${params.toString()}`);
  };

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (marca) irAResultados(marca, modelo);
  };

  const selects = (
    <>
      <div className="min-w-0 flex-1">
        <label className="etiqueta" htmlFor={compacto ? 'sel-marca-c' : 'sel-marca'}>
          {compacto ? 'Marca de tu máquina' : <><Paso n={1} />Marca de tu máquina</>}
        </label>
        <select id={compacto ? 'sel-marca-c' : 'sel-marca'} value={marca} onChange={(e) => setMarca(e.target.value)} className="campo">
          <option value="">Elige la marca…</option>
          {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="min-w-0 flex-1">
        <label className="etiqueta" htmlFor={compacto ? 'sel-modelo-c' : 'sel-modelo'}>
          {compacto ? 'Modelo' : <><Paso n={2} />Modelo <span className="font-normal text-gris-600">(si lo sabes)</span></>}
        </label>
        <select id={compacto ? 'sel-modelo-c' : 'sel-modelo'} value={modelo} onChange={(e) => setModelo(e.target.value)} className="campo" disabled={!marca}>
          <option value="">{marca ? 'Todos los modelos' : 'Primero elige la marca'}</option>
          {modelos.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </>
  );

  /** Accesos rápidos a las máquinas guardadas del cliente */
  const chipsMaquinas = misMaquinas.length > 0 && (
    <div className={compacto ? 'mt-3' : 'mt-4 border-t border-borde pt-4'}>
      <p className="mb-2 text-sm font-semibold text-gris-600">Tus máquinas guardadas:</p>
      <div className="flex flex-wrap gap-2">
        {misMaquinas.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => irAResultados(m.marca, m.modelo)}
            className="flex min-h-[44px] items-center gap-2 rounded-full bg-verde-badge px-4 text-sm font-bold text-verde-oscuro transition-colors hover:bg-verde hover:text-white"
          >
            <IconoEngranaje className="h-4 w-4" />
            Mi {m.marca}{m.modelo ? ` ${m.modelo}` : ''}
          </button>
        ))}
      </div>
    </div>
  );

  if (compacto) {
    return (
      <div>
        <form onSubmit={buscar} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {selects}
          <button type="submit" disabled={!marca} className="btn-primario sm:min-h-[52px] sm:shrink-0">
            {conteo !== null ? `Ver ${conteo} repuestos` : 'Ver repuestos'}
          </button>
        </form>
        {chipsMaquinas}
      </div>
    );
  }

  // Variante principal (portada): marcas como botones grandes que "saltan"
  return (
    <div className="rounded-[22px] border-2 border-carbon bg-white p-5 text-carbon shadow-dura sm:p-6">
      <h2 className="font-display text-[2rem] font-extrabold uppercase leading-none">Elige tu marca</h2>
      <p className="mt-1.5 text-base text-gris-600">Te mostramos solo los repuestos que le sirven.</p>

      <form onSubmit={buscar} className="mt-5 space-y-4">
        <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Marca de tu máquina">
          {marcas.map((m) => {
            const activa = marca === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMarca(activa ? '' : m)}
                aria-pressed={activa}
                className={`min-h-[64px] rounded-[14px] border-2 px-1.5 text-base font-extrabold leading-tight transition-[transform,background-color,box-shadow] duration-150 ease-[var(--ease-salida)] ${
                  activa
                    ? '-translate-y-[3px] border-carbon bg-carbon text-white shadow-dura-naranja'
                    : 'border-borde bg-white text-carbon hover:border-carbon'
                }`}
              >
                {m.replace(/\//g, '/​')}
              </button>
            );
          })}
          <a
            href={enlaceWhatsApp('Hola, busco un repuesto para mi máquina de otra marca:')}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[64px] items-center justify-center rounded-[14px] border-2 border-dashed border-borde px-1.5 text-center text-base font-extrabold leading-tight text-carbon hover:border-carbon"
          >
            Otra marca
          </a>
        </div>

        {/* El modelo aparece recién cuando hay marca: una decisión a la vez */}
        {marca && (
          <div className="animar-entrada">
            <label className="etiqueta" htmlFor="sel-modelo">
              Modelo de tu {marca} <span className="font-normal text-gris-600">(si lo sabes)</span>
            </label>
            <select id="sel-modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} className="campo">
              <option value="">Todos los modelos</option>
              {modelos.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}

        <button type="submit" disabled={!marca} className="btn-primario btn-grande w-full">
          {marca ? `Ver repuestos para ${marca}` : 'Primero toca tu marca'}
          {marca && <IconoFlecha className="h-5 w-5" />}
        </button>
      </form>

      {chipsMaquinas}

      {/* Salida humana: no todos conocen el modelo */}
      <p className="mt-4 border-t-2 border-gris-fondo pt-4 text-base text-gris-600">
        ¿No sabes el modelo?{' '}
        <a
          href={enlaceWhatsApp('Hola, no sé el modelo de mi máquina. Les envío una foto:')}
          target="_blank"
          rel="noreferrer"
          className="enlace inline-flex items-center gap-1"
        >
          <IconoWhatsApp className="h-4 w-4" /> Mándanos una foto
        </a>{' '}
        y te ayudamos.
      </p>
    </div>
  );
}
