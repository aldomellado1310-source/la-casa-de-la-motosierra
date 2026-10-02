# Design

> **Dirección vigente: propuesta A "Naranja a fondo"** (elegida por el cliente, sep-2026).
> - **Logo real** del cliente (`public/logo-lcm.webp|png`, componente `LogoLCM`): siempre
>   visible en el header (56px de alto en móvil, 72px en escritorio). Sobre fondos oscuros o de
>   color va en placa blanca (`tono="claro"`). Su barra es dorada `#E19B37`.
> - **Tipografía**: Barlow (cuerpo/UI) + Barlow Condensed 800 (títulos, precios).
> - **Portada**: hero naranja a sangre con pregunta grande, buscador con sombra dura y chips de
>   categorías; cinta negra inclinada en movimiento; "Elige tu marca" con botones que saltan;
>   riel horizontal "Lo más pedido" con sticker de oferta animado.
> - **Lenguaje de componentes**: bordes 2px carbón, sombra dura `shadow-dura` (0 4px 0 carbón)
>   que se hunde al presionar en `btn-primario`, radios 14–22px, `btn-oscuro` para "Agregar".
> - **Navegación móvil**: barra flotante negra con píldora naranja en la pestaña activa.
>   Escritorio: nav negra con píldora blanca activa y "Categorías" naranja.
> - Las propuestas comparadas viven en `propuestas/` (solo dev: `/propuestas/`).

Sistema visual **3.0**, derivado del logo real de La Casa de la Motosierra (tipografía negra
condensada, barra naranja, motosierra naranja). La versión 3.0 mantiene la identidad aprobada
(e-commerce claro, hero fotográfico, nav verde, CTAs naranjos) y la ajusta al público real:
**hombres de 40–65 años, con poco manejo digital, que compran desde el teléfono** con señal
variable. De ahí salen tres reglas que mandan sobre todo lo demás:

1. **Se lee sin lentes**: el texto más chico del sitio ronda 14px; el cuerpo es 17px.
2. **Se toca con dedos grandes**: todo control mide ≥48px (≥44px como mínimo absoluto).
3. **Nada se adivina**: todo ícono lleva texto, todo botón dice qué hace, y siempre hay una
   salida humana a la vista (WhatsApp con foto, llamar).

## Color

Estrategia **restrained**: superficies blancas/grises neutras; el naranja se reserva para la
acción primaria; el verde es estructura y confirmación.

| Token | Hex | Uso |
|---|---|---|
| `carbon` | `#0E0F0E` | Barra superior, footer, **texto sobre naranja** |
| `grafito` | `#1C1D1C` | Texto principal |
| `gris-600` | `#51554F` | Texto secundario (≥7:1 sobre blanco) |
| `borde` | `#DCDFDB` | Bordes y divisores |
| `gris-fondo` | `#F2F3F1` | Fondos de sección, respaldo de fotos |
| `naranja` | `#EE8100` | CTA primario (con texto carbón, 7:1), acentos sobre oscuro |
| `naranja-hover` | `#DB7600` | Hover del CTA primario |
| `naranja-oscuro` | `#AD5C00` | Texto naranja sobre blanco (4,9:1) |
| `naranja-suave` | `#FFF1E0` | Opción seleccionada, franja de ayuda |
| `verde` | `#1C6B34` | Nav de escritorio, enlaces, confirmaciones |
| `verde-oscuro` | `#124724` | Hover verde, texto sobre badges |
| `verde-badge` | `#E5F2E8` | Fondo "En stock", caja de duda de compatibilidad |
| `ambar` / `ambar-fondo` | `#7A5800` / `#FCF3D9` | "Quedan N" (últimas unidades) |
| `pedido` / `pedido-fondo` | `#8F4B00` / `#FDEBD9` | Bajo pedido |
| `oferta` | `#C8261B` | Badge de oferta, errores, "Quitar" |
| `whatsapp` / `whatsapp-oscuro` | `#1FA855` / `#15803D` | Botones de WhatsApp |

**Contraste**: el blanco sobre `naranja` da 2,7:1 y **no cumple AA ni en texto grande**; por eso
el CTA primario lleva texto `carbon`. El naranja pleno como texto solo va sobre fondos oscuros.

## Typography

- **Display** (`font-display`): Barlow Condensed 600/700: títulos de sección y hero, en mayúsculas.
  Nunca en botones, labels ni datos.
