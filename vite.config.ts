import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite — build optimizado para conexiones lentas (zona extrema)
export default defineConfig({
  plugins: [react()],
  build: {
    // Separamos vendors pesados en chunks propios para mejorar el caching
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          pdf: ['jspdf', 'jspdf-autotable'],
        },
      },
    },
  },
});
