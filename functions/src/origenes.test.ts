// Tests de la lista blanca de orígenes (CORS y URLs de retorno de pago)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { origenPermitido, origenRetorno } from './origenes';

const LISTA = ['https://la-casa-de-la-motosierra.web.app', 'http://localhost:5173'];

test('acepta solo orígenes exactos de la lista', () => {
  assert.equal(origenPermitido('https://la-casa-de-la-motosierra.web.app', LISTA), true);
  assert.equal(origenPermitido('http://localhost:5173', LISTA), true);
  assert.equal(origenPermitido('https://la-casa-de-la-motosierra.web.app.evil.com', LISTA), false);
  assert.equal(origenPermitido('https://evil.com', LISTA), false);
  assert.equal(origenPermitido(undefined, LISTA), false);
  assert.equal(origenPermitido('null', LISTA), false);
});

test('tolera barra final en la configuración', () => {
  assert.equal(origenPermitido('https://a.cl', ['https://a.cl/']), true);
});

test('origen de retorno: el del request si está permitido, si no el primero de la lista', () => {
  assert.equal(origenRetorno('http://localhost:5173', LISTA), 'http://localhost:5173');
  assert.equal(origenRetorno('https://evil.com', LISTA), 'https://la-casa-de-la-motosierra.web.app');
  assert.equal(origenRetorno(undefined, LISTA), 'https://la-casa-de-la-motosierra.web.app');
});
