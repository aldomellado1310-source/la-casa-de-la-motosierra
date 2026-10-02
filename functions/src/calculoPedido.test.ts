// ============================================================
// Tests del cálculo de pedidos en servidor (functions/src/calculoPedido.ts)
// y test de PARIDAD contra la lógica del frontend (src/utils/precio.ts,
// src/services/envios.ts y el recálculo del carrito en useCarrito).
//
// Ejecutar desde la raíz:  npx tsx --test functions/src/*.test.ts
// (excluido del build de functions: importa archivos de ../src)
// ============================================================
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularDescuentoStock,
  calcularPedido,
  costoEnvio,
  generarIdPedido,
  precioUnitario,
  validarSolicitudPedido,
  type ProductoServidor,
} from './calculoPedido';
import { precioPorCantidad, precioVigente } from '../../src/utils/precio';
import { REGIONES_CHILE, calcularOpcionesEnvio } from '../../src/services/envios';

/** Producto base de prueba */
function producto(parcial: Partial<ProductoServidor> = {}): ProductoServidor {
  return {
    id: 'p1',
    sku: 'SKU-1',
    nombre: 'Cadena 3/8',
    precio: 10000,
    stock: 50,
    fotos: ['https://ejemplo/foto.webp'],
    preciosPorVolumen: [
      { desde: 1, hasta: 9, precioUnitario: 10000 },
      { desde: 10, hasta: 39, precioUnitario: 9000 },
      { desde: 40, hasta: null, precioUnitario: 8000 },
    ],
    activo: true,
    ...parcial,
  };
}

/**
 * Réplica exacta de cómo el carrito del frontend calcula el precio
 * unitario (useCarrito.agregar + conPrecioRecalculado), usando las
 * funciones REALES de src/utils/precio.ts.
 */
function precioCarritoFrontend(p: ProductoServidor, cantidad: number): number {
  const vigente = precioVigente(p);
  const tramosConTecho = p.preciosPorVolumen.map((t) => ({
    ...t,
    precioUnitario: Math.min(t.precioUnitario, vigente),
  }));
  return precioPorCantidad(tramosConTecho, p.precio, cantidad);
}

describe('paridad de precio unitario con el frontend', () => {
  const casos: { nombre: string; p: ProductoServidor }[] = [
    { nombre: 'sin oferta, con tramos', p: producto() },
    { nombre: 'oferta menor a todos los tramos (techo)', p: producto({ precioOferta: 7500 }) },
    { nombre: 'oferta intermedia (techo solo del primer tramo)', p: producto({ precioOferta: 9500 }) },
    { nombre: 'oferta mayor al precio (se ignora)', p: producto({ precioOferta: 12000 }) },
    { nombre: 'oferta igual al precio (se ignora)', p: producto({ precioOferta: 10000 }) },
    { nombre: 'tramo único desde 1 sin tope', p: producto({ preciosPorVolumen: [{ desde: 1, hasta: null, precioUnitario: 10000 }] }) },
    { nombre: 'tramo único + oferta', p: producto({ precioOferta: 8800, preciosPorVolumen: [{ desde: 1, hasta: null, precioUnitario: 10000 }] }) },
  ];
  const cantidades = [1, 2, 9, 10, 11, 39, 40, 41, 999];
  for (const { nombre, p } of casos) {
    test(nombre, () => {
      for (const q of cantidades) {
        assert.equal(precioUnitario(p, q), precioCarritoFrontend(p, q), `cantidad ${q}`);
      }
    });
  }

  test('sin tramos y sin oferta: precio base (igual que el frontend)', () => {
    const p = producto({ preciosPorVolumen: [] });
    assert.equal(precioUnitario(p, 3), precioCarritoFrontend(p, 3));
    assert.equal(precioUnitario(p, 3), 10000);
  });

  test('DIVERGENCIA documentada: sin tramos + oferta → servidor aplica la oferta como techo', () => {
    // El carrito del frontend cae a precioBase (sin oferta) cuando ningún
    // tramo calza; el servidor respeta la regla de negocio "la oferta es
    // techo". El checkout mostrará el total menor del servidor.
    const p = producto({ preciosPorVolumen: [], precioOferta: 7000 });
    assert.equal(precioUnitario(p, 1), 7000);
    assert.equal(precioCarritoFrontend(p, 1), 10000);
  });
});

