// ============================================================
// Mercado Pago: helpers puros del webhook (firma y lectura del id).
// https://www.mercadopago.cl/developers/es/docs/your-integrations/notifications/webhooks
//
// La firma evita que terceros disparen consultas con ids inventados;
// de todas formas el estado del pago SIEMPRE se lee de la API de MP.
// ============================================================
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Antigüedad máxima aceptada de una notificación */
const VENTANA_MS = 15 * 60_000;

/**
 * Verifica la cabecera `x-signature` ("ts=…,v1=…"): HMAC-SHA256 con la
 * clave secreta del webhook sobre `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`.
 */
export function firmaMercadoPagoValida(
  cabecera: string | undefined,
  requestId: string | undefined,
  dataId: string,
  secreto: string,
  ahoraMs: number = Date.now(),
): boolean {
  if (!cabecera || !secreto) return false;
  const partes = new Map<string, string>();
  for (const trozo of cabecera.split(',')) {
    const [clave, valor] = trozo.split('=').map((t) => t?.trim());
    if (clave && valor) partes.set(clave, valor);
  }
  const ts = partes.get('ts');
  const v1 = partes.get('v1');
  if (!ts || !/^\d{1,13}$/.test(ts) || !v1 || !/^[0-9a-f]{64}$/i.test(v1)) return false;

  // ts viene en segundos (o milisegundos en algunas cuentas)
  const tsMs = ts.length > 10 ? Number(ts) : Number(ts) * 1000;
  if (Math.abs(ahoraMs - tsMs) > VENTANA_MS) return false;

  let manifiesto = `id:${dataId.toLowerCase()};`;
  if (requestId) manifiesto += `request-id:${requestId};`;
  manifiesto += `ts:${ts};`;
  const esperado = createHmac('sha256', secreto).update(manifiesto).digest();
  const recibido = Buffer.from(v1, 'hex');
  return recibido.length === esperado.length && timingSafeEqual(recibido, esperado);
}

/**
 * Id del pago desde una notificación (formato actual: data.id en query
 * o body; formato antiguo: ?topic=payment&id=…). null si no es de pago
 * o el id no es numérico.
 */
export function leerIdPagoNotificacion(
  query: Record<string, unknown>,
  cuerpo: unknown,
): string | null {
  const body = (typeof cuerpo === 'object' && cuerpo !== null ? cuerpo : {}) as {
    type?: unknown; data?: { id?: unknown };
  };
  const tipo = query.type ?? query.topic ?? body.type;
  if (tipo !== undefined && tipo !== 'payment') return null;
  const candidato = query['data.id'] ?? body.data?.id ?? query.id;
  const id = typeof candidato === 'number' ? String(candidato) : candidato;
  return typeof id === 'string' && /^\d{1,30}$/.test(id) ? id : null;
}
