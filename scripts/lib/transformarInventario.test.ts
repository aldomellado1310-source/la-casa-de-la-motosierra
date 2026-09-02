import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsearPrecio, parsearStock, slugId } from './transformarInventario';
import { extraerMarcas, clasificar } from './transformarInventario';
import { transformarInventario } from './transformarInventario';

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

const CABECERA = 'Codigo\tDescripcion\tPrecio Costo\tPrecio Venta\tPrecio Mayoreo\tInventario\tInv. Minimo\tDepartamento';
const tsv = (...filas: string[]) => [CABECERA, ...filas].join('\r\n');

test('transformarInventario: fila normal con mayoreo -> 2 tramos', () => {
  const { productos } = transformarInventario(tsv(
    ' AM102\tAMORTIGUADOR STIHL 361\t$0\t$10,000\t$9,000\t3.00\t2\tAMORTIGUADORES',
  ));
  assert.equal(productos.length, 1);
  const p = productos[0];
  assert.equal(p.id, 'inv-am102');
  assert.equal(p.sku, 'AM102');
  assert.equal(p.nombre, 'AMORTIGUADOR STIHL 361');
  assert.equal(p.precio, 10000);
  assert.equal(p.stock, 3);
  assert.deepEqual(p.preciosPorVolumen, [
    { desde: 1, hasta: 9, precioUnitario: 10000 },
    { desde: 10, hasta: null, precioUnitario: 9000 },
  ]);
  assert.deepEqual(p.compatibilidades, [{ marca: 'Stihl', modelos: [] }]);
  assert.equal(p.categoria, 'repuestos-varios');
  assert.equal(p.subcategoria, 'Otros');
  assert.equal(p.activo, true);
  assert.equal(p.descripcion, '');
  assert.equal(p.destacado, false);
  assert.deepEqual(p.fotos, ['https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AM102']);
});

test('transformarInventario: sin mayoreo -> 1 tramo', () => {
  const { productos } = transformarInventario(tsv(
    ' 500\tTAPA DE CADENA CHINA\t$0\t$25,000\t$0\t1.00\t2\t- Sin Departamento -',
  ));
  assert.deepEqual(productos[0].preciosPorVolumen, [{ desde: 1, hasta: null, precioUnitario: 25000 }]);
  assert.deepEqual(productos[0].compatibilidades, [{ marca: 'Genérica/China', modelos: [] }]);
});

test('transformarInventario: nombre desde el código si la descripción está vacía', () => {
  const { productos, revisar } = transformarInventario(tsv(
    ' GOLILLA FS 120\t\t$0\t$10,000\t$0\t1.00\t0.000\t- Sin Departamento -',
  ));
  assert.equal(productos[0].nombre, 'GOLILLA FS 120');
  assert.equal(productos[0].sku, 'GOLILLA FS 120');
  assert.equal(productos[0].id, 'inv-golilla-fs-120');
  // nombre == código -> va a la lista de revisión
  assert.ok(revisar.some((r) => r.id === 'inv-golilla-fs-120'));
});

test('transformarInventario: descarta filas de prueba (precio <= 1)', () => {
  const { productos, descartados } = transformarInventario(tsv(
    ' 1\t1\t$0\t$1\t$0\tN/A\t0.000\t- Sin Departamento -',
    ' 6\tACEITE CADENA\t$0\t$1,500\t$0\tN/A\t0.000\t- Sin Departamento -',
  ));
  assert.equal(productos.length, 1);
  assert.equal(productos[0].sku, '6');
  assert.equal(descartados.length, 1);
  assert.equal(descartados[0].codigo, '1');
});

test('transformarInventario: MANO DE OBRA -> activo false', () => {
  const { productos } = transformarInventario(tsv(
    ' 40\tMANTENCION MOTOSIERRA\t$0\t$20,000\t$0\tN/A\t0.000\tMANO DE OBRA',
  ));
  assert.equal(productos[0].activo, false);
});

test('transformarInventario: ids duplicados por slug se desambiguan', () => {
  const { productos } = transformarInventario(tsv(
    ' AM 102\tPIEZA A\t$0\t$5,000\t$0\t1\t2\tAMORTIGUADORES',
    ' AM-102\tPIEZA B\t$0\t$5,000\t$0\t1\t2\tAMORTIGUADORES',
  ));
  assert.equal(productos[0].id, 'inv-am-102');
  assert.equal(productos[1].id, 'inv-am-102-2');
});
