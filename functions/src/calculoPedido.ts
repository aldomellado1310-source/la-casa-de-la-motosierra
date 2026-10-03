// ============================================================
// Cálculo AUTORITATIVO de pedidos en el servidor (módulo puro,
// sin Firebase, testeable con `npx tsx --test`).
//
// Duplica la lógica mínima del frontend porque functions/ no puede
// importar de ../src:
//   - precioVigente / precioPorCantidad  → src/utils/precio.ts
//   - techo de oferta sobre los tramos   → src/stores/useCarrito.ts
//   - tarifas de envío por zona y peso   → src/services/envios.ts
// El test de paridad (calculoPedido.test.ts) compara ambos lados:
// si se cambia una tarifa o regla en el frontend, hay que replicarla
// aquí y el test lo hará notar.
// ============================================================
import { randomInt } from 'node:crypto';
import { calcularDescuento, cuponVigente, normalizarCodigoCupon, type Cupon } from './cupones';

// ------------------------------------------------------------
// Tipos (subconjunto de src/types/index.ts)
// ------------------------------------------------------------
export interface TramoPrecio {
  desde: number;
  hasta: number | null;
  precioUnitario: number;
}

/** Datos del producto que el servidor necesita para cobrar */
export interface ProductoServidor {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
  precioOferta?: number;
  stock: number;
  fotos: string[];
  preciosPorVolumen: TramoPrecio[];
  activo: boolean;
  bajoPedido?: boolean;
}

/** Ítem del pedido: misma forma que ItemCarrito del frontend */
export interface ItemPedido {
  productoId: string;
  sku: string;
  nombre: string;
  foto: string;
  cantidad: number;
  precioUnitario: number;
  precioBase: number;
  stockDisponible: number;
  preciosPorVolumen: TramoPrecio[];
}

export type MetodoPago = 'webpay' | 'mercadopago' | 'flow' | 'transferencia';
export type MetodoEnvio = 'retiro_tienda' | 'starken' | 'chilexpress' | 'bluexpress';

export interface DireccionPedido {
  id: string;
  alias: string;
  calle: string;
  numero: string;
  comuna: string;
  region: string;
  referencia?: string;
}

/** Solicitud ya validada y normalizada (solo campos permitidos) */
export interface SolicitudPedido {
  items: { productoId: string; cantidad: number }[];
  nombreCliente: string;
  emailCliente: string;
  metodoPago: MetodoPago;
  metodoEnvio: MetodoEnvio;
  direccion?: DireccionPedido;
  /** Código de cupón normalizado (mayúsculas); se valida contra Firestore */
  cuponCodigo?: string;
}

// ------------------------------------------------------------
// Constantes de negocio
// ------------------------------------------------------------
export const METODOS_PAGO: readonly MetodoPago[] = ['webpay', 'mercadopago', 'flow', 'transferencia'];
export const METODOS_ENVIO: readonly MetodoEnvio[] = ['retiro_tienda', 'starken', 'chilexpress', 'bluexpress'];

/** Igual a REGIONES_CHILE de src/services/envios.ts */
export const REGIONES_CHILE: readonly string[] = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', 'Metropolitana', "O'Higgins", 'Maule', 'Ñuble', 'Biobío',
  'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];

/** Tope de unidades por línea (el carrito usa 999 como máximo) */
export const CANTIDAD_MAXIMA = 999;
/** Tope de líneas distintas por pedido */
export const LINEAS_MAXIMAS = 50;

type Zona = 'local' | 'austral' | 'nacional';

const TARIFAS: Record<Exclude<MetodoEnvio, 'retiro_tienda'>, Record<Zona, number>> = {
  starken:     { local: 4990, austral: 8990,  nacional: 12990 },
  chilexpress: { local: 5490, austral: 9990,  nacional: 13990 },
  bluexpress:  { local: 4490, austral: 8490,  nacional: 11990 },
};
const RECARGO_KG = 1500;
const KG_INCLUIDOS = 3;

// ------------------------------------------------------------
// Precios
// ------------------------------------------------------------

