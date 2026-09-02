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

export interface FilaInventario {
  codigo: string;
  descripcion: string;
  precioVenta: string;
  precioMayoreo: string;
  inventario: string;
  departamento: string;
}

export interface ResultadoTransformacion {
  productos: Producto[];
  /** Filas no importadas (prueba/basura) */
  descartados: { codigo: string; motivo: string }[];
  /** Productos importados que el cliente debería revisar */
  revisar: { id: string; nombre: string; motivo: string }[];
}

const PLACEHOLDER = (sku: string) =>
  `https://placehold.co/600x600/FFFFFF/9AA09B/png?text=${encodeURIComponent(sku)}`;

/** Parsea el TSV (tab-separado, con cabecera). Sin comillas ni escapes. */
export function parsearTsv(contenido: string): FilaInventario[] {
  const lineas = contenido.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lineas.slice(1).map((linea) => {
    const c = linea.split('\t');
    return {
      codigo: (c[0] ?? '').trim(),
      descripcion: (c[1] ?? '').trim(),
      precioVenta: (c[3] ?? '').trim(),
      precioMayoreo: (c[4] ?? '').trim(),
      inventario: (c[5] ?? '').trim(),
      departamento: (c[7] ?? '').trim(),
    };
  });
}

function tramos(precio: number, mayoreo: number): { desde: number; hasta: number | null; precioUnitario: number }[] {
  if (mayoreo > 0 && mayoreo < precio) {
    return [
      { desde: 1, hasta: 9, precioUnitario: precio },
      { desde: 10, hasta: null, precioUnitario: mayoreo },
    ];
  }
  return [{ desde: 1, hasta: null, precioUnitario: precio }];
}

/** Ensambla un Producto a partir de una fila. `id` sin desambiguar. */
export function filaAProducto(fila: FilaInventario): Producto {
  const nombre = (fila.descripcion || fila.codigo).replace(/\s+/g, ' ').trim();
  const precio = parsearPrecio(fila.precioVenta);
  const mayoreo = parsearPrecio(fila.precioMayoreo);
  const marcas = extraerMarcas(nombre);
  const { categoria, subcategoria } = clasificar(fila.departamento, nombre);
  return {
    id: slugId(fila.codigo),
    sku: fila.codigo,
    nombre,
    descripcion: '',
    categoria,
    subcategoria,
    precio,
    stock: parsearStock(fila.inventario),
    fotos: [PLACEHOLDER(fila.codigo)],
    compatibilidades: marcas.map((marca): Compatibilidad => ({ marca, modelos: [] })),
    preciosPorVolumen: tramos(precio, mayoreo),
    destacado: false,
    activo: fila.departamento.trim().toUpperCase() !== 'MANO DE OBRA',
    bajoPedido: false,
  };
}

/** Orquesta: parsea, descarta basura, ensambla, desambigua ids, arma listas de revisión. */
export function transformarInventario(contenidoTsv: string): ResultadoTransformacion {
  const filas = parsearTsv(contenidoTsv);
  const productos: Producto[] = [];
  const descartados: ResultadoTransformacion['descartados'] = [];
  const revisar: ResultadoTransformacion['revisar'] = [];
  const idsVistos = new Map<string, number>();

  for (const fila of filas) {
    const precio = parsearPrecio(fila.precioVenta);
    if (precio <= 1) {
      descartados.push({ codigo: fila.codigo, motivo: `precio ${fila.precioVenta || '(vacío)'}` });
      continue;
    }
    const p = filaAProducto(fila);

    const previos = idsVistos.get(p.id) ?? 0;
    if (previos > 0) {
      p.id = `${p.id}-${previos + 1}`;
      revisar.push({ id: p.id, nombre: p.nombre, motivo: 'id duplicado por slug del código' });
    }
    idsVistos.set(slugId(fila.codigo), previos + 1);

    if (!fila.descripcion) {
      revisar.push({ id: p.id, nombre: p.nombre, motivo: 'sin descripción: el nombre es el código' });
    }
    productos.push(p);
  }

  return { productos, descartados, revisar };
}
