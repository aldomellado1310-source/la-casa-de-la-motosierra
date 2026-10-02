// Tests de esRutaComprobanteValida (CN-002).
// Ejecutar: npx tsx --test src/utils/urlSegura.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esRutaComprobanteValida } from './urlSegura';

const ID = 'PED-20261002-AB12CD34';
const firebase = { pedidoId: ID, modoDemo: false };
const demo = { pedidoId: ID, modoDemo: true };

test('acepta la ruta que guarda subirComprobante', () => {
  assert.equal(esRutaComprobanteValida(`comprobantes/${ID}/1759412345678-Comprobante_Banco.pdf`, firebase), true);
});

test('rechaza la ruta de otro pedido', () => {
  assert.equal(esRutaComprobanteValida('comprobantes/PED-20261002-ZZZZZZZZ/1-a.pdf', firebase), false);
});

test('rechaza URLs y esquemas peligrosos', () => {
  for (const valor of [
    'javascript:alert(1)',
    'JaVaScRiPt:alert(document.cookie)',
    'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
    'vbscript:msgbox(1)',
    'blob:https://lacasadelamotosierra.cl/1234',
    'https://evil.example.com/comprobante.pdf',
    `https://firebasestorage.googleapis.com/v0/b/x/o/comprobantes%2F${ID}%2Fa.pdf`,
  ]) {
    assert.equal(esRutaComprobanteValida(valor, firebase), false, valor);
    assert.equal(esRutaComprobanteValida(valor, demo), false, valor);
  }
});

test('rechaza recorridos de ruta, subcarpetas y caracteres raros', () => {
  for (const valor of [
    `comprobantes/${ID}/../otro.pdf`,
    `comprobantes/${ID}/..`,
    `comprobantes/${ID}/sub/archivo.pdf`,
    `comprobantes/${ID}/.oculto`,
    `comprobantes/${ID}/mi archivo.pdf`,
    `comprobantes/${ID}/`,
    `/comprobantes/${ID}/1-a.pdf`,
    `comprobantes/${ID}/1-a.pdf\n`,
    `productos/${ID}/1-a.pdf`,
  ]) {
    assert.equal(esRutaComprobanteValida(valor, firebase), false, JSON.stringify(valor));
  }
});

test('rechaza nombres de más de 120 caracteres', () => {
  assert.equal(esRutaComprobanteValida(`comprobantes/${ID}/${'a'.repeat(120)}`, firebase), true);
  assert.equal(esRutaComprobanteValida(`comprobantes/${ID}/${'a'.repeat(121)}`, firebase), false);
});

test('un pedidoId con caracteres de regex no abre la validación', () => {
  const opciones = { pedidoId: 'PED.*', modoDemo: false };
  assert.equal(esRutaComprobanteValida('comprobantes/PED-123/1-a.pdf', opciones), false);
});

test('demo:// solo se acepta en modo demo y con nombre simple', () => {
  assert.equal(esRutaComprobanteValida('demo://transferencia.jpg', demo), true);
  assert.equal(esRutaComprobanteValida('demo://transferencia.jpg', firebase), false);
  assert.equal(esRutaComprobanteValida('demo://a/b.jpg', demo), false);
});

test('valores que no son string o están vacíos', () => {
  for (const valor of [undefined, null, 42, {}, '']) {
    assert.equal(esRutaComprobanteValida(valor, firebase), false, String(valor));
  }
});
