# La Casa de la Motosierra — E-commerce

Tienda online de repuestos y maquinaria forestal/agrícola de **La Casa de la Motosierra**
(Puerto Aysén, Patagonia, Chile). *"Economía para la Gente de Aysén"*.

**Stack:** React 18 + TypeScript + Vite · Tailwind CSS · Zustand · React Router ·
Firebase (Firestore, Auth, Storage, Cloud Functions) · jsPDF.

Repositorio: https://github.com/aldomellado1310-source/la-casa-de-la-motosierra

## Funcionalidades

### Tienda
- **Buscador por compatibilidad** (diferenciador clave): marca + modelo → solo repuestos
  compatibles, con conteo en vivo. Búsqueda de texto con **autocompletado** (foto, SKU, precio).
- **"Mi máquina"**: el cliente registra sus máquinas y filtra compatibilidad de un clic.
- **Stock real visible**: "En stock (N)", "Últimas unidades", "Agotado" (con *avísame cuando
  llegue*), "Bajo pedido".
- **Ofertas** (precio tachado + badge −%), **favoritos** persistentes, **precios por volumen**
  con recálculo automático en el carrito.
- Ficha con galería + zoom, tabla de tramos mayoristas y **productos relacionados** por
  compatibilidad ("Completa tu mantención").
- **Checkout**: retiro gratis en tienda o despacho (Starken/Chilexpress/Blue Express) con
  **costo visible antes de pagar**. Pagos: **Webpay Plus**, **Mercado Pago** y **transferencia**
  con subida de comprobante.
- **Cotizaciones formales** con folio, PDF (neto/IVA/total) y seguimiento de estado.
- **Seguimiento de pedido público** (`/seguimiento`) sin iniciar sesión.
- Cuentas particular y **empresa/taller** (RUT validado + razón social), login email + Google.

### Panel admin (`/admin`, solo rol admin)
- **Dashboard**: ventas del mes, transferencias por validar, pedidos por preparar, stock
  crítico y cotizaciones por vencer.
- Productos: CRUD completo, fotos, **precio editable inline**, stock con +/−, ofertas,
  tramos de volumen, **importación y exportación CSV**.
- Gestión de pedidos (estados, comprobantes) y cotizaciones, listado de clientes.

### Técnico
- **PWA**: instalable, service worker con caché de assets/fotos (pensado para conexión
  variable de la zona austral).
- **SEO**: metadatos por página, JSON-LD `schema.org/Product`, Open Graph, `sitemap.xml`
  y `robots.txt` (reemplazar dominio placeholder al publicar).
- Páginas legales: `/terminos` y `/privacidad` (Ley 19.496 y 19.628 — **revisar datos
  reales del cliente antes de publicar**).
- Identidad visual definida en `PRODUCT.md` y `DESIGN.md` (logo real: negro condensado +
  naranja; Barlow Condensed + Inter). Sistema de motion con `prefers-reduced-motion`.

## Modo demo (sin configurar nada)

```bash
npm install
npm run dev
```

Sin variables de entorno la app corre en **modo demo** con el catálogo local
(`src/data/seed.ts`). Usuarios de prueba (clave `demo1234`):

| Correo | Rol |
|---|---|
| `cliente@demo.cl` | Cliente particular |
| `empresa@demo.cl` | Cliente empresa (cotizaciones con RUT) |
| `admin@demo.cl` | Administrador (acceso a `/admin`) |

En demo, los pedidos/cotizaciones viven en memoria de la sesión y las fotos subidas no
persisten. El splash de entrada aparece una vez por sesión
(`sessionStorage.removeItem('splash-visto')` para repetirlo).

## Configuración de Firebase

1. Crea un proyecto en [console.firebase.google.com](https://console.firebase.google.com) y
   habilita **Authentication** (Email/Contraseña y Google), **Firestore** y **Storage**.
2. Registra una app web y copia sus credenciales a `.env` (plantilla en `.env.example`):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FUNCTIONS_URL=https://southamerica-west1-TU_PROYECTO.cloudfunctions.net
VITE_WHATSAPP_NUMERO=569XXXXXXXX
```

3. Publica reglas e índices:
   `firebase deploy --only firestore:rules,firestore:indexes,storage`
4. **Siembra el catálogo**: descarga una clave de cuenta de servicio (Configuración →
   Cuentas de servicio), guárdala como `serviceAccountKey.json` en la raíz y ejecuta
   `npm run seed`.
5. **Crea el admin**: regístrate en la web y en Firestore edita `usuarios/{uid}` con
   `rol: "admin"`.

## Pasarelas de pago

Las Cloud Functions (`functions/src/index.ts`) usan secretos de Firebase:

```bash
cd functions && npm install && cd ..
firebase functions:secrets:set WEBPAY_COMMERCE_CODE   # Transbank producción
firebase functions:secrets:set WEBPAY_API_KEY
firebase functions:secrets:set MP_ACCESS_TOKEN        # Mercado Pago
firebase deploy --only functions
```

> Sin los secretos de Transbank, las funciones usan el **ambiente de integración** de Webpay
> (tarjeta de prueba VISA `4051 8856 0044 6623`, CVV `123`). Producción requiere contrato con
> Transbank y publicar los términos y condiciones (ya incluidos en `/terminos`).

Datos bancarios de transferencia: `src/services/pagos.ts` (`DATOS_TRANSFERENCIA`).
Tarifas de courier: `src/services/envios.ts`.

## Imágenes

- `public/hero.webp` y `public/productos/*` usan fotografía con licencia libre de Wikimedia
  Commons (detalle y atribuciones en `CREDITOS-IMAGENES.md`, citadas en el footer).
- Reemplazar por fotografía propia o del **catálogo oficial del proveedor** manteniendo las
  rutas. **No usar imágenes descargadas de sitios de competidores.**

## Comandos

```bash
npm run dev       # desarrollo (modo demo si no hay .env)
npm run build     # typecheck estricto + build de producción → dist/
npm run preview   # sirve el build localmente
npm run seed      # sube el catálogo de ejemplo a Firestore
firebase deploy   # hosting + functions + reglas
```

## Estructura

```
src/
  components/    Header (3 franjas), LogoLCM, BuscadorCompatibilidad,
                 BuscadorConSugerencias, TarjetaProducto, SplashInicio…
  pages/         Home, Tienda, Producto, Carrito, Checkout, MiCuenta,
                 CotizacionNueva, Seguimiento, Favoritos, Marcas, legales…
  pages/admin/   AdminResumen (dashboard), AdminProductos, AdminPedidos,
                 AdminCotizaciones, AdminClientes
  services/      Datos: productos, pedidos, cotizaciones, pagos, envíos, PDF
  stores/        Zustand: useAuth, useCarrito, useFavoritos
  data/seed.ts   Catálogo demo (18 productos)
  utils/         precio (CLP, tramos, ofertas), rut, seo
functions/       Cloud Functions: Webpay, Mercado Pago, PDF servidor
public/          hero.webp, productos/, sw.js, manifest, sitemap, robots
PRODUCT.md       Estrategia de producto y principios de diseño
DESIGN.md        Sistema visual (paleta OKLCH, tipografía, componentes)
```
