// ============================================================
// Foto de producto con respaldo propio: mientras el producto no
// tenga foto real (placeholder de placehold.co del catálogo
// importado, o sin foto), se dibuja el ícono de su categoría en
// vez de pedir una imagen externa — más limpio y sin gastar datos
// en conexiones lentas.
// ============================================================
import {
  IconoCadena, IconoEngranaje, IconoEscudo, IconoHoja, IconoMotosierra, IconoRepuesto,
} from './Iconos';

/** Ícono de línea por categoría (también lo usa la portada) */
export const ICONO_CATEGORIA: Record<string, React.ComponentType<{ className?: string }>> = {
  motosierras: IconoMotosierra,
  desbrozadoras: IconoHoja,
  'espadas-cadenas': IconoCadena,
  'filtros-bujias': IconoEngranaje,
  'carburacion-arranque': IconoEngranaje,
  'aceites-lubricantes': IconoHoja,
  'herramientas-seguridad': IconoEscudo,
  'repuestos-varios': IconoEngranaje,
};

/** Tono de fondo del respaldo por categoría (da ritmo a las grillas) */
const TONO_CATEGORIA: Record<string, string> = {
  motosierras: 'bg-naranja-suave',
  desbrozadoras: 'bg-verde-badge',
  'espadas-cadenas': 'bg-naranja-suave',
  'filtros-bujias': 'bg-ambar-fondo',
  'carburacion-arranque': 'bg-pedido-fondo',
  'aceites-lubricantes': 'bg-verde-badge',
  'herramientas-seguridad': 'bg-ambar-fondo',
  'repuestos-varios': 'bg-gris-fondo',
};

/** true si la URL es un placeholder (no una foto real del producto) */
export function esFotoProvisoria(src?: string): boolean {
  return !src || src.includes('placehold.co');
}

interface Props {
  src?: string;
  alt: string;
  categoria?: string;
  className?: string;
  /** Tamaño del respaldo: 'chico' para miniaturas (solo ícono) */
  tamano?: 'normal' | 'chico';
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export default function FotoProducto({
  src, alt, categoria, className = '', tamano = 'normal', loading = 'lazy', width, height,
}: Props) {
  if (esFotoProvisoria(src)) {
    const Icono = (categoria && ICONO_CATEGORIA[categoria]) || IconoRepuesto;
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} (foto próximamente)` : 'Foto próximamente'}
        className={`flex flex-col items-center justify-center gap-2 text-carbon/70 ${(categoria && TONO_CATEGORIA[categoria]) || 'bg-gris-fondo'} ${className}`}
      >
        <Icono className={tamano === 'chico' ? 'h-1/2 w-1/2 opacity-70' : 'h-1/3 w-1/3 opacity-60'} />
        {tamano === 'normal' && <span className="text-sm font-semibold text-carbon/75">Foto próximamente</span>}
      </div>
    );
  }
  return <img src={src} alt={alt} loading={loading} width={width} height={height} className={className} />;
}
