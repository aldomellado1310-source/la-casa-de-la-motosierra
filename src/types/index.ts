// ============================================================
// Tipos del dominio — La Casa de la Motosierra
// ============================================================

/** Tramo de precio por volumen (modelo mayorista transparente) */
export interface TramoPrecio {
  /** Cantidad mínima del tramo (ej: 1, 10, 40) */
  desde: number;
  /** Cantidad máxima del tramo; null = sin tope */
  hasta: number | null;
  /** Precio unitario CLP para este tramo */
  precioUnitario: number;
}

/** Producto del catálogo (colección `productos`) */
export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  subcategoria: string;
  /** Precio unitario base en CLP (IVA incluido) */
  precio: number;
  /** Precio de oferta CLP; si existe y es menor a `precio`, el producto está en oferta */
  precioOferta?: number;
  /** Stock real disponible */
  stock: number;
  /** URLs de fotos (Firebase Storage o placeholder) */
  fotos: string[];
  /** Marcas de máquina compatibles (ej: Stihl, Husqvarna) */
  marcasCompatibles: string[];
  /** Modelos compatibles (ej: MS 250, 236) */
  modelosCompatibles: string[];
  /** Tramos de descuento por cantidad */
  preciosPorVolumen: TramoPrecio[];
  destacado: boolean;
  activo: boolean;
  /** Permite venta bajo pedido cuando stock = 0 */
  bajoPedido?: boolean;
}

/** Estado de stock derivado para la UI */
export type EstadoStock = 'en_stock' | 'ultimas_unidades' | 'agotado' | 'bajo_pedido';

/** Categoría del catálogo (colección `categorias`) */
export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  subcategorias: string[];
  orden: number;
}

/** Dirección guardada del usuario */
export interface Direccion {
  id: string;
  alias: string;         // ej: "Casa", "Taller"
  calle: string;
  numero: string;
  comuna: string;
  region: string;
  referencia?: string;
}

/** Máquina registrada por el cliente ("Mi máquina") */
export interface MaquinaCliente {
  id: string;
  marca: string;
  modelo: string;
}

/** Perfil de usuario (colección `usuarios/{uid}`) */
export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  telefono?: string;
  tipo: 'particular' | 'empresa';
  /** Solo cuentas empresa/taller */
  rut?: string;
  razonSocial?: string;
  direcciones: Direccion[];
  /** Máquinas del cliente para filtrar compatibilidad de un clic */
  maquinas?: MaquinaCliente[];
  /** Rol administrativo */
  rol?: 'admin' | 'cliente';
}

/** Ítem del carrito / pedido / cotización */
export interface ItemCarrito {
  productoId: string;
  sku: string;
  nombre: string;
  foto: string;
  cantidad: number;
  /** Precio unitario aplicado según tramo de volumen */
  precioUnitario: number;
  /** Precio base de referencia (para mostrar el descuento) */
  precioBase: number;
  stockDisponible: number;
  preciosPorVolumen: TramoPrecio[];
}

export type MetodoPago = 'webpay' | 'mercadopago' | 'flow' | 'transferencia';

export type MetodoEnvio = 'retiro_tienda' | 'starken' | 'chilexpress' | 'bluexpress';

export type EstadoPedido =
  | 'pendiente_pago'
  | 'pendiente_validacion' // transferencia con comprobante subido
  | 'pagado'
  | 'preparando'
  | 'despachado'
  | 'listo_retiro'
  | 'entregado'
  | 'cancelado';

/** Pedido (colección `pedidos`) */
export interface Pedido {
  id: string;
  uid: string;
  nombreCliente: string;
  emailCliente: string;
  items: ItemCarrito[];
  subtotal: number;
  costoEnvio: number;
  /** Descuento aplicado en CLP (cupón), ya restado del total */
  descuento?: number;
  /** Código del cupón aplicado, si hubo */
  cuponCodigo?: string;
  total: number;
  metodoPago: MetodoPago;
  metodoEnvio: MetodoEnvio;
  direccion?: Direccion;
  estado: EstadoPedido;
  fecha: string; // ISO
  /** URL comprobante de transferencia (Storage) */
  comprobanteUrl?: string;
  /** Token/orden de la pasarela */
  referenciaPago?: string;
  /** true cuando el stock de los items ya fue descontado (evita doble descuento) */
  stockDescontado?: boolean;
}

/** Cupón de descuento (colección `cupones`, id = código en mayúsculas) */
export interface Cupon {
  codigo: string;
  tipo: 'porcentaje' | 'monto';
  /** % (1-100) si tipo=porcentaje, o monto CLP si tipo=monto */
  valor: number;
  activo: boolean;
  descripcion?: string;
  /** Fecha ISO de expiración; sin tope si no se define */
  fechaExpiracion?: string;
}

export type EstadoCotizacion = 'enviada' | 'aprobada' | 'convertida' | 'vencida';

/** Cotización formal (colección `cotizaciones`) */
export interface Cotizacion {
  id: string;
  uid: string;
  folio: string;      // ej: COT-2026-0001
  nombreCliente: string;
  emailCliente: string;
  rut?: string;
  razonSocial?: string;
  items: ItemCarrito[];
  neto: number;
  iva: number;
  total: number;
  estado: EstadoCotizacion;
  fecha: string;      // ISO
  validaHasta: string; // ISO
  observaciones?: string;
  pdfUrl?: string;
}

/** Solicitud "avísame cuando llegue" (colección `avisosStock`) */
export interface AvisoStock {
  id: string;
  productoId: string;
  sku: string;
  email: string;
  fecha: string;
  notificado: boolean;
}
