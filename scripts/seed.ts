// ============================================================
// Script de seed: sube productos y categorías de ejemplo a
// Firestore. Requiere una clave de cuenta de servicio:
//
//   1. Consola Firebase > Configuración > Cuentas de servicio
//      > Generar nueva clave privada → guardar como
//      serviceAccountKey.json en la raíz del proyecto.
//   2. npm run seed
// ============================================================
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { CATEGORIAS_SEED, PRODUCTOS_SEED } from '../src/data/seed';

const rutaClave = resolve(process.cwd(), 'serviceAccountKey.json');

let credencial: Record<string, unknown>;
try {
  credencial = JSON.parse(readFileSync(rutaClave, 'utf8')) as Record<string, unknown>;
} catch {
  console.error(
    'No se encontró serviceAccountKey.json en la raíz del proyecto.\n' +
    'Descárgalo desde: Consola Firebase > Configuración del proyecto > Cuentas de servicio.',
  );
  process.exit(1);
}

initializeApp({ credential: cert(rutaClave) });
const db = getFirestore();

async function sembrar(): Promise<void> {
  console.log(`Proyecto: ${credencial.project_id as string}`);

  console.log(`Subiendo ${CATEGORIAS_SEED.length} categorías…`);
  for (const cat of CATEGORIAS_SEED) {
    const { id, ...datos } = cat;
    await db.collection('categorias').doc(id).set(datos);
  }

  console.log(`Subiendo ${PRODUCTOS_SEED.length} productos…`);
  for (const prod of PRODUCTOS_SEED) {
    const { id, ...datos } = prod;
    await db.collection('productos').doc(id).set(datos);
  }

  console.log('✔ Seed completado. El catálogo ya está disponible en Firestore.');
}

sembrar().catch((e) => {
  console.error('Error durante el seed:', e);
  process.exit(1);
});
