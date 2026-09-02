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

// Sin `\b` final tras los prefijos de modelo: "HQV61", "MS250C" deben matchear.
const PATRONES_MARCA: { marca: string; re: RegExp }[] = [
  { marca: 'Stihl', re: /\bSTIHL\b|\bSTHIL\b|\bMS\s?\d{2,3}|\bFS\s?\d{2,3}|\bST0\d\d/i },
  { marca: 'Husqvarna', re: /\bHUSQVARNA\b|\bHQV/i },
  { marca: 'Honda', re: /\bHONDA\b|\bGX\s?\d{2,3}/i },
  { marca: 'Toyama', re: /\bTOYAMA\b/i },
  { marca: 'Echo', re: /\bECHO\b/i },
  { marca: 'Castor', re: /\bCASTOR\b/i },
  { marca: 'Genérica/China', re: /\bCHIN[AO]S?\b|\bGEN[EÉ]RIC[AO]\b/i },
];

/** Marcas de máquina detectadas en el nombre (puede ser []) */
export function extraerMarcas(nombre: string): string[] {
  return PATRONES_MARCA.filter(({ re }) => re.test(nombre)).map(({ marca }) => marca);
}

type Clasif = { categoria: string; subcategoria: string };

const MAPA_DEPTO: Record<string, Clasif> = {
  CARBURADORES: { categoria: 'carburacion-arranque', subcategoria: 'Carburadores' },
  MEMBRANAS: { categoria: 'carburacion-arranque', subcategoria: 'Kits de reparación' },
  CODOS: { categoria: 'carburacion-arranque', subcategoria: 'Kits de reparación' },
  'MANGUERA BENCINA': { categoria: 'carburacion-arranque', subcategoria: 'Kits de reparación' },
  'RESORTE DE ARRANQUE': { categoria: 'carburacion-arranque', subcategoria: 'Arranque' },
  'MANGO DE PARTIDA': { categoria: 'carburacion-arranque', subcategoria: 'Arranque' },
  'FILTRO DE AIRE': { categoria: 'filtros-bujias', subcategoria: 'Filtros de aire' },
  'FILTROS BENCINA': { categoria: 'filtros-bujias', subcategoria: 'Filtros de combustible' },
  BUJIA: { categoria: 'filtros-bujias', subcategoria: 'Bujías' },
  PISTONES: { categoria: 'repuestos-varios', subcategoria: 'Pistones y cilindros' },
  ANILLOS: { categoria: 'repuestos-varios', subcategoria: 'Pistones y cilindros' },
  EMPAQUETADURA: { categoria: 'repuestos-varios', subcategoria: 'Pistones y cilindros' },
  EMBRAGUES: { categoria: 'repuestos-varios', subcategoria: 'Embragues' },
  TAMBORES: { categoria: 'repuestos-varios', subcategoria: 'Embragues' },
  'PIÑONES': { categoria: 'espadas-cadenas', subcategoria: 'Piñones' },
  CADENAS: { categoria: 'espadas-cadenas', subcategoria: 'Cadenas' },
  ESPADA: { categoria: 'espadas-cadenas', subcategoria: 'Espadas' },
  'TENSOR/PERNO/REGULDR': { categoria: 'espadas-cadenas', subcategoria: 'Espadas' },
  CABEZAL: { categoria: 'desbrozadoras', subcategoria: 'Accesorios de corte' },
  'SIN FIN': { categoria: 'desbrozadoras', subcategoria: 'Accesorios de corte' },
  LIMAS: { categoria: 'herramientas-seguridad', subcategoria: 'Afilado' },
  BOBINAS: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  'BOMBA ACEITE': { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  RETENES: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  RODAMIENTOS: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  POLEAS: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  AVR: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  AMORTIGUADORES: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  'MANO DE OBRA': { categoria: 'repuestos-varios', subcategoria: 'Otros' },
};

const REGLAS_NOMBRE: { re: RegExp; clasif: Clasif }[] = [
  { re: /ACEITE.*MEZCLA|MEZCLA.*ACEITE|\b2T\b/i, clasif: { categoria: 'aceites-lubricantes', subcategoria: 'Aceite de mezcla 2T' } },
  { re: /ACEITE.*CADENA/i, clasif: { categoria: 'aceites-lubricantes', subcategoria: 'Aceite de cadena' } },
  { re: /ACEITE|LUBRICANTE|GRASA/i, clasif: { categoria: 'aceites-lubricantes', subcategoria: 'Grasas' } },
  { re: /CADENA/i, clasif: { categoria: 'espadas-cadenas', subcategoria: 'Cadenas' } },
  { re: /ESPADA|\bBARRA\b/i, clasif: { categoria: 'espadas-cadenas', subcategoria: 'Espadas' } },
  { re: /PI[ÑN]ON/i, clasif: { categoria: 'espadas-cadenas', subcategoria: 'Piñones' } },
  { re: /FILTRO.*AIRE/i, clasif: { categoria: 'filtros-bujias', subcategoria: 'Filtros de aire' } },
  { re: /FILTRO/i, clasif: { categoria: 'filtros-bujias', subcategoria: 'Filtros de combustible' } },
  { re: /BUJIA/i, clasif: { categoria: 'filtros-bujias', subcategoria: 'Bujías' } },
  { re: /CARBURADOR|CARBURACION/i, clasif: { categoria: 'carburacion-arranque', subcategoria: 'Carburadores' } },
  { re: /ARRANQUE|PARTIDA|RESORTE|PIOLA|MANILLA/i, clasif: { categoria: 'carburacion-arranque', subcategoria: 'Arranque' } },
  { re: /CABEZAL|N[AY]LON|DESBROZ|DESMALEZ|ORILLAD|\bHILO\b/i, clasif: { categoria: 'desbrozadoras', subcategoria: 'Accesorios de corte' } },
  { re: /CASCO|PROTECTOR|GUANTE|ANTIPARRA|SALVAMANO|ARNES|FACIAL|OREJERA/i, clasif: { categoria: 'herramientas-seguridad', subcategoria: 'EPP' } },
  { re: /\bLIMA\b|AFILAD|ESMERIL/i, clasif: { categoria: 'herramientas-seguridad', subcategoria: 'Afilado' } },
  { re: /PISTON|CILINDRO|ANILLO/i, clasif: { categoria: 'repuestos-varios', subcategoria: 'Pistones y cilindros' } },
  { re: /EMBRAGUE|CAMPANA/i, clasif: { categoria: 'repuestos-varios', subcategoria: 'Embragues' } },
];

const CLASIF_FALLBACK: Clasif = { categoria: 'repuestos-varios', subcategoria: 'Otros' };

/** categoria/subcategoria del sitio a partir del departamento del inventario y el nombre */
export function clasificar(departamento: string, nombre: string): Clasif {
  const depto = departamento.trim().toUpperCase();
  if (depto in MAPA_DEPTO) return MAPA_DEPTO[depto];
  for (const { re, clasif } of REGLAS_NOMBRE) {
    if (re.test(nombre)) return clasif;
  }
  return CLASIF_FALLBACK;
}
