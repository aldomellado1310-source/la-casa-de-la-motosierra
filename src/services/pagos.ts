// ============================================================
// Servicio de pagos: orquesta Webpay Plus, Mercado Pago, Flow y
// transferencia bancaria. Los flujos con pasarela llaman a
// las Cloud Functions (functions/src/index.ts).
// ============================================================
import { FUNCTIONS_URL, MODO_DEMO } from '../config/firebase';
import { actualizarEstadoPedido, descontarStockPedido } from './pedidos';
import type { MetodoPago } from '../types';

/** Datos bancarios para pago por transferencia */
export const DATOS_TRANSFERENCIA = {
  banco: 'Banco Santander',
  tipoCuenta: 'Cuenta Corriente',
  numeroCuenta: '2726354-2',
  titular: 'La Casa de la Motosierra Aysén SpA',
  rut: '78.269.561-4',
  email: 'lacasadelamotosierraaysenspa@gmail.com',
};

/** Mensaje de error del servidor (JSON { error }) o uno genérico */
async function mensajeError(res: Response, generico: string): Promise<string> {
  const datos = (await res.json().catch(() => ({}))) as { error?: unknown };
  return typeof datos.error === 'string' && datos.error ? datos.error : generico;
}

interface RespuestaWebpay {
  url: string;   // URL del formulario Webpay
  token: string; // token_ws
}

/**
 * Inicia una transacción Webpay Plus.
 * La Cloud Function crea la transacción con el SDK de Transbank
 * y devuelve la URL + token para redirigir al formulario de pago.
 * El monto lo lee la función desde el pedido en Firestore (el valor
 * del navegador no es confiable) y la URL de retorno la arma el servidor
 * desde su lista blanca de orígenes.
 */
export async function iniciarPagoWebpay(pedidoId: string): Promise<RespuestaWebpay> {
  if (MODO_DEMO) {
    // En demo simulamos la redirección al retorno exitoso
    return { url: `${window.location.origin}/pago/retorno`, token: `demo-${pedidoId}` };
  }
  if (!FUNCTIONS_URL) throw new Error('El pago en línea no está disponible por ahora. Elige transferencia bancaria.');
  const res = await fetch(`${FUNCTIONS_URL}/webpayCrear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pedidoId }),
  });
  if (!res.ok) throw new Error(await mensajeError(res, 'No se pudo iniciar el pago con Webpay. Inténtalo de nuevo.'));
  return res.json() as Promise<RespuestaWebpay>;
}

/** Redirige al formulario de Webpay (POST con token_ws) */
export function redirigirAWebpay(respuesta: RespuestaWebpay): void {
  if (MODO_DEMO && respuesta.token.startsWith('demo-')) {
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
  if (MODO_DEMO && tokenWs.startsWith('demo-')) {
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
 * (init_point) para redirigir al usuario. El monto, la descripción y
 * las URLs de retorno los arma la función desde el pedido en Firestore.
 */
export async function iniciarPagoMercadoPago(pedidoId: string): Promise<string> {
  if (MODO_DEMO) {
    return `${window.location.origin}/pago/retorno?mp=demo&pedido=${pedidoId}`;
  }
  if (!FUNCTIONS_URL) throw new Error('El pago en línea no está disponible por ahora. Elige transferencia bancaria.');
  const res = await fetch(`${FUNCTIONS_URL}/mercadoPagoCrear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pedidoId }),
  });
  if (!res.ok) throw new Error(await mensajeError(res, 'No se pudo iniciar el pago con Mercado Pago. Inténtalo de nuevo.'));
  const datos = (await res.json()) as { initPoint: string };
  return datos.initPoint;
}

/**
 * Verifica un pago de Mercado Pago contra la API oficial (server-side).
 * El status que llega en la URL de retorno NO se usa como fuente de
 * verdad: cualquiera podría forjarla con status=approved.
 */
export async function confirmarPagoMercadoPago(pedidoId: string, paymentId: string): Promise<boolean> {
  if (MODO_DEMO) {
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
 * Crea una orden de pago en Flow (tarjetas de débito, crédito y
 * prepago). El monto y las URLs de retorno/confirmación los arma la
 * función desde el pedido en Firestore.
 */
export async function iniciarPagoFlow(pedidoId: string): Promise<RespuestaFlow> {
  if (MODO_DEMO) {
    return { url: `${window.location.origin}/pago/retorno`, token: `demo-${pedidoId}` };
  }
  if (!FUNCTIONS_URL) throw new Error('El pago en línea no está disponible por ahora. Elige transferencia bancaria.');
  const res = await fetch(`${FUNCTIONS_URL}/flowCrear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pedidoId }),
  });
  if (!res.ok) throw new Error(await mensajeError(res, 'No se pudo iniciar el pago con Flow. Inténtalo de nuevo.'));
  return res.json() as Promise<RespuestaFlow>;
}

/** Redirige al formulario de pago de Flow (?token=) */
export function redirigirAFlow(respuesta: RespuestaFlow): void {
  if (MODO_DEMO && respuesta.token.startsWith('demo-')) {
    window.location.href = `${respuesta.url}?flow=1&token=${respuesta.token}`;
    return;
  }
  window.location.href = `${respuesta.url}?token=${encodeURIComponent(respuesta.token)}`;
}

/**
 * Confirma un pago de Flow al volver del formulario: el servidor
 * consulta la API de Flow (getStatus). El retorno del navegador no es
 * fuente de verdad. Flow además avisa por webhook al servidor.
 */
export async function confirmarPagoFlow(token: string): Promise<ResultadoCommitWebpay> {
  if (MODO_DEMO && token.startsWith('demo-')) {
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
 * Lleva al cliente a pagar un pedido YA creado con su pasarela (primer
 * intento o reintento tras un rechazo), sin crear un pedido nuevo.
 */
export async function irAPagar(pedidoId: string, metodo: MetodoPago): Promise<void> {
  if (metodo === 'webpay') {
    redirigirAWebpay(await iniciarPagoWebpay(pedidoId));
    return;
  }
  if (metodo === 'mercadopago') {
    window.location.href = await iniciarPagoMercadoPago(pedidoId);
    return;
  }
  if (metodo === 'flow') {
    redirigirAFlow(await iniciarPagoFlow(pedidoId));
    return;
  }
  throw new Error('Este pedido se paga por transferencia bancaria.');
}
