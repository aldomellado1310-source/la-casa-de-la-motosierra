// ============================================================
// Servicio de catálogo: lee productos y categorías desde
// Firestore, o desde el seed local en MODO DEMO.
// ============================================================
import {
  collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { MODO_DEMO, db } from '../config/firebase';
import { CATEGORIAS_SEED, PRODUCTOS_SEED } from '../data/seed';
import type { Categoria, Producto } from '../types';

// Cache en memoria para no re-leer el catálogo en cada navegación
let cacheProductos: Producto[] | null = null;

/** Obtiene todos los productos activos */
export async function obtenerProductos(incluirInactivos = false): Promise<Producto[]> {
  if (MODO_DEMO) {
    return PRODUCTOS_SEED.filter((p) => incluirInactivos || p.activo);
  }
  if (!cacheProductos) {
    const snap = await getDocs(collection(db!, 'productos'));
    cacheProductos = snap.docs.map((d) => ({ ...(d.data() as Producto), id: d.id }));
  }
  return cacheProductos.filter((p) => incluirInactivos || p.activo);
}

/** Invalida el cache (tras ediciones del admin) */
export function invalidarCacheProductos(): void {
  cacheProductos = null;
}

/** Obtiene un producto por id */
export async function obtenerProducto(id: string): Promise<Producto | null> {
  const todos = await obtenerProductos(true);
  return todos.find((p) => p.id === id) ?? null;
}

/** Obtiene el árbol de categorías */
export async function obtenerCategorias(): Promise<Categoria[]> {
  if (MODO_DEMO) return CATEGORIAS_SEED;
  const snap = await getDocs(collection(db!, 'categorias'));
  const cats = snap.docs.map((d) => ({ ...(d.data() as Categoria), id: d.id }));
  return cats.sort((a, b) => a.orden - b.orden);
}

/** Todas las marcas presentes en el catálogo (para el buscador de compatibilidad) */
export async function obtenerMarcasCompatibles(): Promise<string[]> {
  const productos = await obtenerProductos();
  const marcas = new Set<string>();
  productos.forEach((p) => p.marcasCompatibles.forEach((m) => marcas.add(m)));
  return [...marcas].sort();
}

/** Modelos disponibles para una marca dada */
export async function obtenerModelosPorMarca(marca: string): Promise<string[]> {
  const productos = await obtenerProductos();
  const modelos = new Set<string>();
  productos
    .filter((p) => p.marcasCompatibles.includes(marca))
    .forEach((p) => p.modelosCompatibles.forEach((m) => modelos.add(m)));
  return [...modelos].sort();
}

/**
 * Buscador por compatibilidad de máquina (filtro estructurado).
 * Un producto sin modelos declarados pero con la marca compatible
 * (consumibles universales) también se incluye.
 */
export async function buscarPorCompatibilidad(marca: string, modelo?: string): Promise<Producto[]> {
  const productos = await obtenerProductos();
  return productos.filter((p) => {
    if (!p.marcasCompatibles.includes(marca)) return false;
    if (!modelo) return true;
    return p.modelosCompatibles.length === 0 || p.modelosCompatibles.includes(modelo);
  });
}

/** Búsqueda de texto libre por nombre y SKU */
export async function buscarPorTexto(texto: string): Promise<Producto[]> {
  const q = texto.trim().toLowerCase();
  if (!q) return [];
  const productos = await obtenerProductos();
  return productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q),
  );
}

// ---------- Operaciones de administración ----------

/** Crea o actualiza un producto (solo admin) */
export async function guardarProducto(producto: Producto): Promise<void> {
  if (MODO_DEMO) {
    const idx = PRODUCTOS_SEED.findIndex((p) => p.id === producto.id);
    if (idx >= 0) PRODUCTOS_SEED[idx] = producto;
    else PRODUCTOS_SEED.push(producto);
    return;
  }
  const { id, ...datos } = producto;
  await setDoc(doc(db!, 'productos', id), datos);
  invalidarCacheProductos();
}

/** Elimina un producto (solo admin) */
export async function eliminarProducto(id: string): Promise<void> {
  if (MODO_DEMO) {
    const idx = PRODUCTOS_SEED.findIndex((p) => p.id === id);
    if (idx >= 0) PRODUCTOS_SEED.splice(idx, 1);
    return;
  }
  await deleteDoc(doc(db!, 'productos', id));
  invalidarCacheProductos();
}

/** Ajusta el stock de un producto (solo admin / post-venta) */
export async function ajustarStock(id: string, nuevoStock: number): Promise<void> {
  if (MODO_DEMO) {
    const p = PRODUCTOS_SEED.find((x) => x.id === id);
    if (p) p.stock = nuevoStock;
    return;
  }
  await updateDoc(doc(db!, 'productos', id), { stock: nuevoStock });
  invalidarCacheProductos();
}

/** Registra un "avísame cuando llegue" */
export async function registrarAvisoStock(productoId: string, sku: string, email: string): Promise<void> {
  if (MODO_DEMO) {
    console.info(`[DEMO] Aviso de stock registrado: ${sku} → ${email}`);
    return;
  }
  const ref = doc(collection(db!, 'avisosStock'));
  await setDoc(ref, {
    productoId, sku, email,
    fecha: new Date().toISOString(),
    notificado: false,
  });
}

/** Productos cuyo stock volvió y tienen avisos pendientes (para el admin) */
export async function obtenerAvisosPendientes(): Promise<{ sku: string; email: string; fecha: string }[]> {
  if (MODO_DEMO) return [];
  const snap = await getDocs(query(collection(db!, 'avisosStock'), where('notificado', '==', false)));
  return snap.docs.map((d) => d.data() as { sku: string; email: string; fecha: string });
}
