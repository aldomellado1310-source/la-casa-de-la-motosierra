// ============================================================
// Página de retorno de pago: confirma (commit) la transacción
// Webpay con la Cloud Function, o muestra el resultado de
// Mercado Pago / transferencia.
// ============================================================
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmarPagoWebpay } from '../services/pagos';
import { actualizarEstadoPedido } from '../services/pedidos';

type Estado = 'procesando' | 'exito' | 'pendiente' | 'error';

export default function PagoRetorno() {
  const [params] = useSearchParams();
  const [estado, setEstado] = useState<Estado>('procesando');
  const [detalle, setDetalle] = useState('');

  useEffect(() => {
    const tokenWs = params.get('token_ws');
    const mp = params.get('mp') ?? params.get('status'); // retorno de Mercado Pago
    const transferencia = params.get('transferencia');
    const pedido = params.get('pedido') ?? '';

    // --- Transferencia: comprobante subido, queda pendiente de validación ---
    if (transferencia === 'ok') {
      setEstado('pendiente');
      setDetalle(`Recibimos tu comprobante del pedido ${pedido}. Validaremos el pago y te avisaremos por correo.`);
      return;
    }

    // --- Mercado Pago: leemos el estado del back_url ---
    if (mp) {
      const aprobado = mp === 'demo' || mp === 'approved';
      if (aprobado && pedido) void actualizarEstadoPedido(pedido, 'pagado', 'mercadopago');
      setEstado(aprobado ? 'exito' : 'error');
      setDetalle(aprobado ? `Tu pago con Mercado Pago fue aprobado. Pedido ${pedido}.` : 'El pago no fue completado en Mercado Pago.');
      return;
    }

    // --- Webpay: confirmar la transacción con token_ws ---
    if (tokenWs) {
      void confirmarPagoWebpay(tokenWs)
        .then(async (r) => {
          if (r.aprobado) {
            await actualizarEstadoPedido(r.pedidoId, 'pagado', r.codigoAutorizacion);
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
    procesando: { icono: '⏳', titulo: 'Confirmando tu pago…', clase: 'text-verde' },
    exito: { icono: '✅', titulo: '¡Pago exitoso!', clase: 'text-verde' },
    pendiente: { icono: '📄', titulo: 'Pedido pendiente de validación', clase: 'text-naranja-oscuro' },
    error: { icono: '⚠️', titulo: 'El pago no se completó', clase: 'text-red-700' },
  }[estado];

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="tarjeta py-10">
        <span className="text-5xl">{contenido.icono}</span>
        <h1 className={`mt-4 text-2xl font-extrabold ${contenido.clase}`}>{contenido.titulo}</h1>
        <p className="mt-2 text-sm text-grafito/80">{detalle}</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {estado === 'exito' || estado === 'pendiente' ? (
            <Link to="/mi-cuenta" className="btn-primario">Ver mis pedidos</Link>
          ) : estado === 'error' ? (
            <Link to="/carrito" className="btn-primario">Reintentar pago</Link>
          ) : null}
          <Link to="/tienda" className="btn-secundario">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
