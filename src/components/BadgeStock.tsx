// Estado de stock real y visible.
// · Variante pill (por defecto): fondo de color, para fichas y admin.
// · Variante `linea`: punto de color + texto, para tarjetas (se lee
//   como una frase y no compite con el precio).
import { estadoStock, etiquetaStock } from '../utils/precio';
import type { Producto } from '../types';

const ESTILOS: Record<string, string> = {
  en_stock: 'bg-verde-badge text-verde-oscuro',
  ultimas_unidades: 'bg-ambar-fondo text-ambar',
  agotado: 'border border-borde bg-gris-fondo text-gris-600',
  bajo_pedido: 'bg-pedido-fondo text-pedido',
};

const PUNTO: Record<string, string> = {
  en_stock: 'bg-verde',
  ultimas_unidades: 'bg-[#D99A00]',
  agotado: 'bg-gris-600',
  bajo_pedido: 'bg-pedido',
};

const TEXTO_LINEA: Record<string, string> = {
  en_stock: 'text-verde-oscuro',
  ultimas_unidades: 'text-ambar',
  agotado: 'text-gris-600',
  bajo_pedido: 'text-pedido',
};

interface Props {
  producto: Pick<Producto, 'stock' | 'bajoPedido'>;
  /** Versión corta: "En stock (12)" */
  compacto?: boolean;
  /** Punto + texto, sin fondo */
  linea?: boolean;
}

export default function BadgeStock({ producto, compacto = false, linea = false }: Props) {
  const estado = estadoStock(producto);
  const texto = compacto || linea
    ? {
        en_stock: `En stock (${producto.stock})`,
        ultimas_unidades: `Quedan ${producto.stock}`,
        agotado: 'Agotado',
        bajo_pedido: 'Bajo pedido',
      }[estado]
    : etiquetaStock(producto);

  if (linea) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${TEXTO_LINEA[estado]}`}>
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${PUNTO[estado]}`} aria-hidden="true" />
        {texto}
      </span>
    );
  }

  return (
    <span className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${ESTILOS[estado]}`}>
      {texto}
    </span>
  );
}
