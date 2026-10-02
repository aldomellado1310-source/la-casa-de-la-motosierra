// ============================================================
// Lista blanca de orígenes del frontend (módulo puro).
// Se usa para CORS y para construir en el servidor las URLs de
// retorno de las pasarelas (nunca se aceptan URLs del cliente).
// ============================================================

/** Normaliza quitando la barra final */
function normalizar(origen: string): string {
  return origen.trim().replace(/\/+$/, '');
}

/** true si el origen coincide EXACTAMENTE con uno de la lista */
export function origenPermitido(origen: string | undefined, lista: readonly string[]): boolean {
  if (!origen) return false;
  const buscado = normalizar(origen);
  return lista.some((o) => normalizar(o) === buscado);
}

/** Origen a usar para la URL de retorno del pago */
export function origenRetorno(origen: string | undefined, lista: readonly string[]): string {
  if (origen && origenPermitido(origen, lista)) return normalizar(origen);
  return normalizar(lista[0] ?? '');
}