describe('paridad de costo de envío con src/services/envios.ts', () => {
  const metodos = ['retiro_tienda', 'starken', 'chilexpress', 'bluexpress'] as const;
  const pesos = [1, 3, 4, 7, 12];
  for (const region of REGIONES_CHILE) {
    test(`región ${region}`, () => {
      for (const peso of pesos) {
        const opciones = calcularOpcionesEnvio(region, peso);
        for (const metodo of metodos) {
          const esperado = opciones.find((o) => o.metodo === metodo)!.costo;
          assert.equal(costoEnvio(metodo, region, peso), esperado, `${metodo} ${peso}kg`);
        }
      }
    });
  }
  test('retiro en tienda siempre gratis aunque no haya región', () => {
    assert.equal(costoEnvio('retiro_tienda', undefined, 20), 0);
  });
});

describe('calcularPedido', () => {
  const catalogo = new Map<string, ProductoServidor>([
    ['p1', producto()],
    ['p2', producto({ id: 'p2', sku: 'SKU-2', nombre: 'Espada 18"', precio: 25000, precioOferta: 22000, preciosPorVolumen: [], stock: 3 })],
    ['p3', producto({ id: 'p3', sku: 'SKU-3', nombre: 'Carburador', stock: 0, bajoPedido: true })],
    ['p4', producto({ id: 'p4', sku: 'SKU-4', nombre: 'Filtro agotado', stock: 0 })],
    ['p5', producto({ id: 'p5', sku: 'SKU-5', nombre: 'Inactivo', activo: false })],
  ]);

  test('total = subtotal (tramos/oferta) + envío por peso (1 kg por unidad)', () => {
    const r = calcularPedido(catalogo, [{ productoId: 'p1', cantidad: 10 }, { productoId: 'p2', cantidad: 2 }], 'starken', 'Metropolitana');
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.equal(r.subtotal, 10 * 9000 + 2 * 22000);
    // 12 unidades → 9 kg extra × 1500 + nacional starken 12990
    const esperadoEnvio = calcularOpcionesEnvio('Metropolitana', 12).find((o) => o.metodo === 'starken')!.costo;
    assert.equal(r.costoEnvio, esperadoEnvio);
    assert.equal(r.total, r.subtotal + r.costoEnvio);
    // Forma de ItemCarrito que usa el resto de la app
    const it = r.items[0];
    assert.deepEqual(Object.keys(it).sort(), ['cantidad', 'foto', 'nombre', 'precioBase', 'precioUnitario', 'preciosPorVolumen', 'productoId', 'sku', 'stockDisponible'].sort());
    assert.equal(it.precioBase, 10000);
    assert.equal(it.precioUnitario, 9000);
  });

  test('retiro en tienda: envío 0', () => {
    const r = calcularPedido(catalogo, [{ productoId: 'p1', cantidad: 1 }], 'retiro_tienda', undefined);
    assert.ok(r.ok);
    if (r.ok) assert.equal(r.total, 10000);
  });

  test('bajo pedido con stock 0 se permite', () => {
    const r = calcularPedido(catalogo, [{ productoId: 'p3', cantidad: 2 }], 'retiro_tienda', undefined);
    assert.ok(r.ok);
  });

  test('agotado sin bajo pedido → error de stock', () => {
    const r = calcularPedido(catalogo, [{ productoId: 'p4', cantidad: 1 }], 'retiro_tienda', undefined);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.codigo, 'stock');
      assert.match(r.mensaje, /Filtro agotado/);
    }
  });

  test('cantidad mayor al stock → error de stock con unidades disponibles', () => {
    const r = calcularPedido(catalogo, [{ productoId: 'p2', cantidad: 5 }], 'retiro_tienda', undefined);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.codigo, 'stock');
      assert.match(r.mensaje, /3/);
    }
  });

  test('producto inexistente o inactivo → no_disponible', () => {
    const a = calcularPedido(catalogo, [{ productoId: 'zzz', cantidad: 1 }], 'retiro_tienda', undefined);
    const b = calcularPedido(catalogo, [{ productoId: 'p5', cantidad: 1 }], 'retiro_tienda', undefined);
    assert.equal(a.ok, false);
    assert.equal(b.ok, false);
    if (!a.ok) assert.equal(a.codigo, 'no_disponible');
    if (!b.ok) assert.equal(b.codigo, 'no_disponible');
  });
});

