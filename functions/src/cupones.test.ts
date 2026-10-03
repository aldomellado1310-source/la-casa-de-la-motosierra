// ============================================================
// Tests de cupones en servidor (functions/src/cupones.ts), su uso
// en calcularPedido y PARIDAD con src/utils/cupones.ts (lo que el
// checkout muestra como vista previa).
//
// Ejecutar desde la raíz:  npx tsx --test functions/src/*.test.ts
// ============================================================
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calcularDescuento, cuponVigente, normalizarCodigoCupon, type Cupon } from './cupones';
import { calcularPedido, validarSolicitudPedido, type ProductoServidor } from './calculoPedido';
import * as front from '../../src/utils/cupones';

const AHORA = new Date('2026-10-02T12:00:00Z');

function cupon(parcial: Partial<Cupon> = {}): Cupon {
  return { codigo: 'BIENVENIDO10', tipo: 'porcentaje', valor: 10, activo: true, ...parcial };
}

function producto(parcial: Partial<ProductoServidor> = {}): ProductoServidor {
  return {
    id: 'p1', sku: 'SKU-1', nombre: 'Cadena', precio: 10000, stock: 50,
    fotos: [], preciosPorVolumen: [], activo: true, ...parcial,
  };
}

describe('normalizarCodigoCupon', () => {
  test('pasa a mayúsculas y quita espacios', () => {
    assert.equal(normalizarCodigoCupon('  bienvenido10 '), 'BIENVENIDO10');
  });
  test('rechaza códigos con caracteres raros o de largo inválido', () => {
    for (const malo of ['', 'AB', 'con espacio', 'a/b', '../X', 'X'.repeat(31), 42, null]) {
      assert.equal(normalizarCodigoCupon(malo), null, String(malo));
    }
  });
});

describe('cuponVigente', () => {
  test('activo y sin vencimiento → vigente', () => {
    assert.equal(cuponVigente(cupon(), AHORA), true);
  });
  test('inactivo → no vigente', () => {
    assert.equal(cuponVigente(cupon({ activo: false }), AHORA), false);
  });
  test('vencido → no vigente; vence más tarde → vigente', () => {
    assert.equal(cuponVigente(cupon({ fechaExpiracion: '2026-10-01T23:59:59Z' }), AHORA), false);
    assert.equal(cuponVigente(cupon({ fechaExpiracion: '2026-10-03T00:00:00Z' }), AHORA), true);
  });
  test('valores fuera de rango → no vigente', () => {
    assert.equal(cuponVigente(cupon({ valor: 0 }), AHORA), false);
    assert.equal(cuponVigente(cupon({ valor: 101 }), AHORA), false);
    assert.equal(cuponVigente(cupon({ tipo: 'monto', valor: -1 }), AHORA), false);
  });
});

describe('calcularDescuento', () => {
  test('porcentaje redondeado al peso', () => {
    assert.equal(calcularDescuento(cupon({ valor: 10 }), 45_555), 4_556);
  });
  test('monto fijo', () => {
    assert.equal(calcularDescuento(cupon({ tipo: 'monto', valor: 5_000 }), 45_000), 5_000);
  });
  test('nunca supera el subtotal', () => {
    assert.equal(calcularDescuento(cupon({ tipo: 'monto', valor: 99_000 }), 45_000), 45_000);
    assert.equal(calcularDescuento(cupon({ valor: 100 }), 45_000), 45_000);
  });
  test('paridad con el frontend', () => {
    for (const c of [cupon({ valor: 7 }), cupon({ valor: 33 }), cupon({ tipo: 'monto', valor: 3_990 })]) {
      for (const subtotal of [0, 1, 999, 45_555, 1_234_567]) {
        assert.equal(calcularDescuento(c, subtotal), front.calcularDescuento(c, subtotal), `${c.tipo} ${c.valor} ${subtotal}`);
      }
    }
    assert.equal(front.cuponVigente(cupon({ fechaExpiracion: '2026-10-01T00:00:00Z' }), AHORA), false);
    assert.equal(front.cuponVigente(cupon(), AHORA), true);
  });
});

describe('calcularPedido con cupón', () => {
  const productos = new Map([['p1', producto()]]);

  test('el descuento se aplica al subtotal, antes del envío', () => {
    const r = calcularPedido(productos, [{ productoId: 'p1', cantidad: 2 }], 'starken', 'Aysén', cupon({ valor: 10 }), AHORA);
    assert.ok(r.ok);
    assert.equal(r.subtotal, 20_000);
    assert.equal(r.descuento, 2_000);
    assert.equal(r.costoEnvio, 4_990);
    assert.equal(r.total, 20_000 - 2_000 + 4_990);
    assert.equal(r.cuponCodigo, 'BIENVENIDO10');
  });

  test('sin cupón: descuento 0 y sin código', () => {
    const r = calcularPedido(productos, [{ productoId: 'p1', cantidad: 1 }], 'retiro_tienda', undefined);
    assert.ok(r.ok);
    assert.equal(r.descuento, 0);
    assert.equal(r.cuponCodigo, undefined);
    assert.equal(r.total, 10_000);
  });

  test('cupón vencido o inactivo → error claro, no se crea el pedido', () => {
    const r = calcularPedido(productos, [{ productoId: 'p1', cantidad: 1 }], 'retiro_tienda', undefined,
      cupon({ activo: false }), AHORA);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.codigo, 'cupon');
  });

  test('un cupón del 100% deja el pedido en 0 → se rechaza (las pasarelas no cobran $0)', () => {
    const r = calcularPedido(productos, [{ productoId: 'p1', cantidad: 1 }], 'retiro_tienda', undefined,
      cupon({ valor: 100 }), AHORA);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.codigo, 'cupon');
  });
});

describe('validarSolicitudPedido acepta flow y cuponCodigo', () => {
  const base = {
    items: [{ productoId: 'p1', cantidad: 1 }],
    nombreCliente: 'Juan', emailCliente: 'juan@ejemplo.cl',
    metodoEnvio: 'retiro_tienda',
  };
  test('flow es un medio de pago válido', () => {
    const r = validarSolicitudPedido({ ...base, metodoPago: 'flow' });
    assert.ok(r.ok);
    if (r.ok) assert.equal(r.datos.metodoPago, 'flow');
  });
  test('el código de cupón se normaliza', () => {
    const r = validarSolicitudPedido({ ...base, metodoPago: 'flow', cuponCodigo: ' bienvenido10 ' });
    assert.ok(r.ok);
    if (r.ok) assert.equal(r.datos.cuponCodigo, 'BIENVENIDO10');
  });
  test('un código vacío se ignora; uno con caracteres raros se rechaza', () => {
    const vacio = validarSolicitudPedido({ ...base, metodoPago: 'flow', cuponCodigo: '   ' });
    assert.ok(vacio.ok);
    if (vacio.ok) assert.equal(vacio.datos.cuponCodigo, undefined);
    const malo = validarSolicitudPedido({ ...base, metodoPago: 'flow', cuponCodigo: '../admin' });
    assert.equal(malo.ok, false);
  });
});
