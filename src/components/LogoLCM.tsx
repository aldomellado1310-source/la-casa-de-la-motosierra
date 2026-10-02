// Logo real de La Casa de la Motosierra (imagen entregada por el
// cliente: "CASA DE LA / MOTOSIERRA", barra dorada y motosierra).
// El texto del logo es negro: sobre fondos oscuros o de color se
// monta en una placa blanca (`tono="claro"`) para que se lea.
interface Props {
  /** 'oscuro' = sobre fondo claro · 'claro' = sobre fondo oscuro/color (placa blanca) */
  tono?: 'oscuro' | 'claro';
  /** Muestra la bajada "Repuestos y Servicio Técnico" */
  conBajada?: boolean;
  tamano?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/** Alto del logo por tamaño (proporción de la imagen 770×265 ≈ 2,9:1) */
const ALTO: Record<NonNullable<Props['tamano']>, string> = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-[4.5rem]',
};

/**
 * Silueta geométrica de motosierra (marca de agua decorativa).
 * `mono` la pinta completa con currentColor.
 */
export function MarcaMotosierra({ className = 'h-10 w-auto', mono = false }: { className?: string; mono?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 64 40" fill="none" aria-hidden="true">
      <rect x="2" y="21" width="40" height="6" rx="3" fill={mono ? 'currentColor' : '#1C1D1C'} />
      <path d="M36 14h16a6 6 0 0 1 6 6v8a4 4 0 0 1-4 4H38a4 4 0 0 1-4-4v-10a4 4 0 0 1 2-4z" fill={mono ? 'currentColor' : '#EE8100'} />
      <path d="M40 14v-6a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v6h-4V9h-7v5z" fill={mono ? 'currentColor' : '#1C1D1C'} />
    </svg>
  );
}

export default function LogoLCM({ tono = 'oscuro', conBajada = false, tamano = 'md', className = '' }: Props) {
  const imagen = (
    <picture>
      <source srcSet="/logo-lcm.webp" type="image/webp" />
      <img
        src="/logo-lcm.png"
        alt="La Casa de la Motosierra"
        width={770}
        height={265}
        className={`${ALTO[tamano]} w-auto select-none`}
        draggable={false}
      />
    </picture>
  );

  return (
    <span className={`inline-flex flex-col items-start ${className}`}>
      {tono === 'claro' ? <span className="rounded-xl bg-white px-3 py-2">{imagen}</span> : imagen}
      {conBajada && (
        <span className={`mt-1.5 block text-sm font-semibold ${tono === 'claro' ? 'text-white/80' : 'text-gris-600'}`}>
          Repuestos y Servicio Técnico
        </span>
      )}
    </span>
  );
}