/** Precio vigente: el de oferta cuando existe y es menor al base */
export function precioVigente(p: Pick<ProductoServidor, 'precio' | 'precioOferta'>): number {
  return p.precioOferta && p.precioOferta < p.precio ? p.precioOferta : p.precio;
}

/** Precio unitario según tramos de volumen (igual al frontend) */
export function precioPorCantidad(tramos: TramoPrecio[], precioBase: number, cantidad: number): number {
  if (!tramos.length) return precioBase;
  const tramo = tramos.find((t) => cantidad >= t.desde && (t.hasta === null || cantidad <= t.hasta));
  return tramo ? tramo.precioUnitario : precioBase;
}

/** Tramos con la oferta aplicada como TECHO (como los guarda el carrito) */
export function tramosConTecho(p: ProductoServidor): TramoPrecio[] {
  const vigente = precioVigente(p);
  return p.preciosPorVolumen.map((t) => ({ ...t, precioUnitario: Math.min(t.precioUnitario, vigente) }));
}

/**
 * Precio unitario a cobrar: tramo de volumen correspondiente con la
 * oferta como techo. Si ningún tramo calza, se cobra el precio
 * vigente (la oferta también es techo del precio base).
 */
export function precioUnitario(p: ProductoServidor, cantidad: number): number {
  return Math.min(precioPorCantidad(p.preciosPorVolumen, p.precio, cantidad), precioVigente(p));
}

// ------------------------------------------------------------
// Envío
// ------------------------------------------------------------
function zonaTarifaria(region: string): Zona {
  if (region === 'Aysén') return 'local';
  if (region === 'Los Lagos' || region === 'Magallanes') return 'austral';
  return 'nacional';
}

/** Costo de envío CLP (retiro en tienda = 0). Peso en kg. */
export function costoEnvio(metodo: MetodoEnvio, region: string | undefined, pesoKg: number): number {
  if (metodo === 'retiro_tienda') return 0;
  const zona = zonaTarifaria(region ?? '');
  const extra = Math.max(0, Math.ceil(pesoKg - KG_INCLUIDOS)) * RECARGO_KG;
  return TARIFAS[metodo][zona] + extra;
}

// ------------------------------------------------------------
// Validación de la solicitud (whitelist: todo lo demás se ignora)
// ------------------------------------------------------------
type Resultado<T> = { ok: true; datos: T } | { ok: false; error: string };

