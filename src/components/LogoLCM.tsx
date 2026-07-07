// Recreación web del logo real: tipografía condensada, barra naranja
// entre "LA CASA DE LA" y "MOTOSIERRA", y motosierra naranja/negra.
// Al pasar el cursor, la cadena "gira" sobre la espada y el cuerpo
// vibra como acelerando (ver index.css).
// `tono` adapta el texto a fondos claros u oscuros.
interface Props {
  /** 'oscuro' = texto negro (fondos claros) · 'claro' = texto blanco (fondos oscuros) */
  tono?: 'oscuro' | 'claro';
  /** Muestra la bajada "Repuestos y Servicio Técnico" */
  conBajada?: boolean;
  /** 'lg' agranda el lockup (header principal) */
  tamano?: 'md' | 'lg';
  className?: string;
}

/**
 * Silueta geométrica de motosierra: cuerpo naranja, espada con cadena animable.
 * `mono` la pinta completa con currentColor (para marcas de agua).
 */
export function MarcaMotosierra({ className = 'h-10 w-auto', mono = false }: { className?: string; mono?: boolean }) {
  return (
    <svg className={`marca-motosierra ${className}`} viewBox="0 0 64 40" fill="none" aria-hidden="true">
      {/* Espada */}
      <rect x="2" y="21" width="40" height="6" rx="3" fill={mono ? 'currentColor' : '#1C1D1C'} />
      {/* Cadena: trazo discontinuo que gira alrededor de la espada al hover */}
      <rect
        x="3" y="22" width="38" height="4" rx="2"
        className="cadena-logo"
        stroke={mono ? 'currentColor' : '#9AA09B'}
        strokeWidth="1.4"
        strokeDasharray="2.5 2"
        fill="none"
        opacity={mono ? 0.5 : 1}
      />
      {/* Cuerpo del motor */}
      <path d="M36 14h16a6 6 0 0 1 6 6v8a4 4 0 0 1-4 4H38a4 4 0 0 1-4-4v-10a4 4 0 0 1 2-4z" fill={mono ? 'currentColor' : '#EE8100'} />
      {/* Empuñadura superior */}
      <path d="M40 14v-6a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v6h-4V9h-7v5z" fill={mono ? 'currentColor' : '#1C1D1C'} />
      {/* Detalle de escape */}
      <rect x="38" y="18" width="10" height="4" rx="1" fill={mono ? 'currentColor' : '#C96C00'} opacity={mono ? 0.6 : 1} />
    </svg>
  );
}

export default function LogoLCM({ tono = 'oscuro', conBajada = false, tamano = 'md', className = '' }: Props) {
  const colorTexto = tono === 'claro' ? 'text-white' : 'text-grafito';
  const esGrande = tamano === 'lg';
  return (
    <span className={`grupo-logo flex items-center ${esGrande ? 'gap-3' : 'gap-2.5'} ${className}`}>
      <MarcaMotosierra className={esGrande ? 'h-12 w-auto sm:h-14' : 'h-10 w-auto'} />
      <span className="leading-none">
        <span
          className={`block font-display font-semibold uppercase tracking-[0.18em] ${colorTexto} ${
            esGrande ? 'text-[15px] sm:text-[17px]' : 'text-[14px]'
          }`}
        >
          La Casa de la
        </span>
        {/* Barra naranja del logo: entra creciendo desde la izquierda */}
        <span
          className={`barra-logo my-0.5 block w-full origin-left bg-naranja ${esGrande ? 'h-[4px]' : 'h-[3.5px]'}`}
          aria-hidden="true"
        />
        <span
          className={`block font-display font-bold uppercase leading-none tracking-wide ${colorTexto} ${
            esGrande ? 'text-[27px] sm:text-[31px]' : 'text-[24px]'
          }`}
        >
          Motosierra
        </span>
        {conBajada && (
          <span
            className={`mt-1 block font-medium ${tono === 'claro' ? 'text-white/70' : 'text-gris-600'} ${
              esGrande ? 'text-[11px]' : 'text-[10px]'
            }`}
          >
            Repuestos y Servicio Técnico
          </span>
        )}
      </span>
    </span>
  );
}
