// Badge de estado de stock real y visible
import { estadoStock, etiquetaStock } from '../utils/precio';
import type { Producto } from '../types';

const ESTILOS: Record<string, string> = {
  en_stock: 'bg-verde-badge text-verde-oscuro',
  ultimas_unidades: 'bg-[#FCF3D9] text-[#7A5800]',
  agotado: 'border border-borde bg-gris-fondo text-gris-600',
  bajo_pedido: 'bg-[#FDEBD9] text-[#8F4B00]',
};

interface Props {
  producto: Pick<Producto, 'stock' | 'bajoPedido'>;
  /** Versión corta para tarjetas: "En stock (12)" */
  compacto?: boolean;
}

export default function BadgeStock({ producto, compacto = false }: Props) {
  const estado = estadoStock(producto);
  const texto = compacto
    ? {
        en_stock: `En stock (${producto.stock})`,
        ultimas_unidades: 'Últimas unidades',
        agotado: 'Agotado',
        bajo_pedido: 'Bajo pedido',
      }[estado]
    : etiquetaStock(producto);

  return (
    <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${ESTILOS[estado]}`}>
      {texto}
    </span>
  );
}