function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Texto recortado con largo máximo; null si no es string o queda vacío */
function texto(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const limpio = v.trim();
  if (!limpio || limpio.length > max) return null;
  return limpio;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Ids de documento Firestore seguros (sin barras ni "..")
const REGEX_ID_PRODUCTO = /^[A-Za-z0-9_-]{1,128}$/;

export function validarSolicitudPedido(cuerpo: unknown): Resultado<SolicitudPedido> {
  if (!esObjeto(cuerpo)) return { ok: false, error: 'Solicitud inválida.' };

  // Ítems
  if (!Array.isArray(cuerpo.items) || cuerpo.items.length === 0) {
    return { ok: false, error: 'El carrito está vacío.' };
  }
  if (cuerpo.items.length > LINEAS_MAXIMAS) {
    return { ok: false, error: `El pedido no puede tener más de ${LINEAS_MAXIMAS} productos distintos.` };
  }
  const cantidades = new Map<string, number>();
  for (const it of cuerpo.items) {
    if (!esObjeto(it)) return { ok: false, error: 'Producto inválido en el carrito.' };
    const { productoId, cantidad } = it;
    if (typeof productoId !== 'string' || !REGEX_ID_PRODUCTO.test(productoId)) {
      return { ok: false, error: 'Producto inválido en el carrito.' };
    }
    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > CANTIDAD_MAXIMA) {
      return { ok: false, error: `La cantidad de cada producto debe ser entre 1 y ${CANTIDAD_MAXIMA}.` };
    }
    cantidades.set(productoId, (cantidades.get(productoId) ?? 0) + cantidad);
  }
  for (const total of cantidades.values()) {
    if (total > CANTIDAD_MAXIMA) {
      return { ok: false, error: `La cantidad de cada producto debe ser entre 1 y ${CANTIDAD_MAXIMA}.` };
    }
  }

  // Cliente
  const nombreCliente = texto(cuerpo.nombreCliente, 120);
  if (!nombreCliente) return { ok: false, error: 'Falta tu nombre.' };
  const emailCliente = texto(cuerpo.emailCliente, 254);
  if (!emailCliente || !REGEX_EMAIL.test(emailCliente)) return { ok: false, error: 'El correo no es válido.' };

  // Métodos
  const metodoPago = cuerpo.metodoPago;
  if (typeof metodoPago !== 'string' || !(METODOS_PAGO as readonly string[]).includes(metodoPago)) {
    return { ok: false, error: 'Medio de pago no válido.' };
  }
  const metodoEnvio = cuerpo.metodoEnvio;
  if (typeof metodoEnvio !== 'string' || !(METODOS_ENVIO as readonly string[]).includes(metodoEnvio)) {
    return { ok: false, error: 'Método de entrega no válido.' };
  }

  // Dirección (solo para despacho)
  let direccion: DireccionPedido | undefined;
  if (metodoEnvio !== 'retiro_tienda') {
    const d = cuerpo.direccion;
    if (!esObjeto(d)) return { ok: false, error: 'Completa la dirección de despacho.' };
    const calle = texto(d.calle, 120);
    const comuna = texto(d.comuna, 80);
    const region = texto(d.region, 40);
    if (!calle || !comuna) return { ok: false, error: 'Completa la dirección de despacho.' };
    if (!region || !REGIONES_CHILE.includes(region)) return { ok: false, error: 'Región de despacho no válida.' };
    direccion = {
      id: texto(d.id, 64) ?? 'checkout',
      alias: texto(d.alias, 40) ?? 'Entrega',
      calle,
      numero: texto(d.numero, 20) ?? '',
      comuna,
      region,
    };
    const referencia = texto(d.referencia, 200);
    if (referencia) direccion.referencia = referencia;
  }

  // Cupón (opcional): vacío = sin cupón; con caracteres raros = error
  let cuponCodigo: string | undefined;
  if (typeof cuerpo.cuponCodigo === 'string' && cuerpo.cuponCodigo.trim()) {
    const normalizado = normalizarCodigoCupon(cuerpo.cuponCodigo);
    if (!normalizado) return { ok: false, error: 'El código de descuento no es válido.' };
    cuponCodigo = normalizado;
  }

  const datos: SolicitudPedido = {
    items: Array.from(cantidades, ([productoId, cantidad]) => ({ productoId, cantidad })),
    nombreCliente,
    emailCliente: emailCliente.toLowerCase(),
    metodoPago: metodoPago as MetodoPago,
    metodoEnvio: metodoEnvio as MetodoEnvio,
  };
  if (direccion) datos.direccion = direccion;
  if (cuponCodigo) datos.cuponCodigo = cuponCodigo;
  return { ok: true, datos };
}

// ------------------------------------------------------------
// Cálculo del pedido
// ------------------------------------------------------------
export type ResultadoCalculo =
  | {
    ok: true; items: ItemPedido[]; subtotal: number; costoEnvio: number;
    descuento: number; cuponCodigo?: string; total: number;
  }
  | { ok: false; codigo: 'stock' | 'no_disponible' | 'cupon'; mensaje: string; productoId?: string };

/**
 * Calcula ítems, subtotal, envío y total a partir de los productos
 * leídos de Firestore. Peso estimado: 1 kg por unidad (igual que el
 * checkout del frontend).
 */
