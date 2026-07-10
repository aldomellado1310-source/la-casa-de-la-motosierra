// Admin > Pedidos: listado con detalle y cambio de estado
import { useEffect, useState } from 'react';
import { ETIQUETAS_ESTADO_PEDIDO, actualizarEstadoPedido, descontarStockPedido, obtenerTodosLosPedidos } from '../../services/pedidos';
import { formatoCLP } from '../../utils/precio';
import type { EstadoPedido, Pedido } from '../../types';

const ESTADOS: EstadoPedido[] = [
  'pendiente_pago', 'pendiente_validacion', 'pagado', 'preparando',
  'despachado', 'listo_retiro', 'entregado', 'cancelado',
];

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [abierto, setAbierto] = useState<string | null>(null);

  const recargar = async () => setPedidos(await obtenerTodosLosPedidos());
  useEffect(() => { void recargar(); }, []);

  const cambiarEstado = async (id: string, estado: EstadoPedido) => {
    await actualizarEstadoPedido(id, estado);
    // Al validar un pago (p. ej. transferencia) se descuenta el stock;
    // el flag stockDescontado evita duplicar si la pasarela ya lo hizo
    if (estado === 'pagado') await descontarStockPedido(id);
    await recargar();
  };

  if (pedidos.length === 0) {
    return <p className="text-sm text-gris-600">No hay pedidos registrados todavía.</p>;
  }

  return (
    <div className="space-y-3">
      {pedidos.map((p) => (
        <div key={p.id} className="tarjeta">
          <button
            onClick={() => setAbierto(abierto === p.id ? null : p.id)}
            className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
          >
            <div>
              <span className="font-bold">{p.id}</span>
              <span className="ml-3 text-xs text-gris-600">
                {new Date(p.fecha).toLocaleString('es-CL')} · {p.nombreCliente} ({p.emailCliente})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-naranja-oscuro">{formatoCLP(p.total)}</span>
              <span className="rounded-full bg-verde/10 px-3 py-1 text-xs font-semibold text-verde">
                {ETIQUETAS_ESTADO_PEDIDO[p.estado]}
              </span>
            </div>
          </button>

          {abierto === p.id && (
            <div className="animar-entrada mt-4 border-t border-borde pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-xs font-bold uppercase text-gris-600">Ítems</h3>
                  <ul className="text-sm">
                    {p.items.map((it) => (
                      <li key={it.productoId} className="flex justify-between">
                        <span>{it.cantidad}× {it.nombre}</span>
                        <span>{formatoCLP(it.precioUnitario * it.cantidad)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-xs text-gris-600">
                    Subtotal {formatoCLP(p.subtotal)} + envío {formatoCLP(p.costoEnvio)}
                  </p>
                </div>
                <div className="text-sm">
                  <h3 className="mb-1 text-xs font-bold uppercase text-gris-600">Entrega y pago</h3>
                  <p>Envío: <strong>{p.metodoEnvio === 'retiro_tienda' ? 'Retiro en tienda' : p.metodoEnvio}</strong></p>
                  {p.direccion && (
                    <p>Dirección: {p.direccion.calle} {p.direccion.numero}, {p.direccion.comuna} ({p.direccion.region})</p>
                  )}
                  <p>Pago: <strong>{p.metodoPago}</strong>{p.referenciaPago ? ` · ref ${p.referenciaPago}` : ''}</p>
                  {p.comprobanteUrl && (
                    <a href={p.comprobanteUrl} target="_blank" rel="noreferrer" className="font-semibold text-verde hover:underline">
                      Ver comprobante de transferencia →
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <label className="text-sm font-semibold" htmlFor={`estado-${p.id}`}>Cambiar estado:</label>
                <select
                  id={`estado-${p.id}`}
                  value={p.estado}
                  onChange={(e) => void cambiarEstado(p.id, e.target.value as EstadoPedido)}
                  className="campo max-w-xs"
                >
                  {ESTADOS.map((es) => <option key={es} value={es}>{ETIQUETAS_ESTADO_PEDIDO[es]}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
