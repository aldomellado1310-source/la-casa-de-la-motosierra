// ============================================================
// Importador del inventario del cliente.
//
//   npm run importar-inventario                  regenera src/data/seed.ts
//   npm run importar-inventario -- --push        + sube a Firestore
//   npm run importar-inventario -- --push --solo-stock
//                                                solo actualiza stock/precio
//                                                de los docs ya existentes
//
// --push requiere serviceAccountKey.json en la raíz (ver scripts/seed.ts).
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { transformarInventario } from './lib/transformarInventario';
import type { Categoria, Producto } from '../src/types';

const RUTA_TSV = resolve(process.cwd(), 'scripts/datos/inventario.tsv');
const RUTA_SEED = resolve(process.cwd(), 'src/data/seed.ts');

/** Marcas de máquinas soportadas por el buscador de compatibilidad */
const MARCAS_MAQUINA = ['Stihl', 'Husqvarna', 'Honda', 'Toyama', 'Echo', 'Castor', 'Genérica/China'] as const;

/** Categorías del catálogo. Fuente única: se serializa al seed y se sube a Firestore. */
const CATEGORIAS_SEED: Categoria[] = [
  { id: 'motosierras', nombre: 'Motosierras', slug: 'motosierras', subcategorias: ['Profesionales', 'Semi-profesionales', 'Domésticas'], orden: 1 },
  { id: 'desbrozadoras', nombre: 'Desbrozadoras/Orilladoras', slug: 'desbrozadoras', subcategorias: ['Desbrozadoras', 'Orilladoras', 'Accesorios de corte'], orden: 2 },
  { id: 'espadas-cadenas', nombre: 'Espadas y Cadenas', slug: 'espadas-cadenas', subcategorias: ['Cadenas', 'Espadas', 'Piñones'], orden: 3 },
  { id: 'filtros-bujias', nombre: 'Filtros y Bujías', slug: 'filtros-bujias', subcategorias: ['Filtros de aire', 'Filtros de combustible', 'Bujías'], orden: 4 },
  { id: 'carburacion-arranque', nombre: 'Carburación y Arranque', slug: 'carburacion-arranque', subcategorias: ['Carburadores', 'Kits de reparación', 'Arranque'], orden: 5 },
  { id: 'aceites-lubricantes', nombre: 'Aceites y Lubricantes', slug: 'aceites-lubricantes', subcategorias: ['Aceite de mezcla 2T', 'Aceite de cadena', 'Grasas'], orden: 6 },
  { id: 'herramientas-seguridad', nombre: 'Herramientas y Seguridad', slug: 'herramientas-seguridad', subcategorias: ['Afilado', 'EPP', 'Herramientas'], orden: 7 },
  { id: 'repuestos-varios', nombre: 'Repuestos Varios', slug: 'repuestos-varios', subcategorias: ['Pistones y cilindros', 'Embragues', 'Otros'], orden: 8 },
];

function generarSeed(productos: Producto[]): string {
  return `// ============================================================
// ARCHIVO GENERADO por scripts/importar-inventario.ts — NO EDITAR A MANO.
// Fuente: scripts/datos/inventario.tsv
// Para regenerar: npm run importar-inventario
// ============================================================
import type { Categoria, Producto } from '../types';

export const CATEGORIAS_SEED: Categoria[] = ${JSON.stringify(CATEGORIAS_SEED, null, 2)};

/** Marcas de máquinas soportadas por el buscador de compatibilidad */
export const MARCAS_MAQUINA = ${JSON.stringify(MARCAS_MAQUINA)} as const;

export const PRODUCTOS_SEED: Producto[] = ${JSON.stringify(productos, null, 2)};
`;
}

async function subir(productos: Producto[], soloStock: boolean): Promise<void> {
  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const rutaClave = resolve(process.cwd(), 'serviceAccountKey.json');
  let credencial: Record<string, unknown>;
  try {
    credencial = JSON.parse(readFileSync(rutaClave, 'utf8')) as Record<string, unknown>;
  } catch {
    console.error('No se encontró serviceAccountKey.json en la raíz del proyecto.');
    process.exit(1);
  }
  initializeApp({ credential: cert(rutaClave) });
  const db = getFirestore();
  console.log(`Proyecto: ${credencial.project_id as string}`);

  if (soloStock) {
    let ok = 0;
    const faltantes: string[] = [];
    for (const p of productos) {
      const ref = db.collection('productos').doc(p.id);
      const snap = await ref.get();
      if (!snap.exists) { faltantes.push(p.id); continue; }
      await ref.update({ stock: p.stock, precio: p.precio, preciosPorVolumen: p.preciosPorVolumen });
      ok++;
    }
    console.log(`✔ Stock/precio actualizado en ${ok} productos.`);
    if (faltantes.length) console.log(`  ${faltantes.length} ids del inventario no existen en Firestore: ${faltantes.slice(0, 10).join(', ')}${faltantes.length > 10 ? '…' : ''}`);
    return;
  }

  // Categorías
  for (const cat of CATEGORIAS_SEED) {
    const { id, ...datos } = cat;
    await db.collection('categorias').doc(id).set(datos);
  }
  console.log(`✔ ${CATEGORIAS_SEED.length} categorías subidas.`);

  // Productos en lotes de 450
  for (let i = 0; i < productos.length; i += 450) {
    const lote = db.batch();
    for (const p of productos.slice(i, i + 450)) {
      const { id, ...datos } = p;
      lote.set(db.collection('productos').doc(id), datos);
    }
    await lote.commit();
  }
  console.log(`✔ ${productos.length} productos subidos a Firestore.`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const push = args.includes('--push');
  const soloStock = args.includes('--solo-stock');

  const tsv = readFileSync(RUTA_TSV, 'utf8');
  const { productos, descartados, revisar } = transformarInventario(tsv);

  console.log(`\nInventario: ${productos.length} productos (${productos.filter((p) => p.activo).length} activos)`);
  console.log(`Descartados: ${descartados.length}`);
  const porCat = new Map<string, number>();
  productos.forEach((p) => porCat.set(p.categoria, (porCat.get(p.categoria) ?? 0) + 1));
  [...porCat.entries()].sort().forEach(([c, n]) => console.log(`  ${c}: ${n}`));
  if (revisar.length) {
    console.log(`\nRevisar (${revisar.length}):`);
    revisar.slice(0, 30).forEach((r) => console.log(`  ${r.id} — ${r.nombre} — ${r.motivo}`));
    if (revisar.length > 30) console.log(`  …y ${revisar.length - 30} más`);
  }

  if (!soloStock) {
    writeFileSync(RUTA_SEED, generarSeed(productos), 'utf8');
    console.log(`\n✔ ${RUTA_SEED} regenerado.`);
  }

  if (push) await subir(productos, soloStock);
  else console.log('\n(Sin --push: no se tocó Firestore.)');
}

main().catch((e) => { console.error(e); process.exit(1); });
