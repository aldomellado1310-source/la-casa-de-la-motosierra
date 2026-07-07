// ============================================================
// Servicio de pagos: orquesta Webpay Plus, Mercado Pago y
// transferencia bancaria. Los flujos con pasarela llaman a
// las Cloud Functions (functions/src/index.ts).
// ============================================================
import { FUNCTIONS_URL, MODO_DEMO } from '../config/firebase';

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
 */
export async function iniciarPagoWebpay(pedidoId: string, monto: number): Promise<RespuestaWebpay> {
  if (MODO_DEMO || !FUNCTIONS_URL) {
    // En demo simulamos la redirección al retorno exitoso
    return { url: `${window.location.origin}/pago/retorno`, token: `demo-${pedidoId}` };
  }
  const res = await fetch(`${FUNCTIONS_URL}/webpayCrear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pedidoId,
      monto,
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

/** Confirma (commit) la transacción Webpay al volver del formulario */
export async function confirmarPagoWebpay(tokenWs: string): Promise<ResultadoCommitWebpay> {
  if (tokenWs.startsWith('demo-')) {
    return { aprobado: true, pedidoId: tokenWs.replace('demo-', ''), codigoAutorizacion: 'DEMO-OK' };
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
 * (init_point) para redirigir al usuario.
 */
export async function iniciarPagoMercadoPago(pedidoId: string, monto: number, descripcion: string): Promise<string> {
  if (MODO_DEMO || !FUNCTIONS_URL) {
    return `${window.location.origin}/pago/retorno?mp=demo&pedido=${pedidoId}`;
  }
  const res = await fetch(`${FUNCTIONS_URL}/mercadoPagoCrear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pedidoId,
      monto,
      descripcion,
      backUrl: `${window.location.origin}/pago/retorno`,
    }),
  });
  if (!res.ok) throw new Error('No se pudo iniciar el pago con Mercado Pago');
  const datos = (await res.json()) as { initPoint: string };
  return datos.initPoint;
}
