/** @type {import('tailwindcss').Config} */
// Sistema de diseño 2.0 — derivado del logo real (negro condensado +
// barra naranja) y del mockup aprobado. Ver DESIGN.md.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#0E0F0E',        // barra superior, footer, logo
        grafito: '#1C1D1C',       // texto principal
        'gris-600': '#5B5F5C',    // texto secundario accesible
        borde: '#E3E5E3',         // bordes y divisores
        'gris-fondo': '#F4F5F4',  // fondos de sección
        naranja: {
          DEFAULT: '#EE8100',     // CTA primario, precios
          oscuro: '#C96C00',      // hover / texto naranja accesible
        },
        verde: {
          DEFAULT: '#1C6B34',     // nav, botón compatibilidad, enlaces
          oscuro: '#124724',      // hover verde, texto sobre badges
          badge: '#E5F2E8',       // fondo badge "En stock"
        },
        oferta: '#D92D20',        // badge de oferta
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        tarjeta: '0 4px 8px -2px rgb(14 15 14 / 0.08)',
      },
      zIndex: {
        // Escala semántica de capas
        nav: '40',
        flotante: '50',
        modal: '60',
      },
    },
  },
  plugins: [],
};