describe('validarSolicitudPedido', () => {
  const valida = {
    items: [{ productoId: 'p1', cantidad: 2 }],
    nombreCliente: 'Juan Soto',
    emailCliente: 'juan@correo.cl',
    metodoEnvio: 'starken',
    metodoPago: 'webpay',
    direccion: { calle: 'Teniente Merino', numero: '500', comuna: 'Aysén', region: 'Aysén' },
  };

  test('acepta una solicitud válida y normaliza', () => {
    const r = validarSolicitudPedido(valida);
    assert.ok(r.ok);
    if (r.ok) {
      assert.equal(r.datos.items.length, 1);
      assert.equal(r.datos.direccion?.region, 'Aysén');
    }
  });

  test('ignora campos extra (mass assignment): total, estado, stockDescontado, uid', () => {
    const r = validarSolicitudPedido({ ...valida, total: 1, estado: 'pagado', stockDescontado: true, uid: 'otro' });
    assert.ok(r.ok);
    if (r.ok) {
      const claves = Object.keys(r.datos);
      for (const prohibida of ['total', 'estado', 'stockDescontado', 'uid']) {
        assert.ok(!claves.includes(prohibida), prohibida);
      }
    }
  });

  test('agrupa líneas repetidas del mismo producto', () => {
    const r = validarSolicitudPedido({ ...valida, items: [{ productoId: 'p1', cantidad: 2 }, { productoId: 'p1', cantidad: 3 }] });
    assert.ok(r.ok);
    if (r.ok) assert.deepEqual(r.datos.items, [{ productoId: 'p1', cantidad: 5 }]);
  });

  const invalidas: [string, unknown][] = [
    ['sin items', { ...valida, items: [] }],
    ['cantidad 0', { ...valida, items: [{ productoId: 'p1', cantidad: 0 }] }],
    ['cantidad negativa', { ...valida, items: [{ productoId: 'p1', cantidad: -1 }] }],
    ['cantidad decimal', { ...valida, items: [{ productoId: 'p1', cantidad: 1.5 }] }],
    ['cantidad sobre el tope', { ...valida, items: [{ productoId: 'p1', cantidad: 1000 }] }],
    ['productoId vacío', { ...valida, items: [{ productoId: '', cantidad: 1 }] }],
    ['productoId con barra', { ...valida, items: [{ productoId: 'a/b', cantidad: 1 }] }],
    ['email inválido', { ...valida, emailCliente: 'no-es-correo' }],
    ['nombre vacío', { ...valida, nombreCliente: '  ' }],
    ['método de pago desconocido', { ...valida, metodoPago: 'bitcoin' }],
    ['método de envío desconocido', { ...valida, metodoEnvio: 'dron' }],
    ['despacho sin dirección', { ...valida, direccion: undefined }],
    ['región inexistente', { ...valida, direccion: { ...valida.direccion, region: 'Marte' } }],
    ['body no objeto', 'hola'],
  ];
  for (const [nombre, cuerpo] of invalidas) {
    test(`rechaza: ${nombre}`, () => {
      assert.equal(validarSolicitudPedido(cuerpo).ok, false);
    });
  }

  test('retiro en tienda no exige dirección', () => {
    const r = validarSolicitudPedido({ ...valida, metodoEnvio: 'retiro_tienda', direccion: undefined });
    assert.ok(r.ok);
  });
});

describe('generarIdPedido', () => {
  test('formato PED-AAAAMMDD-XXXXXXXX sin caracteres ambiguos', () => {
    const id = generarIdPedido(new Date('2026-10-02T15:00:00Z'));
    assert.match(id, /^PED-20261002-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/);
  });
  test('ids distintos', () => {
    const ids = new Set(Array.from({ length: 200 }, () => generarIdPedido()));
    assert.equal(ids.size, 200);
  });
});

describe('calcularDescuentoStock (CN-015)', () => {
  test('descuenta normalmente cuando alcanza', () => {
    const r = calcularDescuentoStock([{ productoId: 'a', cantidad: 2 }], new Map([['a', 5]]));
    assert.deepEqual([...r.nuevosStocks], [['a', 3]]);
    assert.equal(r.insuficiente, false);
  });
  test('no deja stock negativo: queda en 0 y marca insuficiente', () => {
    const r = calcularDescuentoStock([{ productoId: 'a', cantidad: 4 }], new Map([['a', 1]]));
    assert.deepEqual([...r.nuevosStocks], [['a', 0]]);
    assert.equal(r.insuficiente, true);
  });
  test('agrupa líneas repetidas del mismo producto', () => {
    const r = calcularDescuentoStock(
      [{ productoId: 'a', cantidad: 2 }, { productoId: 'a', cantidad: 2 }],
      new Map([['a', 3]]),
    );
    assert.deepEqual([...r.nuevosStocks], [['a', 0]]);
    assert.equal(r.insuficiente, true);
  });
  test('producto inexistente: se omite y marca insuficiente', () => {
    const r = calcularDescuentoStock([{ productoId: 'x', cantidad: 1 }], new Map());
    assert.equal(r.nuevosStocks.size, 0);
    assert.equal(r.insuficiente, true);
  });
});
