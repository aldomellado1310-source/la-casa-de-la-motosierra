// ============================================================
// Página de retorno de pago: confirma la transacción Webpay o
// Flow con la Cloud Function, verifica el pago de Mercado Pago
// contra su API, o muestra el resultado de transferencia.
// El estado del pedido SIEMPRE lo fija el servidor (o el modo
// demo dentro de los servicios); esta página solo muestra.
// Si el pago falla, permite reintentarlo sobre el MISMO pedido.
// ============================================================
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmarPagoFlow, confirmarPagoMercadoPago, confirmarPagoWebpay, irAPagar } from '../services/pagos';
import { obtenerPedidoPorId } from '../services/pedidos';
import { enlaceWhatsApp } from '../config/tienda';
import { useAuth } from '../stores/useAuth';
import { useSeo } from '../utils/seo';
import { IconoAlerta, IconoCheck, IconoDocumento, IconoReloj } from '../components/Iconos';
import type { Pedido } from '../types';

type Estado = 'procesando' | 'exito' | 'pendiente' | 'error';

const AYUDA_CARGO = 'Si el cargo aparece en tu tarjeta, escríbenos por WhatsApp con tu número de pedido.';

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
  // Pedido que se puede volver a pagar (sigue pendiente y es con pasarela)
  const [pedidoReintento, setPedidoReintento] = useState<Pedido | null>(null);
  const [reintentando, setReintentando] = useState(false);
  const [errorReintento, setErrorReintento] = useState('');

  useEffect(() => {
    const tokenWs = params.get('token_ws');
    const mp = params.get('mp') ?? params.get('status'); // retorno de Mercado Pago
    const esFlow = params.get('flow') === '1';
    const tokenFlow = params.get('token');
    const transferencia = params.get('transferencia');
    const pedido = params.get('pedido') ?? params.get('external_reference') ?? '';

    /** Muestra un error y recuerda el pedido para ofrecer reintentar */
    const fallar = (mensaje: string, id = '') => {
      if (id) setPedidoId(id);
      setEstado('error');
      setDetalle(mensaje);
    };

    // --- Transferencia: comprobante subido, queda pendiente de validación ---
    if (transferencia === 'ok') {
      setPedidoId(pedido);
      setEstado('pendiente');
      setDetalle(`Recibimos tu comprobante del pedido ${pedido}. Validaremos el pago a la brevedad; puedes revisar el avance en el seguimiento con tu número de pedido o escribirnos por WhatsApp.`);
      return;
    }

    // --- Flow: el servidor consulta el estado real en la API de Flow ---
    if (esFlow) {
      if (!tokenFlow) {
        fallar('El pago fue cancelado antes de completarse. Puedes intentarlo de nuevo cuando quieras.');
        return;
      }
      void confirmarPagoFlow(tokenFlow)
        .then((r) => {
          setPedidoId(r.pedidoId);
          if (r.aprobado) {
            setEstado('exito');
            setDetalle(`Pago aprobado. Pedido ${r.pedidoId}.`);
          } else {
            fallar('El pago no fue aprobado. No se realizó ningún cargo; puedes intentarlo otra vez.', r.pedidoId);
          }
        })
        .catch(() => fallar(`No pudimos confirmar el pago. ${AYUDA_CARGO}`));
      return;
    }

    // --- Mercado Pago: verificamos el pago contra la API (no confiamos en la URL) ---
    if (mp) {
      const paymentId = params.get('payment_id') ?? params.get('collection_id');
      if (mp === 'demo' || (mp === 'approved' && pedido && paymentId)) {
        void confirmarPagoMercadoPago(pedido, paymentId ?? 'demo')
          .then((aprobado) => {
            setPedidoId(pedido);
            if (aprobado) {
              setEstado('exito');
              setDetalle(`Tu pago con Mercado Pago fue verificado y aprobado. Pedido ${pedido}.`);
            } else {
              fallar(`No pudimos verificar el pago con Mercado Pago. ${AYUDA_CARGO}`, pedido);
            }
          })
          .catch(() => fallar(`No pudimos verificar el pago con Mercado Pago. ${AYUDA_CARGO}`, pedido));
      } else if (mp === 'pending') {
        setPedidoId(pedido);
        setEstado('pendiente');
        setDetalle(`Tu pago está pendiente de acreditación en Mercado Pago. Pedido ${pedido}. Te avisaremos cuando se confirme.`);
      } else {
        fallar('El pago no fue completado en Mercado Pago.', pedido);
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
            fallar('La transacción fue rechazada por Webpay. No se realizó ningún cargo.', r.pedidoId);
          }
        })
        .catch(() => fallar(`No pudimos confirmar el pago con Webpay. ${AYUDA_CARGO}`));
      return;
    }

    // Webpay anulado por el usuario: llega con TBK_TOKEN y TBK_ORDEN_COMPRA (= pedido)
    fallar('El pago fue cancelado antes de completarse. Puedes intentarlo de nuevo cuando quieras.',
      params.get('TBK_ORDEN_COMPRA') ?? '');
  }, [params]);

  // Pago exitoso de invitado: datos para ofrecer crear cuenta
  const [pedidoExito, setPedidoExito] = useState<Pedido | null>(null);
  useEffect(() => {
    if (estado !== 'exito' || usuario || !pedidoId) return;
    let vigente = true;
    obtenerPedidoPorId(pedidoId).then((p) => { if (vigente) setPedidoExito(p); }).catch(() => undefined);
    return () => { vigente = false; };
  }, [estado, usuario, pedidoId]);

  // Si falló, ver si el pedido sigue pendiente para ofrecer reintentar
  useEffect(() => {
    if (estado !== 'error' || !/^PED-\d{8}-[A-Z0-9]{8}$/.test(pedidoId)) return;
    let vigente = true;
    obtenerPedidoPorId(pedidoId)
      .then((p) => {
        if (vigente && p && p.estado === 'pendiente_pago' && p.metodoPago !== 'transferencia') setPedidoReintento(p);
      })
      .catch(() => { /* sin reintento: queda el enlace a WhatsApp */ });
    return () => { vigente = false; };
  }, [estado, pedidoId]);

  const reintentar = async () => {
    if (!pedidoReintento) return;
    setErrorReintento('');
    setReintentando(true);
    try {
      await irAPagar(pedidoReintento.id, pedidoReintento.metodoPago);
    } catch (e) {
      setErrorReintento(e instanceof Error ? e.message : 'No se pudo iniciar el pago. Inténtalo de nuevo.');
      setReintentando(false);
    }
  };

  const contenido = {
    procesando: { Icono: IconoReloj, titulo: 'Confirmando tu pago…', clase: 'text-verde' },
    exito: { Icono: IconoCheck, titulo: '¡Pago exitoso!', clase: 'text-verde' },
    pendiente: { Icono: IconoDocumento, titulo: 'Pedido pendiente de validación', clase: 'text-naranja-oscuro' },
    error: { Icono: IconoAlerta, titulo: 'El pago no se completó', clase: 'text-oferta' },
  }[estado];

  return (
    <div className="contenedor max-w-xl py-16 text-center">
      <div className="tarjeta py-10" aria-live="polite">
        <contenido.Icono className={`mx-auto h-14 w-14 ${contenido.clase}`} />
        <h1 className={`mt-4 text-2xl font-extrabold ${contenido.clase}`}>{contenido.titulo}</h1>
        <p className="mt-2 text-base text-grafito/80">{detalle}</p>
        {errorReintento && <p role="alert" className="mt-3 text-base font-semibold text-oferta">{errorReintento}</p>}
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
          {estado === 'exito' || estado === 'pendiente' ? (
            usuario ? (
              <Link to="/mi-cuenta" className="btn-primario">Ver mis pedidos</Link>
            ) : (
              <Link to={`/seguimiento${pedidoId ? `?pedido=${pedidoId}` : ''}`} className="btn-primario">Seguir mi pedido</Link>
            )
          ) : estado === 'error' ? (
            pedidoReintento ? (
              <button onClick={() => void reintentar()} disabled={reintentando} className="btn-primario">
                {reintentando ? 'Abriendo el pago…' : 'Intentar pagar de nuevo'}
              </button>
            ) : (
              <Link to="/carrito" className="btn-primario">Volver al carrito</Link>
            )
          ) : null}
          {estado === 'error' && (
            <a
              href={enlaceWhatsApp(pedidoId ? `Hola, tuve un problema al pagar mi pedido ${pedidoId}` : 'Hola, tuve un problema al pagar')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              Pedir ayuda por WhatsApp
            </a>
          )}
          <Link to="/tienda" className="btn-secundario">Seguir comprando</Link>
        </div>
        {estado === 'exito' && !usuario && pedidoExito && (
          <p className="mt-6 text-base">
            ¿Quieres ver tus pedidos más fácil la próxima vez?{' '}
            <Link
              to={`/registro?nombre=${encodeURIComponent(pedidoExito.nombreCliente)}&email=${encodeURIComponent(pedidoExito.emailCliente)}`}
              className="enlace"
            >
              Crea tu cuenta con estos datos
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
