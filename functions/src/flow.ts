// ============================================================
// Flow (flow.cl): helpers puros de firma, llamadas HTTP con
// timeout/reintentos y evaluación de aprobación. Separado de
// index.ts para poder testear esta lógica sin inicializar
// Firebase Admin (ver flow.test.ts).
// (https://www.flow.cl/docs/api.html)
// ============================================================
import * as crypto from 'crypto';

/** Timeout por intento contra la API de Flow */
export const FLOW_TIMEOUT_MS = 10_000;
/** Reintentos ante timeout o error de red (no ante respuestas de Flow) */
export const FLOW_MAX_REINTENTOS = 2;

/** Firma un conjunto de parámetros con HMAC-SHA256, como exige Flow */
export function firmarFlow(params: Record<string, string>, secretKey: string): string {
  const claves = Object.keys(params).sort();
  const texto = claves.map((k) => `${k}${params[k]}`).join('');
  return crypto.createHmac('sha256', secretKey).update(texto).digest('hex');
}

/**
 * Un pago de Flow se considera aprobado solo si Flow reporta status
 * "pagada" (2) Y el monto pagado coincide con el total del pedido.
 * status: 1 pendiente, 2 pagada, 3 rechazada, 4 anulada.
 */
export function evaluarAprobacionFlow(status: number, montoFlow: number, totalPedido: number): boolean {
  return status === 2 && Math.round(montoFlow) === Math.round(totalPedido);
}

interface OpcionesLlamarFlow {
  /** Inyectable para tests; por defecto el fetch global de Node */
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  reintentos?: number;
}

/**
 * POST/GET autenticado contra la API de Flow (agrega apiKey + firma).
 * Reintenta con backoff ante timeout o error de red — condiciones
 * transitorias — pero NUNCA ante una respuesta HTTP de Flow (4xx/5xx),
 * que es determinista (p. ej. parámetros inválidos) y reintentarla no
 * cambiaría el resultado.
 */
export async function llamarFlow(
  ruta: string,
  params: Record<string, string>,
  metodo: 'GET' | 'POST',
  apiKey: string,
  secretKey: string,
  opciones: OpcionesLlamarFlow = {},
): Promise<Record<string, unknown>> {
  const {
    fetchImpl = fetch,
    timeoutMs = FLOW_TIMEOUT_MS,
    reintentos = FLOW_MAX_REINTENTOS,
  } = opciones;
  const baseUrl = process.env.FLOW_SANDBOX === 'true'
    ? 'https://sandbox.flow.cl/api'
    : 'https://www.flow.cl/api';
  const conApiKey = { ...params, apiKey };
  const s = firmarFlow(conApiKey, secretKey);
  const cuerpo = new URLSearchParams({ ...conApiKey, s });

  let ultimoError: unknown;
  for (let intento = 0; intento <= reintentos; intento++) {
    const controlador = new AbortController();
    const timer = setTimeout(() => controlador.abort(), timeoutMs);
    try {
      const res = metodo === 'GET'
        ? await fetchImpl(`${baseUrl}${ruta}?${cuerpo.toString()}`, { signal: controlador.signal })
        : await fetchImpl(`${baseUrl}${ruta}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: cuerpo.toString(),
          signal: controlador.signal,
        });
      const datos = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        // Respuesta determinista de Flow: no vale la pena reintentar
        throw new Error(`Flow respondió ${res.status}: ${JSON.stringify(datos)}`);
      }
      return datos;
    } catch (e) {
      const esTimeout = e instanceof Error && e.name === 'AbortError';
      const esErrorDeRed = e instanceof TypeError; // fetch falló: DNS, conexión, etc.
      if (!esTimeout && !esErrorDeRed) throw e; // error de Flow: no reintentar
      ultimoError = esTimeout ? new Error(`Flow no respondió en ${timeoutMs} ms (timeout)`) : e;
      if (intento < reintentos) {
        await new Promise((resolver) => setTimeout(resolver, 300 * 2 ** intento)); // 300ms, 600ms…
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw ultimoError instanceof Error
    ? new Error(`Flow no respondió tras ${reintentos + 1} intento(s): ${ultimoError.message}`)
    : new Error(`Flow no respondió tras ${reintentos + 1} intento(s)`);
}
