// ============================================================
// Validación del comprobante de transferencia antes de mostrarlo
// en el panel admin (CN-002). El campo `comprobanteUrl` lo escribe
// el cliente, así que la UI se defiende sola aunque las reglas de
// Firestore también lo restrinjan.
//
// Desde que el comprobante se guarda como RUTA de Storage (no URL),
// el panel nunca usa el valor como href: pide la URL de descarga con
// el SDK (solo el admin tiene lectura en comprobantes/).
//
// Función pura (sin import.meta.env ni Firebase) para testearla
// con node:test.
// ============================================================

export interface OpcionesRutaComprobante {
  /** Id del pedido al que debe pertenecer el comprobante */
  pedidoId: string;
  /** true en MODO_DEMO (sin Firebase) */
  modoDemo: boolean;
}

/** Mismo patrón de nombre que exige firestore.rules y genera subirComprobante */
const NOMBRE_ARCHIVO = /^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$/;

/** Nombre simple para el modo demo: sin barras ni caracteres de control */
const NOMBRE_DEMO = /^[^/\\\u0000-\u001f\u007f]{1,200}$/;

/**
 * true solo si `valor` es un comprobante guardado por el flujo de la tienda:
 * - Firebase: `comprobantes/<pedidoId>/<archivo>`, con el id de ESTE pedido.
 * - Demo: `demo://<nombre>` (no se sube nada), solo en modo demo.
 */
export function esRutaComprobanteValida(valor: unknown, opciones: OpcionesRutaComprobante): boolean {
  if (typeof valor !== 'string' || valor.length === 0) return false;

  if (valor.startsWith('demo://')) {
    return opciones.modoDemo && NOMBRE_DEMO.test(valor.slice('demo://'.length));
  }

  // Comparación por partes (no regex con el id interpolado)
  const partes = valor.split('/');
  if (partes.length !== 3) return false;
  const [carpeta, pedidoId, archivo] = partes;
  return carpeta === 'comprobantes' && pedidoId === opciones.pedidoId && NOMBRE_ARCHIVO.test(archivo);
}