export function calcularPedido(
  productos: ReadonlyMap<string, ProductoServidor>,
  lineas: { productoId: string; cantidad: number }[],
  metodoEnvio: MetodoEnvio,
  region: string | undefined,
  cupon?: Cupon,
  ahora: Date = new Date(),
): ResultadoCalculo {
  const items: ItemPedido[] = [];
  for (const { productoId, cantidad } of lineas) {
    const p = productos.get(productoId);
    if (!p || !p.activo) {
      return {
        ok: false, codigo: 'no_disponible', productoId,
        mensaje: `Uno de los productos de tu carrito${p ? ` ("${p.nombre}")` : ''} ya no está disponible. Quítalo del carrito para continuar.`,
      };
    }
    if (!p.bajoPedido && p.stock < cantidad) {
      return {
        ok: false, codigo: 'stock', productoId,
        mensaje: p.stock <= 0
          ? `"${p.nombre}" se agotó. Quítalo del carrito para continuar.`
          : `No nos alcanza el stock de "${p.nombre}": quedan ${p.stock} unidades. Baja la cantidad en el carrito.`,
      };
    }
    items.push({
      productoId: p.id,
      sku: p.sku,
      nombre: p.nombre,
      foto: p.fotos[0] ?? '',
      cantidad,
      precioUnitario: precioUnitario(p, cantidad),
      precioBase: p.precio,
      stockDisponible: p.stock,
      preciosPorVolumen: tramosConTecho(p),
    });
  }
  const subtotal = items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);
  const peso = items.reduce((acc, i) => acc + i.cantidad, 0);
  const envio = costoEnvio(metodoEnvio, region, peso);

  // Cupón: descuento sobre el subtotal, antes del envío
  let descuento = 0;
  if (cupon) {
    if (!cuponVigente(cupon, ahora)) {
      return { ok: false, codigo: 'cupon', mensaje: `El código "${cupon.codigo}" ya no está vigente. Quítalo para continuar.` };
    }
    descuento = calcularDescuento(cupon, subtotal);
    // Las pasarelas no cobran $0: un pedido gratis se coordina con la tienda
    if (subtotal - descuento + envio <= 0) {
      return { ok: false, codigo: 'cupon', mensaje: 'Este código deja el pedido sin costo. Escríbenos por WhatsApp para coordinarlo.' };
    }
  }
  const resultado: ResultadoCalculo = {
    ok: true, items, subtotal, costoEnvio: envio, descuento, total: subtotal - descuento + envio,
  };
  if (cupon) resultado.cuponCodigo = cupon.codigo;
  return resultado;
}

// ------------------------------------------------------------
// Id de pedido
// ------------------------------------------------------------
const ALFABETO_ID = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I: se dicta por teléfono

/**
 * PED-AAAAMMDD-XXXXXXXX con sufijo criptográfico (crypto.randomInt, sin
 * sesgo de módulo). El id funciona como token del seguimiento público.
 */
export function generarIdPedido(fecha: Date = new Date()): string {
  const dia = fecha.toISOString().slice(0, 10).replace(/-/g, '');
  let azar = '';
  for (let i = 0; i < 8; i++) azar += ALFABETO_ID[randomInt(ALFABETO_ID.length)];
  return `PED-${dia}-${azar}`;
}

// ------------------------------------------------------------
// Descuento de stock tras un pago confirmado (CN-015)
// ------------------------------------------------------------

/**
 * Calcula el stock resultante de cada producto al descontar un pedido.
 * Nunca deja stock negativo: si no alcanza, queda en 0 y se informa
 * `insuficiente` para que el admin lo vea (el pago ya fue cobrado, no
 * se rechaza). Productos inexistentes se omiten y también se informan.
 */
export function calcularDescuentoStock(
  items: { productoId: string; cantidad: number }[],
  stockActual: ReadonlyMap<string, number>,
): { nuevosStocks: Map<string, number>; insuficiente: boolean } {
  const pedidas = new Map<string, number>();
  for (const it of items) pedidas.set(it.productoId, (pedidas.get(it.productoId) ?? 0) + it.cantidad);
  const nuevosStocks = new Map<string, number>();
  let insuficiente = false;
  for (const [productoId, cantidad] of pedidas) {
    const actual = stockActual.get(productoId);
    if (actual === undefined) {
      insuficiente = true;
      continue;
    }
    if (actual < cantidad) insuficiente = true;
    nuevosStocks.set(productoId, Math.max(0, actual - cantidad));
  }
  return { nuevosStocks, insuficiente };
}
