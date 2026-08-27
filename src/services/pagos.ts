// ============================================================
// Servicio de pagos: orquesta Webpay Plus, Mercado Pago, Flow y
// transferencia bancaria. Los flujos con pasarela llaman a
// las Cloud Functions (functions/src/index.ts).
// ============================================================
import { FUNCTIONS_URL, MODO_DEMO } from '../config/firebase';
import { actualizarEstadoPedido, descontarStockPedido } from './pedidos';
import type { Pedido } from '../types';

/** Datos bancarios para pago por transferencia */
export const DATOS_TRANSFERENCIA = {
  banco: 'BancoEstado',
  tipoCuenta: 'Cuenta Corriente',
  numeroCuenta: '12345678901',
  titular: 'La Casa de la Motosierra SpA',
  rut: '77.123.456-7',
  email: 'pagos@lacasadelamotosierra.cl',
};

/**
 * Cuotas máximas configuradas en la cuenta de Mercado Pago del comercio.
 * Es solo informativo para el checkout: el número real de cuotas que ve
 * cada cliente depende de su tarjeta/banco y lo decide Mercado Pago en
 * su propio Checkout Pro. Ajustar si cambia la configuración en el panel
 * de Mercado Pago (Tu negocio > Configuración > Cuotas).
 */
export const MP_CUOTAS_MAXIMAS = 12;

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

interface RespuestaFlow {
  url: string;   // URL del formulario de pago de Flow
  token: string; // token de la orden de pago
}

/**
 * Crea una orden de pago en Flow y devuelve la URL + token para
 * redirigir al formulario de pago (tarjetas, transferencia en línea,
 * etc.). El monto lo lee la función desde el pedido en Firestore.
 */
export async function iniciarPagoFlow(pedidoId: string, email: string): Promise<RespuestaFlow> {
  if (MODO_DEMO || !FUNCTIONS_URL) {
    return { url: `${window.location.origin}/pago/retorno`, token: `demo-${pedidoId}` };
  }
  const res = await fetch(`${FUNCTIONS_URL}/flowCrear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pedidoId,
      email,
      returnUrl: `${window.location.origin}/pago/retorno`,
    }),
  });
  if (!res.ok) throw new Error('No se pudo iniciar el pago con Flow');
  return res.json() as Promise<RespuestaFlow>;
}

/** Redirige al formulario de pago de Flow (?token=) */
export function redirigirAFlow(respuesta: RespuestaFlow): void {
  window.location.href = `${respuesta.url}?token=${respuesta.token}`;
}

/**
 * Confirma un pago de Flow consultando su API (getStatus) desde el
 * servidor. Igual que con Mercado Pago, el retorno del navegador NO
 * es confiable como fuente de verdad.
 */
export async function confirmarPagoFlow(token: string): Promise<ResultadoCommitWebpay> {
  if (token.startsWith('demo-')) {
    const pedidoId = token.replace('demo-', '');
    await actualizarEstadoPedido(pedidoId, 'pagado', 'FLOW-DEMO');
    await descontarStockPedido(pedidoId);
    return { aprobado: true, pedidoId, codigoAutorizacion: 'FLOW-DEMO' };
  }
  const res = await fetch(`${FUNCTIONS_URL}/flowConfirmar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error('No se pudo confirmar el pago con Flow');
  return res.json() as Promise<ResultadoCommitWebpay>;
}

/**
 * Reintenta el pago de un pedido ya creado (tras un rechazo), sin crear
 * un pedido nuevo — evita dejar pedidos huérfanos duplicados en estado
 * "pendiente_pago". Redirige a la misma pasarela que se eligió al crear
 * el pedido.
 */
export async function reintentarPago(pedido: Pedido): Promise<void> {
  if (pedido.metodoPago === 'webpay') {
    const resp = await iniciarPagoWebpay(pedido.id);
    redirigirAWebpay(resp);
    return;
  }
  if (pedido.metodoPago === 'mercadopago') {
    const url = await iniciarPagoMercadoPago(pedido.id, `Pedido ${pedido.id} — La Casa de la Motosierra`);
    window.location.href = url;
    return;
  }
  if (pedido.metodoPago === 'flow') {
    const resp = await iniciarPagoFlow(pedido.id, pedido.emailCliente);
    redirigirAFlow(resp);
    return;
  }
  throw new Error('Este método de pago no admite reintento automático.');
}
