import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsearPrecio, parsearStock, slugId } from './transformarInventario';

test('parsearPrecio: quita $ y separador de miles', () => {
  assert.equal(parsearPrecio('$45,000'), 45000);
  assert.equal(parsearPrecio('$2,900'), 2900);
  assert.equal(parsearPrecio('$300'), 300);
  assert.equal(parsearPrecio('$0'), 0);
  assert.equal(parsearPrecio(''), 0);
});

test('parsearStock: entero, N/A -> 0, negativos -> 0', () => {
  assert.equal(parsearStock('2.00'), 2);
  assert.equal(parsearStock('152.00'), 152);
  assert.equal(parsearStock('0.00'), 0);
  assert.equal(parsearStock('N/A'), 0);
  assert.equal(parsearStock(''), 0);
});

test('slugId: prefijo inv-, minúsculas, sin acentos, sin caracteres raros', () => {
  assert.equal(slugId('AM102'), 'inv-am102');
  assert.equal(slugId('503 520 048'), 'inv-503-520-048');
  assert.equal(slugId('  C222 '), 'inv-c222');
  assert.equal(slugId('PIÑON-01'), 'inv-pinon-01');
});
