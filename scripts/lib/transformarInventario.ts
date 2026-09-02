// ============================================================
// Lógica pura de importación del inventario del cliente.
// Sin dependencias de Firebase ni del DOM: testeable con node:test.
// ============================================================
import type { Compatibilidad, Producto } from '../../src/types';

/** "$45,000" -> 45000 (quita todo lo que no sea dígito) */
export function parsearPrecio(valor: string): number {
  const n = parseInt(valor.replace(/[^\d]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

/** "2.00" -> 2 ; "N/A" -> 0 ; negativo -> 0 */
export function parsearStock(valor: string): number {
  const n = Math.floor(parseFloat(valor));
  return Number.isNaN(n) || n < 0 ? 0 : n;
}

/** Código del inventario -> id de documento estable (`inv-` + slug) */
export function slugId(codigo: string): string {
  const slug = codigo
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita acentos (ñ -> n, á -> a)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `inv-${slug}`;
}
