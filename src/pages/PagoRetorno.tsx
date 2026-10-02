// ============================================================
// Página de retorno de pago: confirma (commit) la transacción
// Webpay con la Cloud Function, verifica el pago de Mercado
// Pago contra su API, o muestra el resultado de transferencia.
// El estado del pedido SIEMPRE lo fija el servidor (o el modo
// demo dentro de los servicios); esta página solo muestra.
// ============================================================
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmarPagoMercadoPago, confirmarPagoWebpay } from '../services/pagos';
import { useAuth } from '../stores/useAuth';
import { useSeo } from '../utils/seo';
import { IconoAlerta, IconoCheck, IconoDocumento, IconoReloj } from '../components/Iconos';

type Estado = 'procesando' | 'exito' | 'pendiente' | 'error';

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

  useEffect(() => {
    const tokenWs = params.get('token_ws');
    const mp = params.get('mp') ?? params.get('status'); // retorno de Mercado Pago
    const transferencia = params.get('transferencia');
    const pedido = params.get('pedido') ?? params.get('external_reference') ?? '';

    // --- Transferencia: comprobante subido, queda pendiente de validación ---
    if (transferencia === 'ok') {
      setPedidoId(pedido);
      setEstado('pendiente');
      setDetalle(`Recibimos tu comprobante del pedido ${pedido}. Validaremos el pago a la brevedad; puedes revisar el avance en el seguimiento con tu número de pedido o escribirnos por WhatsApp.`);
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
              : 'No pudimos verificar el pago con Mercado Pago. Si el cargo aparece en tu tarjeta, contáctanos por WhatsApp.');
          })
          .catch(() => {
            setEstado('error');
            setDetalle('No pudimos verificar el pago con Mercado Pago. Si el cargo aparece en tu tarjeta, contáctanos por WhatsApp.');
          });
      } else if (mp === 'pending') {
        setPedidoId(pedido);
        setEstado('pendiente');
        setDetalle(`Tu pago está pendiente de acreditación en Mercado Pago. Pedido ${pedido}. Puedes revisar el avance en el seguimiento.`);
      } else {
        setEstado('error');
        setDetalle('El pago no fue completado en Mercado Pago.');
      }
      return;
    }

    // --- Webpay: confirmar la transacción con token_ws (el servidor actualiza el pedido) ---
    if (tokenWs) {
      void confirmarPagoWebpay(tokenWs)
        .then((r) => {
          if (r.aprobado) {
            setPedidoId(r.pedidoId);
            setEstado('exito');
            setDetalle(`Pago aprobado con Webpay. Pedido ${r.pedidoId} · Autorización ${r.codigoAutorizacion ?? '—'}.`);
          } else {
            setEstado('error');
            setDetalle('La transacción fue rechazada por Webpay. No se realizó ningún cargo.');
          }
        })
        .catch(() => {
          setEstado('error');
          setDetalle('No pudimos confirmar el pago con Webpay. Si el cargo aparece en tu tarjeta, contáctanos por WhatsApp.');
        });
      return;
    }

    // Webpay anulado por el usuario llega con TBK_TOKEN y sin token_ws
    setEstado('error');
    setDetalle('El pago fue cancelado antes de completarse. Puedes intentarlo de nuevo cuando quieras.');
  }, [params]);

  const contenido = {
    procesando: { Icono: IconoReloj, titulo: 'Confirmando tu pago…', clase: 'text-verde' },
    exito: { Icono: IconoCheck, titulo: '¡Pago exitoso!', clase: 'text-verde' },
    pendiente: { Icono: IconoDocumento, titulo: 'Pedido pendiente de validación', clase: 'text-naranja-oscuro' },
    error: { Icono: IconoAlerta, titulo: 'El pago no se completó', clase: 'text-red-700' },
  }[estado];

  return (
    <div className="contenedor max-w-xl py-16 text-center">
      <div className="tarjeta py-10">
        <contenido.Icono className={`mx-auto h-14 w-14 ${contenido.clase}`} />
        <h1 className={`mt-4 text-2xl font-extrabold ${contenido.clase}`}>{contenido.titulo}</h1>
        <p className="mt-2 text-base text-grafito/80">{detalle}</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {estado === 'exito' || estado === 'pendiente' ? (
            usuario ? (
              <Link to="/mi-cuenta" className="btn-primario">Ver mis pedidos</Link>
            ) : (
              <Link to={`/seguimiento${pedidoId ? `?pedido=${pedidoId}` : ''}`} className="btn-primario">Seguir mi pedido</Link>
            )
          ) : estado === 'error' ? (
            <Link to="/carrito" className="btn-primario">Reintentar pago</Link>
          ) : null}
          <Link to="/tienda" className="btn-secundario">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
