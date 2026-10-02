/** @type {import('tailwindcss').Config} */
// Sistema de diseño 3.0 — derivado del logo real (negro condensado +
// barra naranja). Pensado para lectores de 40–65 años en teléfono:
// escala tipográfica más grande, controles altos. Ver DESIGN.md.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#0E0F0E',        // barra superior, footer, logo
        grafito: '#1C1D1C',       // texto principal
        'gris-600': '#51554F',    // texto secundario (≥7:1 sobre blanco)
        borde: '#DCDFDB',         // bordes y divisores
        'gris-fondo': '#F2F3F1',  // fondos de sección
        naranja: {
          DEFAULT: '#EE8100',     // CTA primario (con texto carbón: 7:1), acentos
          hover: '#DB7600',       // hover del CTA primario
          oscuro: '#AD5C00',      // texto naranja accesible sobre blanco (4.9:1)
          suave: '#FFF1E0',       // fondo de selección / aviso
        },
        verde: {
          DEFAULT: '#1C6B34',     // nav, enlaces, confirmaciones
          oscuro: '#124724',      // hover verde, texto sobre badges
          badge: '#E5F2E8',       // fondo badge "En stock"
        },
        ambar: { DEFAULT: '#7A5800', fondo: '#FCF3D9' },    // últimas unidades
        pedido: { DEFAULT: '#8F4B00', fondo: '#FDEBD9' },   // bajo pedido
        oferta: '#C8261B',        // badge de oferta / errores
        whatsapp: { DEFAULT: '#1FA855', oscuro: '#15803D' }, // botón WhatsApp (texto blanco AA)
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Barlow', 'system-ui', 'sans-serif'],
      },
      // Escala subida un peldaño: el texto más chico del sitio ronda 14px
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px
        sm: ['0.9375rem', { lineHeight: '1.375rem' }],  // 15px
        base: ['1.0625rem', { lineHeight: '1.625rem' }], // 17px
        lg: ['1.1875rem', { lineHeight: '1.75rem' }],   // 19px
        xl: ['1.375rem', { lineHeight: '1.875rem' }],   // 22px
      },
      boxShadow: {
        tarjeta: '0 4px 8px -2px rgb(14 15 14 / 0.10)',
        barra: '0 -2px 8px rgb(14 15 14 / 0.08)',
        // Sombra "dura" de la propuesta A: botones y tarjetas que se sienten físicos
        dura: '0 4px 0 #0E0F0E',
        'dura-sm': '0 2px 0 #0E0F0E',
        'dura-naranja': '0 4px 0 #EE8100',
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