- **UI/Body** (`font-sans`): Inter 400–700 para todo lo demás.
- Escala Tailwind subida un peldaño (en `tailwind.config.js`): `xs` 13 · `sm` 15 · `base` 17 ·
  `lg` 19 · `xl` 22 · `2xl` 24 · `3xl` 30 · `4xl` 36. El texto de lectura usa `text-base`; `text-sm`
  solo para datos secundarios (código, "c/u"); `text-xs` casi no se usa.
- Precio en tarjeta `text-xl`/`2xl` bold; en ficha `text-4xl`/`5xl`.
- Lenguaje simple: "Código" (no "SKU"), "Buscar por mi máquina" (no "compatibilidad"),
  "¿Cómo quieres recibirlo?", "Quedan 3".

## Navegación

- **Móvil (<768px)**: el header NO es fijo (franja informativa, logo + botón "Llamar" rotulado,
  buscador grande). La navegación es una **barra inferior fija** (`BarraInferior`) con ícono +
  texto: Inicio · Repuestos · Mi máquina · Carrito (con contador) · Menú. "Menú" abre una hoja a
  pantalla completa con WhatsApp/Llamar arriba y todas las secciones en filas de 56px.
- **Escritorio**: header fijo en 3 franjas (carbón informativa; logo + buscador + cuenta/
  favoritos/carrito con rótulo; nav verde con "Categorías" y enlaces).
- `main` reserva 64px + safe-area abajo en móvil para la barra.

## Components (clases en `index.css`)

- **Botones** (`.btn` base: ≥48px, 17px bold, radio 10px, `scale(.97)` al presionar):
  `btn-primario` (naranja + texto carbón; UN CTA principal por pantalla), `btn-verde`
  (confirmación, "✓ Agregado"), `btn-secundario` (blanco, borde 2px), `btn-whatsapp`;
  modificador `btn-grande` (56px, 19px) para la acción final de un flujo.
- **Campos**: `campo` (52px, borde 2px, foco verde con halo), `select.campo` con flecha propia,
  `etiqueta` (17px semibold, siempre visible), `ayuda`.
- **Opciones grandes**: `opcion` / `opcion-activa` (tarjeta seleccionable con radio de 24px,
  `control-grande`) para envío y pago.
- **Stepper** `−/+`: `stepper` (botones de 48px de ancho). Solo en ficha y carrito; la tarjeta
  de producto tiene UN botón "Agregar" a lo ancho.
- **Tarjeta de producto**: foto (o respaldo `FotoProducto`), oferta arriba-izquierda, "Guardar"
  (corazón) arriba-derecha, nombre 2 líneas 17px, "Código:", stock en línea con punto de color
  (`BadgeStock linea`), precio grande, botón "Agregar". Radio 12px, borde 1px, sombra solo en hover.
- **Confirmación**: al agregar al carrito aparece `AvisoCarrito` (toast carbón con "Ver carrito")
  sobre la barra inferior, y el contador del carrito pulsa.
- **Carrito móvil**: barra fija con total + "Continuar" sobre la navegación inferior.
- **Paginación**: "Anterior · Página X de Y · Siguiente", nunca una fila de números.
- **Ayuda humana** (portada, ficha, tienda vacía, compatibilidad): WhatsApp con mensaje ya
  escrito (`enlaceWhatsApp()` en `config/tienda.ts`) + llamar (`ENLACE_LLAMAR`).
- Estados completos en todo control: hover, focus (3px verde), active, disabled, loading
  (skeletons `animate-pulse`, no spinners).

## Layout

- `.contenedor`: `max-w-7xl`, gutters 16px móvil / 24px desktop.
- Fondo blanco; secciones alternas `gris-fondo`; franja de ayuda en `naranja-suave`.
- Grillas de producto: 2 columnas en móvil, 3 en tablet, 4 en escritorio.
- Sin desborde horizontal a 390px (verificado por script en cada página).

## Motion

150–250ms, ease-out. Solo estado y feedback (entrada de paneles/toast, pulso del contador,
pop del favorito). El hero conserva su entrada y el Ken Burns lento. `prefers-reduced-motion`
lo desactiva todo.

## Imagery

Fotografía real de producto sobre fondo blanco. Mientras el producto tenga el placeholder del
catálogo importado (placehold.co), `FotoProducto` dibuja el ícono de su categoría con
"Foto próximamente", sin pedir imágenes externas. Hero con fotografía de contexto (bosque
patagónico) y velo carbón; el archivo vive en `public/hero.webp` y es reemplazable.
