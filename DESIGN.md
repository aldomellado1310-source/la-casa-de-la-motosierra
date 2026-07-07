# Design

Sistema visual derivado del logo real de La Casa de la Motosierra (tipografía negra condensada,
barra naranja, motosierra naranja) y del mockup de referencia aprobado por el cliente
(e-commerce claro, hero fotográfico, nav verde, CTAs naranjos). Reemplaza por completo la
identidad anterior (verde bosque dominante + fondo hueso).

## Color

Estrategia **restrained**: superficies blancas/grises neutras; el naranja se reserva para la
acción primaria y precios; el verde es estructura (barra de navegación, botón del buscador de
compatibilidad, badges de disponibilidad).

| Token | Hex | OKLCH | Uso |
|---|---|---|---|
| `carbon` | `#0E0F0E` | oklch(0.17 0.004 145) | Barra superior, footer, logo |
| `grafito` | `#1C1D1C` | oklch(0.24 0.004 145) | Texto principal |
| `gris-600` | `#5B5F5C` | oklch(0.49 0.008 145) | Texto secundario (≥4.5:1 sobre blanco) |
| `borde` | `#E3E5E3` | oklch(0.92 0.003 145) | Bordes y divisores |
| `gris-fondo` | `#F4F5F4` | oklch(0.965 0.002 145) | Fondos de sección |
| `blanco` | `#FFFFFF` | — | Superficie base |
| `naranja` | `#EE8100` | oklch(0.70 0.16 60) | CTA primario, precios, acentos |
| `naranja-oscuro` | `#C96C00` | oklch(0.62 0.15 60) | Hover CTA, texto naranja accesible |
| `verde` | `#1C6B34` | oklch(0.46 0.11 150) | Nav, botón compatibilidad, enlaces |
| `verde-oscuro` | `#124724` | oklch(0.35 0.09 150) | Hover verde, texto sobre badges |
| `verde-badge` | `#E5F2E8` | oklch(0.95 0.02 150) | Fondo badge "En stock" |

Badges de estado: en stock (verde-badge/verde-oscuro), últimas unidades (ámbar #FCF3D9/#7A5800),
bajo pedido (#FDEBD9/#8F4B00), agotado (#F3F4F3/#5B5F5C + borde), oferta (rojo #D92D20, texto
blanco). El precio tachado usa gris-600.

## Typography

- **Display** (`font-display`): Barlow Condensed 600/700 — títulos de sección, hero, logo.
  Eco directo de la tipografía condensada del logo. Solo en headings grandes, nunca en labels,
  botones ni datos.
- **UI/Body** (`font-sans`): Inter 400/500/600/700 — todo lo demás. Base 16px, line-height 1.5.
- Escala fija rem (registro product): 12 / 14 / 16 / 18 / 22 / 28 / 36 / 44.
- `text-wrap: balance` en h1–h3.

## Components

- **Header en 3 franjas**: (1) barra carbón con despachos/ubicación/horario/WhatsApp,
  (2) barra blanca con logo, buscador con botón naranja, Mi cuenta, Favoritos, Carrito con total,
  (3) nav verde con botón "Todas las categorías" naranja y enlaces.
- **Tarjeta de producto**: foto sobre blanco, badge de stock arriba-izquierda, corazón de
  favorito arriba-derecha, nombre 2 líneas, SKU, precio naranja (tachado gris si hay oferta),
  stepper de cantidad + botón "Agregar" naranja. Radio 12px, borde 1px `borde`, sombra solo
  en hover (≤8px).
- **Botones**: primario naranja (blanco, bold), verde estructural (buscador de compatibilidad),
  secundario blanco con borde. Altura ≥44px. Radio 8px.
- **Inputs**: borde `borde`, focus ring verde 2px. Labels siempre visibles.
- Estados completos en todo control: hover, focus, active, disabled, loading.

## Layout

- Contenedor `max-w-7xl`, gutters 16px móvil / 24px desktop.
- Fondo blanco; secciones alternas `gris-fondo`. Sin fondos crema.
- Espaciado en escala 4/8; ritmo vertical de secciones 48–64px.

## Motion

150–250ms, ease-out. Solo estado y feedback (hover de tarjeta, apertura de menú, transición de
badge). Sin coreografías de carga. `prefers-reduced-motion` desactiva todo.

## Imagery

Fotografía real de producto sobre fondo blanco (placeholders neutros mientras el cliente sube
las suyas). Hero con fotografía de contexto (bosque patagónico/motosierra) con velo carbón para
legibilidad del texto blanco; el archivo vive en `public/hero.jpg` y es reemplazable.
