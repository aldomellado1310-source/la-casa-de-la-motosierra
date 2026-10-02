// ============================================================
// Aviso breve (toast) de confirmación: "Agregado al carrito".
// Un solo aviso a la vez; se oculta solo a los pocos segundos.
// ============================================================
import { create } from 'zustand';

interface EstadoAviso {
  texto: string | null;
  /** Contador para reiniciar la animación si se repite el mismo texto */
  version: number;
  mostrar: (texto: string) => void;
  ocultar: () => void;
}

let temporizador: ReturnType<typeof setTimeout> | undefined;

export const useAviso = create<EstadoAviso>()((set, get) => ({
  texto: null,
  version: 0,
  mostrar: (texto) => {
    clearTimeout(temporizador);
    set({ texto, version: get().version + 1 });
    temporizador = setTimeout(() => set({ texto: null }), 4000);
  },
  ocultar: () => {
    clearTimeout(temporizador);
    set({ texto: null });
  },
}));
