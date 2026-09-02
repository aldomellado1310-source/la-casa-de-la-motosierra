import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsearPrecio, parsearStock, slugId } from './transformarInventario';
import { extraerMarcas, clasificar } from './transformarInventario';

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

test('extraerMarcas: por palabra clave del nombre', () => {
  assert.deepEqual(extraerMarcas('AMORTIGUADOR STIHL 361'), ['Stihl']);
  assert.deepEqual(extraerMarcas('CARBURADOR HQV61'), ['Husqvarna']);
  assert.deepEqual(extraerMarcas('CADENA 36/D HQV440-445-450 CASTOR 52CC-CHINAS'), ['Husqvarna', 'Castor', 'Genérica/China']);
  assert.deepEqual(extraerMarcas('FILTRO DE AIRE MS 250'), ['Stihl']);
  assert.deepEqual(extraerMarcas('ACEITE 10W30'), []);
});

test('clasificar: por departamento', () => {
  assert.deepEqual(clasificar('CARBURADORES', 'CARBURADOR HQV61'), { categoria: 'carburacion-arranque', subcategoria: 'Carburadores' });
  assert.deepEqual(clasificar('FILTRO DE AIRE', 'FILTRO X'), { categoria: 'filtros-bujias', subcategoria: 'Filtros de aire' });
  assert.deepEqual(clasificar('PIÑONES', 'PIÑON X'), { categoria: 'espadas-cadenas', subcategoria: 'Piñones' });
  assert.deepEqual(clasificar('BOBINAS', 'BOBINA MS250'), { categoria: 'repuestos-varios', subcategoria: 'Otros' });
});

test('clasificar: "- Sin Departamento -" por palabra clave del nombre', () => {
  assert.deepEqual(clasificar('- Sin Departamento -', 'ACEITE MEZCLA ANTEROS 125CC'), { categoria: 'aceites-lubricantes', subcategoria: 'Aceite de mezcla 2T' });
  assert.deepEqual(clasificar('- Sin Departamento -', 'CADENA 25/D STIHL170'), { categoria: 'espadas-cadenas', subcategoria: 'Cadenas' });
  assert.deepEqual(clasificar('- Sin Departamento -', 'SALVAMANO MS310-390-260'), { categoria: 'herramientas-seguridad', subcategoria: 'EPP' });
  assert.deepEqual(clasificar('- Sin Departamento -', 'PIEZA RARA XYZ'), { categoria: 'repuestos-varios', subcategoria: 'Otros' });
});
