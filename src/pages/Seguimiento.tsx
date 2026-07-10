// ============================================================
// Seguimiento de pedido público: el cliente pega su número de
// pedido (PED-AAAAMMDD-XXXX) y ve el estado sin iniciar sesión.
// Pensado para reducir los "¿y mi pedido?" por WhatsApp.
// ============================================================
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ETIQUETAS_ESTADO_PEDIDO, obtenerPedidoPorId } from '../services/pedidos';
import { WHATSAPP_NUMERO } from '../config/firebase';
import { formatoCLP } from '../utils/precio';
import { useSeo } from '../utils/seo';
import { IconoCamion, IconoWhatsApp } from '../components/Iconos';
import type { EstadoPedido, Pedido } from '../types';

/** Hitos del flujo normal según método de entrega */
function hitosPara(pedido: Pedido): EstadoPedido[] {
  const base: EstadoPedido[] =
    pedido.metodoPago === 'transferencia'
      ? ['pendiente_validacion', 'pagado', 'preparando']
      : ['pendiente_pago', 'pagado', 'preparando'];
  return [...base, pedido.metodoEnvio === 'retiro_tienda' ? 'listo_retiro' : 'despachado', 'entregado'];
}

export default function Seguimiento() {
  useSeo({
    titulo: 'Seguimiento de pedido',
    descripcion: 'Consulta el estado de tu pedido con el número que recibiste al comprar, sin iniciar sesión.',
  });
  const [params] = useSearchParams();
  const [numero, setNumero] = useState(params.get('pedido') ?? '');
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [buscado, setBuscado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim()) return;
    setCargando(true);
    try {
      setPedido(await obtenerPedidoPorId(numero));
      setBuscado(true);
    } finally {
      setCargando(false);
    }
  };

  // Si llega con ?pedido= (p. ej. desde el retorno de pago), buscar de inmediato
  useEffect(() => {
    const inicial = params.get('pedido');
    if (!inicial?.trim()) return;
    setCargando(true);
    obtenerPedidoPorId(inicial)
      .then((p) => {
        setPedido(p);
        setBuscado(true);
      })
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hitos = pedido ? hitosPara(pedido) : [];
  const indiceActual = pedido ? hitos.indexOf(pedido.estado) : -1;
  const cancelado = pedido?.estado === 'cancelado';

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="titulo-seccion mb-2 flex items-center gap-3">
        <IconoCamion className="h-7 w-7 text-naranja" /> Seguimiento de pedido
      </h1>
      <p className="mb-6 text-sm text-gris-600">
        Ingresa el número de pedido que recibiste al comprar (ej: PED-20260706-A1B2).
        No necesitas iniciar sesión.
      </p>

      <form onSubmit={buscar} className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label className="etiqueta" htmlFor="nro-pedido">Número de pedido</label>
          <input
            id="nro-pedido"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="PED-…"
            className="campo font-mono uppercase"
            required
          />
        </div>
        <button type="submit" disabled={cargando} className="btn-primario self-end">
          {cargando ? 'Buscando…' : 'Consultar estado'}
        </button>
      </form>

      {/* Resultado */}
      {buscado && !pedido && (
        <div className="tarjeta animar-entrada mt-6 text-center">
          <p className="font-semibold">No encontramos un pedido con ese número.</p>
          <p className="mt-1 text-sm text-gris-600">
            Revisa que esté escrito igual que en tu correo de confirmación, o consúltanos directo:
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`Hola, quiero saber el estado de mi pedido ${numero}`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-verde mt-4"
          >
            <IconoWhatsApp className="h-4 w-4" /> Preguntar por WhatsApp
          </a>
        </div>
      )}

      {pedido && (
        <div className="tarjeta animar-entrada mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold">{pedido.id}</h2>
            <span className="text-xs text-gris-600">{new Date(pedido.fecha).toLocaleDateString('es-CL')}</span>
          </div>

          {cancelado ? (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
              Este pedido fue cancelado. Si tienes dudas, escríbenos por WhatsApp.
            </p>
          ) : (
            /* Línea de tiempo de estados */
            <ol className="mt-5 space-y-0">
              {hitos.map((h, i) => {
                const completado = indiceActual >= i;
                const actual = indiceActual === i;
                return (
                  <li key={h} className="relative flex gap-3 pb-6 last:pb-0">
                    {/* Conector vertical */}
                    {i < hitos.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-[11px] top-6 h-full w-0.5 ${indiceActual > i ? 'bg-verde' : 'bg-borde'}`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        completado ? 'bg-verde text-white' : 'border-2 border-borde bg-white text-gris-600'
                      }`}
                    >
                      {completado ? '✓' : i + 1}
                    </span>
                    <div className="pt-0.5">
                      <p className={`text-sm ${actual ? 'font-bold text-grafito' : completado ? 'font-semibold text-grafito' : 'text-gris-600'}`}>
                        {ETIQUETAS_ESTADO_PEDIDO[h]}
                        {actual && <span className="ml-2 rounded-full bg-verde-badge px-2 py-0.5 text-[10px] font-bold text-verde-oscuro">Estado actual</span>}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Resumen */}
          <div className="mt-5 border-t border-borde pt-4 text-sm">
            <p className="text-gris-600">
              {pedido.items.reduce((acc, i) => acc + i.cantidad, 0)} producto(s) ·{' '}
              {pedido.metodoEnvio === 'retiro_tienda' ? 'Retiro en tienda (Puerto Aysén)' : `Despacho por ${pedido.metodoEnvio}`}
            </p>
            <p className="mt-1 font-bold">Total: <span className="text-naranja-oscuro">{formatoCLP(pedido.total)}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
