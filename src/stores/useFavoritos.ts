// ============================================================
// Store de favoritos (Zustand + persist en localStorage).
// Guarda solo los ids de producto; la página /favoritos los
// resuelve contra el catálogo.
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EstadoFavoritos {
  ids: string[];
  esFavorito: (productoId: string) => boolean;
  alternar: (productoId: string) => void;
}

export const useFavoritos = create<EstadoFavoritos>()(
  persist(
    (set, get) => ({
      ids: [],
      esFavorito: (productoId) => get().ids.includes(productoId),
      alternar: (productoId) => {
        const ids = get().ids;
        set({
          ids: ids.includes(productoId)
            ? ids.filter((id) => id !== productoId)
            : [...ids, productoId],
        });
      },
    }),
    { name: 'favoritos-lcm' },
  ),
);
