// ============================================================
// Servicio de pagos: orquesta Webpay Plus, Mercado Pago y
// transferencia bancaria. Los flujos con pasarela llaman a
// las Cloud Functions (functions/src/index.ts).
// ============================================================
import { FUNCTIONS_URL, MODO_DEMO } from '../config/firebase';
import { actualizarEstadoPedido, descontarStockPedido } from './pedidos';

/** Datos bancarios para pago por transferencia */
export const DATOS_TRANSFERENCIA = {
  banco: 'BancoEstado',
  tipoCuenta: 'Cuenta Corriente',
  numeroCuenta: '12345678901',
  titular: 'La Casa de la Motosierra SpA',
  rut: '77.123.456-7',
  email: 'pagos@lacasadelamotosierra.cl',
};

interface RespuestaWebpay {
  url: string;   // URL del formulario Webpay
  token: string; // token_ws
}

/**
 * Inicia una transacción Webpay Plus.
 * La Cloud Function crea la transacción con el SDK de Transbank
 * y devuelve la URL + token para redirigir al formulario de pago.
 * El monto lo lee la función desde el pedido en Firestore (el valor
 * del navegador no es confiable).
 */
export async function iniciarPagoWebpay(pedidoId: string): Promise<RespuestaWebpay> {
  if (MODO_DEMO || !FUNCTIONS_URL) {
    // En demo simulamos la redirección al retorno exitoso
    return { url: `${window.location.origin}/pago/retorno`, token: `demo-${pedidoId}` };
  }
  const res = await fetch(`${FUNCTIONS_URL}/webpayCrear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pedidoId,
      returnUrl: `${window.location.origin}/pago/retorno`,
    }),
  });
  if (!res.ok) throw new Error('No se pudo iniciar el pago con Webpay');
  return res.json() as Promise<RespuestaWebpay>;
}

/** Redirige al formulario de Webpay (POST con token_ws) */
export function redirigirAWebpay(respuesta: RespuestaWebpay): void {
  if (respuesta.token.startsWith('demo-')) {
    // Modo demo: vamos directo a la página de retorno
    window.location.href = `${respuesta.url}?token_ws=${respuesta.token}`;
    return;
  }
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = respuesta.url;
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'token_ws';
  input.value = respuesta.token;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

export interface ResultadoCommitWebpay {
  aprobado: boolean;
  pedidoId: string;
  codigoAutorizacion?: string;
  monto?: number;
}

/**
 * Confirma (commit) la transacción Webpay al volver del formulario.
 * En modo Firebase la Cloud Function actualiza el pedido y descuenta
 * el stock; en demo lo hacemos aquí sobre los datos en memoria.
 */
export async function confirmarPagoWebpay(tokenWs: string): Promise<ResultadoCommitWebpay> {
  if (tokenWs.startsWith('demo-')) {
    const pedidoId = tokenWs.replace('demo-', '');
    await actualizarEstadoPedido(pedidoId, 'pagado', 'DEMO-OK');
    await descontarStockPedido(pedidoId);
    return { aprobado: true, pedidoId, codigoAutorizacion: 'DEMO-OK' };
  }
  const res = await fetch(`${FUNCTIONS_URL}/webpayConfirmar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: tokenWs }),
  });
  if (!res.ok) throw new Error('No se pudo confirmar el pago');
  return res.json() as Promise<ResultadoCommitWebpay>;
}

/**
 * Crea una preferencia de Mercado Pago y devuelve la URL de checkout
 * (init_point) para redirigir al usuario. El monto lo lee la función
 * desde el pedido en Firestore.
 */
export async function iniciarPagoMercadoPago(pedidoId: string, descripcion: string): Promise<string> {
  if (MODO_DEMO || !FUNCTIONS_URL) {
    return `${window.location.origin}/pago/retorno?mp=demo&pedido=${pedidoId}`;
  }
  const res = await fetch(`${FUNCTIONS_URL}/mercadoPagoCrear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pedidoId,
      descripcion,
      backUrl: `${window.location.origin}/pago/retorno`,
    }),
  });
  if (!res.ok) throw new Error('No se pudo iniciar el pago con Mercado Pago');
  const datos = (await res.json()) as { initPoint: string };
  return datos.initPoint;
}

/**
 * Verifica un pago de Mercado Pago contra la API oficial (server-side).
 * El status que llega en la URL de retorno NO se usa como fuente de
 * verdad: cualquiera podría forjarla con status=approved.
 */
export async function confirmarPagoMercadoPago(pedidoId: string, paymentId: string): Promise<boolean> {
  if (MODO_DEMO || !FUNCTIONS_URL) {
    await actualizarEstadoPedido(pedidoId, 'pagado', 'MP-DEMO');
    await descontarStockPedido(pedidoId);
    return true;
  }
  const res = await fetch(`${FUNCTIONS_URL}/mercadoPagoConfirmar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pedidoId, paymentId }),
  });
  if (!res.ok) throw new Error('No se pudo verificar el pago con Mercado Pago');
  const datos = (await res.json()) as { aprobado: boolean };
  return datos.aprobado;
}
