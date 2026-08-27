// ============================================================
// Tests de functions/src/flow.ts con el test runner nativo de
// Node (node:test) — sin dependencias nuevas. Corren sobre el
// build de lib/ vía `npm test`.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluarAprobacionFlow, firmarFlow, llamarFlow } from './flow';

test('firmarFlow: la firma no depende del orden en que llegan las claves', () => {
  const a = firmarFlow({ commerceOrder: 'PED-1', amount: '1000' }, 'secreto');
  const b = firmarFlow({ amount: '1000', commerceOrder: 'PED-1' }, 'secreto');
  assert.equal(a, b);
});

test('firmarFlow: coincide con un vector calculado de forma independiente', () => {
  // HMAC-SHA256('amount1000commerceOrderPED-1', 'secreto'), calculado
  // aparte con node:crypto para no depender de la propia implementación.
  const firma = firmarFlow({ commerceOrder: 'PED-1', amount: '1000' }, 'secreto');
  assert.equal(firma, 'c74a77acfe129fa8c903caca8adcfbc61841f82b6f2c7b3f3ae9871c7e301054');
});

test('firmarFlow: cambiar cualquier valor cambia la firma', () => {
  const original = firmarFlow({ commerceOrder: 'PED-1', amount: '1000' }, 'secreto');
  const montoDistinto = firmarFlow({ commerceOrder: 'PED-1', amount: '2000' }, 'secreto');
  const secretoDistinto = firmarFlow({ commerceOrder: 'PED-1', amount: '1000' }, 'otro');
  assert.notEqual(original, montoDistinto);
  assert.notEqual(original, secretoDistinto);
});

test('evaluarAprobacionFlow: aprueba solo con status pagada (2) y monto exacto', () => {
  assert.equal(evaluarAprobacionFlow(2, 10000, 10000), true);
  assert.equal(evaluarAprobacionFlow(1, 10000, 10000), false); // pendiente
  assert.equal(evaluarAprobacionFlow(3, 10000, 10000), false); // rechazada
  assert.equal(evaluarAprobacionFlow(4, 10000, 10000), false); // anulada
  assert.equal(evaluarAprobacionFlow(2, 9999, 10000), false); // monto no coincide
});

test('evaluarAprobacionFlow: redondea antes de comparar (evita falsos negativos por decimales)', () => {
  assert.equal(evaluarAprobacionFlow(2, 9999.6, 10000), true);
});

function respuestaJson(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

test('llamarFlow: no reintenta ante una respuesta HTTP de Flow (error determinista)', async () => {
  let llamadas = 0;
  const fetchFalso = (async () => {
    llamadas++;
    return respuestaJson({ code: -1, message: 'Parámetros inválidos' }, false, 400);
  }) as typeof fetch;

  await assert.rejects(
    () => llamarFlow('/payment/create', { commerceOrder: 'PED-1' }, 'POST', 'apiKey', 'secreto', {
      fetchImpl: fetchFalso,
      reintentos: 2,
    }),
    /Flow respondió 400/,
  );
  assert.equal(llamadas, 1);
});

test('llamarFlow: reintenta ante error de red y se recupera si un intento posterior funciona', async () => {
  let llamadas = 0;
  const fetchFalso = (async () => {
    llamadas++;
    if (llamadas < 3) throw new TypeError('fetch failed');
    return respuestaJson({ status: 2, commerceOrder: 'PED-1', amount: 10000 });
  }) as typeof fetch;

  const datos = await llamarFlow('/payment/getStatus', { token: 'abc' }, 'GET', 'apiKey', 'secreto', {
    fetchImpl: fetchFalso,
    reintentos: 2,
  });
  assert.equal(llamadas, 3);
  assert.equal(datos.commerceOrder, 'PED-1');
});

test('llamarFlow: agota los reintentos y lanza un error descriptivo', async () => {
  let llamadas = 0;
  const fetchFalso = (async () => {
    llamadas++;
    throw new TypeError('fetch failed');
  }) as typeof fetch;

  await assert.rejects(
    () => llamarFlow('/payment/getStatus', { token: 'abc' }, 'GET', 'apiKey', 'secreto', {
      fetchImpl: fetchFalso,
      reintentos: 2,
    }),
    /Flow no respondió tras 3 intento\(s\)/,
  );
  assert.equal(llamadas, 3); // intento inicial + 2 reintentos
});
