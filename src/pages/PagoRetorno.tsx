// ============================================================
// Página de retorno de pago: confirma (commit) la transacción
// Webpay con la Cloud Function, verifica el pago de Mercado
// Pago o Flow contra su API, o muestra el resultado de
// transferencia. El estado del pedido SIEMPRE lo fija el
// servidor (o el modo demo dentro de los servicios); esta
// página solo muestra.
// ============================================================
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmarPagoFlow, confirmarPagoMercadoPago, confirmarPagoWebpay, reintentarPago } from '../services/pagos';
import { obtenerPedidoPorId } from '../services/pedidos';
import { useAuth } from '../stores/useAuth';
import { WHATSAPP_NUMERO } from '../config/firebase';
import { useSeo } from '../utils/seo';
import { IconoAlerta, IconoCheck, IconoDocumento, IconoReloj } from '../components/Iconos';
import type { Pedido } from '../types';

type Estado = 'procesando' | 'exito' | 'pendiente' | 'error';

/** Link de WhatsApp con mensaje prellenado, referenciando el pedido si se conoce */
function enlaceWhatsApp(pedidoId: string): string {
  const mensaje = pedidoId ? `Hola, tengo una duda sobre mi pedido ${pedidoId}` : 'Hola, tengo una duda sobre un pago';
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

export default function PagoRetorno() {
  useSeo({
    titulo: 'Resultado del pago',
    descripcion: 'Confirmación del estado de tu pago y del pedido asociado.',
  });
  const [params] = useSearchParams();
  const { usuario } = useAuth();
  const [estado, setEstado] = useState<Estado>('procesando');
  const [detalle, setDetalle] = useState('');
  const [pedidoId, setPedidoId] = useState('');
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [reintentando, setReintentando] = useState(false);
  const [errorReintento, setErrorReintento] = useState('');

  useEffect(() => {
    const tokenWs = params.get('token_ws');
    const tokenFlow = params.get('token'); // retorno de Flow
    const mp = params.get('mp') ?? params.get('status'); // retorno de Mercado Pago
    const transferencia = params.get('transferencia');
    const pedido = params.get('pedido') ?? params.get('external_reference') ?? '';

    // --- Transferencia: comprobante subido, queda pendiente de validación ---
    if (transferencia === 'ok') {
      setPedidoId(pedido);
      setEstado('pendiente');
      setDetalle(`Recibimos tu comprobante del pedido ${pedido}. Validaremos el pago a la brevedad; puedes revisar el avance en el seguimiento con tu número de pedido.`);
      return;
    }

    // --- Mercado Pago: verificamos el pago contra la API (no confiamos en la URL) ---
    if (mp) {
      const paymentId = params.get('payment_id') ?? params.get('collection_id');
      if (mp === 'demo' || (mp === 'approved' && pedido && paymentId)) {
        void confirmarPagoMercadoPago(pedido, paymentId ?? 'demo')
          .then((aprobado) => {
            setPedidoId(pedido);
            setEstado(aprobado ? 'exito' : 'error');
            setDetalle(aprobado
              ? `Tu pago con Mercado Pago fue verificado y aprobado. Pedido ${pedido}.`
              : 'No pudimos verificar el pago con Mercado Pago. Si el cargo aparece en tu tarjeta, contáctanos.');
          })
          .catch(() => {
            setPedidoId(pedido);
            setEstado('error');
            setDetalle('No pudimos verificar el pago con Mercado Pago. Si el cargo aparece en tu tarjeta, contáctanos.');
          });
      } else if (mp === 'pending') {
        setPedidoId(pedido);
        setEstado('pendiente');
        setDetalle(`Tu pago está pendiente de acreditación en Mercado Pago. Pedido ${pedido}. Puedes revisar el avance en el seguimiento.`);
      } else {
        setPedidoId(pedido);
        setEstado('error');
        setDetalle('El pago no fue completado en Mercado Pago.');
      }
      return;
    }

    // --- Webpay: confirmar la transacción con token_ws (el servidor actualiza el pedido) ---
    if (tokenWs) {
      void confirmarPagoWebpay(tokenWs)
        .then((r) => {
          setPedidoId(r.pedidoId);
          if (r.aprobado) {
            setEstado('exito');
            setDetalle(`Pago aprobado con Webpay. Pedido ${r.pedidoId} · Autorización ${r.codigoAutorizacion ?? '—'}.`);
          } else {
            setEstado('error');
            setDetalle('La transacción fue rechazada por Webpay. No se realizó ningún cargo.');
          }
        })
        .catch(() => {
          setEstado('error');
          setDetalle('No pudimos confirmar el pago con Webpay. Si el cargo aparece en tu tarjeta, contáctanos.');
        });
      return;
    }

    // --- Flow: confirmar el pago con getStatus (el servidor actualiza el pedido) ---
    if (tokenFlow) {
      void confirmarPagoFlow(tokenFlow)
        .then((r) => {
          setPedidoId(r.pedidoId);
          if (r.aprobado) {
            setEstado('exito');
            setDetalle(`Pago aprobado con Flow. Pedido ${r.pedidoId}.`);
          } else {
            setEstado('error');
            setDetalle('El pago no fue aprobado por Flow. No se realizó ningún cargo.');
          }
        })
        .catch(() => {
          setEstado('error');
          setDetalle('No pudimos confirmar el pago con Flow. Si el cargo aparece en tu tarjeta, contáctanos.');
        });
      return;
    }

    // Webpay anulado por el usuario llega con TBK_TOKEN y sin token_ws
    setEstado('error');
    setDetalle('El pago fue cancelado antes de completarse. Puedes intentarlo de nuevo cuando quieras.');
  }, [params]);

  // Trae los datos del pedido (para reintentar el pago y para prellenar
  // "crear cuenta con estos datos") una vez que se conoce su id.
  useEffect(() => {
    if (!pedidoId) { setPedido(null); return; }
    void obtenerPedidoPorId(pedidoId).then(setPedido).catch(() => setPedido(null));
  }, [pedidoId]);

  /** Reintenta el pago del MISMO pedido (no crea uno nuevo) */
  const manejarReintento = async () => {
    if (!pedido) return;
    setReintentando(true);
    setErrorReintento('');
    try {
      await reintentarPago(pedido);
    } catch (e) {
      setErrorReintento(e instanceof Error ? e.message : 'No se pudo reintentar el pago.');
      setReintentando(false);
    }
  };

  const contenido = {
    procesando: { Icono: IconoReloj, titulo: 'Confirmando tu pago…', clase: 'text-verde' },
    exito: { Icono: IconoCheck, titulo: '¡Pago exitoso!', clase: 'text-verde' },
    pendiente: { Icono: IconoDocumento, titulo: 'Pedido pendiente de validación', clase: 'text-naranja-oscuro' },
    error: { Icono: IconoAlerta, titulo: 'El pago no se completó', clase: 'text-red-700' },
  }[estado];

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="tarjeta py-10">
        <contenido.Icono className={`mx-auto h-14 w-14 ${contenido.clase}`} />
        <h1 className={`mt-4 text-2xl font-extrabold ${contenido.clase}`}>{contenido.titulo}</h1>
        <p className="mt-2 text-sm text-grafito/80">{detalle}</p>
        {(estado === 'pendiente' || estado === 'error') && (
          <a
            href={enlaceWhatsApp(pedidoId)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-verde hover:underline"
          >
            Escríbenos por WhatsApp →
          </a>
        )}
        {errorReintento && <p className="mt-2 text-sm text-red-600">{errorReintento}</p>}
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {estado === 'exito' || estado === 'pendiente' ? (
            usuario ? (
              <Link to="/mi-cuenta" className="btn-primario">Ver mis pedidos</Link>
            ) : (
              <Link to={`/seguimiento${pedidoId ? `?pedido=${pedidoId}` : ''}`} className="btn-primario">Seguir mi pedido</Link>
            )
          ) : estado === 'error' ? (
            pedido && pedido.metodoPago !== 'transferencia' ? (
              <button onClick={() => void manejarReintento()} disabled={reintentando} className="btn-primario">
                {reintentando ? 'Reintentando…' : 'Reintentar pago'}
              </button>
            ) : (
              <Link to="/carrito" className="btn-primario">Reintentar pago</Link>
            )
          ) : null}
          {!usuario && pedido && (estado === 'exito' || estado === 'pendiente') && (
            <Link
              to={`/registro?nombre=${encodeURIComponent(pedido.nombreCliente)}&email=${encodeURIComponent(pedido.emailCliente)}`}
              className="btn-secundario"
            >
              Crear cuenta con estos datos
            </Link>
          )}
          <Link to="/tienda" className="btn-secundario">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
