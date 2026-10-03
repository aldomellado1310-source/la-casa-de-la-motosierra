// ============================================================
// Medios de pago activos. Se controlan sin tocar código:
//   VITE_FUNCTIONS_URL  → sin ella no hay pago en línea (solo transferencia)
//   VITE_PASARELAS      → pasarelas a mostrar, separadas por coma
//                         (p. ej. "flow" o "flow,webpay"; por defecto todas)
// En modo demo se muestran todas, simuladas.
// ============================================================
import { FUNCTIONS_URL, MODO_DEMO } from './firebase';

export type PasarelaEnLinea = 'webpay' | 'mercadopago' | 'flow';

const TODAS: readonly PasarelaEnLinea[] = ['flow', 'webpay', 'mercadopago'];

function pasarelasConfiguradas(): PasarelaEnLinea[] {
  const crudo = (import.meta.env.VITE_PASARELAS as string | undefined)?.trim();
  if (!crudo) return [...TODAS];
  const pedidas = crudo.split(',').map((p) => p.trim().toLowerCase());
  return TODAS.filter((p) => pedidas.includes(p));
}

/** Pasarelas que el checkout ofrece hoy (en el orden de TODAS) */
export const PASARELAS_ACTIVAS: readonly PasarelaEnLinea[] =
  MODO_DEMO ? TODAS : FUNCTIONS_URL ? pasarelasConfiguradas() : [];

/** true si hay al menos un medio de pago en línea */
export const PAGO_EN_LINEA = PASARELAS_ACTIVAS.length > 0;
