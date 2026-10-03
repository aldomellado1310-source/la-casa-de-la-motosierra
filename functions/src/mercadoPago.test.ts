// Tests de la verificación de firma de webhooks de Mercado Pago.
// Ejecutar desde la raíz:  npx tsx --test functions/src/*.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { firmaMercadoPagoValida, leerIdPagoNotificacion } from './mercadoPago';

const SECRETO = 'clave-webhook';
const TS = '1704908010';
const AHORA_MS = Number(TS) * 1000 + 60_000; // un minuto después

/** Firma calculada aparte, según la documentación de MP */
function firmar(id: string, requestId: string, ts = TS, secreto = SECRETO): string {
  const manifiesto = `id:${id};request-id:${requestId};ts:${ts};`;
  return `ts=${ts},v1=${createHmac('sha256', secreto).update(manifiesto).digest('hex')}`;
}

test('acepta una firma correcta', () => {
  assert.equal(firmaMercadoPagoValida(firmar('123456', 'req-1'), 'req-1', '123456', SECRETO, AHORA_MS), true);
});

test('el orden de ts y v1 en la cabecera no importa', () => {
  const [ts, v1] = firmar('123456', 'req-1').split(',');
  assert.equal(firmaMercadoPagoValida(`${v1}, ${ts}`, 'req-1', '123456', SECRETO, AHORA_MS), true);
});

test('rechaza firma de otro id, otra request o con otro secreto', () => {
  assert.equal(firmaMercadoPagoValida(firmar('999', 'req-1'), 'req-1', '123456', SECRETO, AHORA_MS), false);
  assert.equal(firmaMercadoPagoValida(firmar('123456', 'req-2'), 'req-1', '123456', SECRETO, AHORA_MS), false);
  assert.equal(firmaMercadoPagoValida(firmar('123456', 'req-1', TS, 'otro'), 'req-1', '123456', SECRETO, AHORA_MS), false);
});

test('rechaza cabeceras mal formadas o vacías', () => {
  for (const cabecera of [undefined, '', 'ts=1', 'v1=abc', 'basura', 'ts=abc,v1=zz']) {
    assert.equal(firmaMercadoPagoValida(cabecera, 'req-1', '123456', SECRETO, AHORA_MS), false, String(cabecera));
  }
});

test('rechaza notificaciones de más de 15 minutos (reenvío)', () => {
  const tarde = Number(TS) * 1000 + 16 * 60_000;
  assert.equal(firmaMercadoPagoValida(firmar('123456', 'req-1'), 'req-1', '123456', SECRETO, tarde), false);
});

test('leerIdPagoNotificacion: query data.id, body data.id o id del formato antiguo', () => {
  assert.equal(leerIdPagoNotificacion({ 'data.id': '123', type: 'payment' }, {}), '123');
  assert.equal(leerIdPagoNotificacion({}, { type: 'payment', data: { id: 456 } }), '456');
  assert.equal(leerIdPagoNotificacion({ topic: 'payment', id: '789' }, {}), '789');
  // Otros tópicos (merchant_order, etc.) o ids no numéricos se ignoran
  assert.equal(leerIdPagoNotificacion({ topic: 'merchant_order', id: '789' }, {}), null);
  assert.equal(leerIdPagoNotificacion({ 'data.id': '12a; drop' }, {}), null);
});
