// Tests del reporte mensual de ventas.
// Ejecutar: npx tsx --test src/utils/reporteVentas.test.ts
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { baseComision, calcularComision, csvVentas, rangoMesChile, resumirVentas, type VentaReporte } from './reporteVentas';

function venta(parcial: Partial<VentaReporte> = {}): VentaReporte {
  return {
    id: 'PED-20261005-AAAAAAAA', fecha: '2026-10-05T15:00:00.000Z', fechaPago: '2026-10-05T15:05:00.000Z',
    nombreCliente: 'Juan Soto', metodoPago: 'flow', estado: 'pagado',
    subtotal: 100_000, costoEnvio: 5_000, total: 105_000, ...parcial,
  };
}

describe('resumirVentas', () => {
  test('suma totales, envío, descuentos y separa IVA', () => {
    const r = resumirVentas([
      venta(),
      venta({ id: 'B', metodoPago: 'transferencia', subtotal: 50_000, costoEnvio: 0, descuento: 5_000, total: 45_000 }),
    ]);
    assert.equal(r.pedidos, 2);
    assert.equal(r.totalConIva, 150_000);
    assert.equal(r.envio, 5_000);
    assert.equal(r.descuentos, 5_000);
    assert.equal(r.productosConIva, 145_000);
    assert.equal(r.neto + r.iva, r.totalConIva);
    assert.equal(r.neto, Math.round(150_000 / 1.19));
    assert.deepEqual(r.porMedio.flow, { pedidos: 1, total: 105_000 });
    assert.deepEqual(r.porMedio.transferencia, { pedidos: 1, total: 45_000 });
    assert.equal(r.porMedio.webpay, undefined);
  });

  test('sin ventas: todo en cero', () => {
    const r = resumirVentas([]);
    assert.equal(r.pedidos, 0);
    assert.equal(r.totalConIva, 0);
    assert.equal(r.ticketPromedio, 0);
  });

  test('ticket promedio redondeado', () => {
    const r = resumirVentas([venta({ total: 10_000 }), venta({ id: 'B', total: 10_001 })]);
    assert.equal(r.ticketPromedio, 10_001);
  });
});

describe('base y comisión', () => {
  const r = resumirVentas([venta()]); // 105.000 con IVA, envío 5.000
  test('cada base posible', () => {
    assert.equal(baseComision(r, 'total_con_iva'), 105_000);
    assert.equal(baseComision(r, 'total_neto'), Math.round(105_000 / 1.19));
    assert.equal(baseComision(r, 'productos_con_iva'), 100_000);
    assert.equal(baseComision(r, 'productos_neto'), Math.round(100_000 / 1.19));
  });
  test('comisión redondeada al peso; porcentaje inválido = 0', () => {
    assert.equal(calcularComision(105_000, 3), 3_150);
    assert.equal(calcularComision(99_999, 2.5), 2_500);
    assert.equal(calcularComision(105_000, -1), 0);
    assert.equal(calcularComision(105_000, Number.NaN), 0);
  });
});

describe('rangoMesChile', () => {
  test('octubre 2026: medianoche de Santiago (UTC-3 en verano)', () => {
    const { desde, hasta } = rangoMesChile(2026, 10);
    assert.equal(desde, '2026-10-01T03:00:00.000Z');
    assert.equal(hasta, '2026-11-01T03:00:00.000Z');
  });
  test('junio 2026: medianoche de Santiago (UTC-4 en invierno)', () => {
    const { desde, hasta } = rangoMesChile(2026, 6);
    assert.equal(desde, '2026-06-01T04:00:00.000Z');
    assert.equal(hasta, '2026-07-01T04:00:00.000Z');
  });
  test('diciembre pasa al año siguiente', () => {
    assert.equal(rangoMesChile(2026, 12).hasta.slice(0, 10), '2027-01-01');
  });
});

describe('csvVentas', () => {
  test('encabezado, una fila por pedido y escapado de comillas/; en nombres', () => {
    const csv = csvVentas([venta({ nombreCliente: 'Forestal "Río"; Ltda' })]);
    const lineas = csv.trim().split('\r\n');
    assert.equal(lineas.length, 2);
    assert.match(lineas[0], /^Pedido;Fecha de pago;Cliente;Medio de pago;Estado;Subtotal;Descuento;Envío;Total$/);
    assert.match(lineas[1], /"Forestal ""Río""; Ltda"/);
    assert.match(lineas[1], /;105000$/);
  });
  test('neutraliza fórmulas de planilla en nombres (=, +, -, @)', () => {
    const csv = csvVentas([venta({ nombreCliente: '=HYPERLINK("x")' })]);
    assert.match(csv, /"'=HYPERLINK\(""x""\)"/);
  });
});
