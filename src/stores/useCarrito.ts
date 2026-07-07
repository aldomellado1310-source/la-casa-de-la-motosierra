// ============================================================
// Store del carrito (Zustand + persist).
// - Persiste en localStorage siempre (funciona sin sesión).
// - Para usuarios logueados se sincroniza además en Firestore
//   (carritos/{uid}) para retomarlo desde otro dispositivo.
// - El precio unitario se recalcula por tramos de volumen.
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { MODO_DEMO, db } from '../config/firebase';
import { precioPorCantidad, precioVigente } from '../utils/precio';
import type { ItemCarrito, Producto } from '../types';

interface EstadoCarrito {
  items: ItemCarrito[];
  /** uid con el que está sincronizado el carrito (o null) */
  uidSincronizado: string | null;
  agregar: (producto: Producto, cantidad: number) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  quitar: (productoId: string) => void;
  vaciar: () => void;
  /** Total CLP con precios por volumen aplicados */
  total: () => number;
  /** Cantidad total de unidades (para el badge del header) */
  unidades: () => number;
  /** Sincroniza con Firestore al iniciar/cerrar sesión */
  sincronizarConUsuario: (uid: string | null) => Promise<void>;
}

/** Recalcula el precio unitario de un ítem según su cantidad */
function conPrecioRecalculado(item: ItemCarrito): ItemCarrito {
  return {
    ...item,
    precioUnitario: precioPorCantidad(item.preciosPorVolumen, item.precioBase, item.cantidad),
  };
}

/** Guarda el carrito del usuario en Firestore (best-effort) */
async function guardarEnFirestore(uid: string, items: ItemCarrito[]): Promise<void> {
  if (MODO_DEMO || !db) return;
  try {
    await setDoc(doc(db, 'carritos', uid), { items, actualizado: new Date().toISOString() });
  } catch (e) {
    console.warn('No se pudo sincronizar el carrito:', e);
  }
}

export const useCarrito = create<EstadoCarrito>()(
  persist(
    (set, get) => ({
      items: [],
      uidSincronizado: null,

      agregar: (producto, cantidad) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.productoId === producto.id);
        if (idx >= 0) {
          const nuevaCantidad = Math.min(items[idx].cantidad + cantidad, producto.stock || 999);
          items[idx] = conPrecioRecalculado({ ...items[idx], cantidad: nuevaCantidad });
        } else {
          // El precio de oferta actúa como techo de todos los tramos
          const vigente = precioVigente(producto);
          items.push(
            conPrecioRecalculado({
              productoId: producto.id,
              sku: producto.sku,
              nombre: producto.nombre,
              foto: producto.fotos[0] ?? '',
              cantidad,
              precioUnitario: vigente,
              precioBase: producto.precio,
              stockDisponible: producto.stock,
              preciosPorVolumen: producto.preciosPorVolumen.map((t) => ({
                ...t,
                precioUnitario: Math.min(t.precioUnitario, vigente),
              })),
            }),
          );
        }
        set({ items });
        const uid = get().uidSincronizado;
        if (uid) void guardarEnFirestore(uid, items);
      },

      cambiarCantidad: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().quitar(productoId);
          return;
        }
        const items = get().items.map((i) =>
          i.productoId === productoId
            ? conPrecioRecalculado({ ...i, cantidad: Math.min(cantidad, i.stockDisponible || 999) })
            : i,
        );
        set({ items });
        const uid = get().uidSincronizado;
        if (uid) void guardarEnFirestore(uid, items);
      },

      quitar: (productoId) => {
        const items = get().items.filter((i) => i.productoId !== productoId);
        set({ items });
        const uid = get().uidSincronizado;
        if (uid) void guardarEnFirestore(uid, items);
      },

      vaciar: () => {
        set({ items: [] });
        const uid = get().uidSincronizado;
        if (uid) void guardarEnFirestore(uid, []);
      },

      total: () => get().items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0),

      unidades: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      sincronizarConUsuario: async (uid) => {
        if (!uid) {
          set({ uidSincronizado: null });
          return;
        }
        set({ uidSincronizado: uid });
        if (MODO_DEMO || !db) return;
        try {
          const snap = await getDoc(doc(db, 'carritos', uid));
          const local = get().items;
          if (snap.exists() && local.length === 0) {
            // Retomar carrito guardado si el local está vacío
            const remoto = (snap.data() as { items: ItemCarrito[] }).items ?? [];
            set({ items: remoto });
          } else if (local.length > 0) {
            // El carrito local manda: lo subimos
            await guardarEnFirestore(uid, local);
          }
        } catch (e) {
          console.warn('No se pudo recuperar el carrito remoto:', e);
        }
      },
    }),
    { name: 'carrito-lcm' },
  ),
);
