# La Casa de la Motosierra — E-commerce

Plataforma de venta de repuestos y maquinaria forestal/agrícola para **La Casa de la Motosierra** (Puerto Aysén, Patagonia, Chile).

**Stack:** React + TypeScript + Vite · Tailwind CSS · Zustand · React Router · Firebase (Firestore, Auth, Storage, Cloud Functions).

## Funcionalidades

- **Catálogo** con grilla, filtros laterales, paginación, fotos con zoom y galería.
- **Buscador por compatibilidad de máquina** (marca + modelo → repuestos compatibles) + búsqueda por nombre/SKU.
- **Stock real visible**: "En stock (N disp.)", "Últimas unidades", "Agotado", "Bajo pedido" + "Avísame cuando llegue".
- **Precios por volumen** con tabla de tramos y recálculo automático en el carrito.
- **Cuentas** particular y empresa/taller (RUT + razón social), login con email y Google, panel Mi cuenta.
- **Carrito persistente** (localStorage + Firestore para usuarios logueados).
- **Checkout** con retiro en tienda gratis o despacho (Starken/Chilexpress/Blue Express) con **costo visible antes de pagar**.
- **Pagos:** Webpay Plus (Transbank), Mercado Pago y transferencia bancaria con subida de comprobante.
- **Cotizaciones formales** con folio correlativo, PDF descargable (neto/IVA/total) y seguimiento de estado.
- **Panel admin:** CRUD de productos, fotos, stock, importación CSV, gestión de pedidos, cotizaciones y clientes.
- **Favoritos** (corazón en tarjetas y ficha, página `/favoritos`), **ofertas** con precio tachado y filtro propio, y página `/marcas` con modelos por marca.
- Botón flotante de WhatsApp, páginas Nosotros (con servicio técnico) y Preguntas frecuentes.

## Identidad visual

Definida en `PRODUCT.md` y `DESIGN.md` a partir del logo real (negro condensado + naranja) y el
mockup aprobado: superficies blancas, nav verde, CTA naranja, tipografía Barlow Condensed
(display) + Inter (UI). La foto del hero vive en `public/hero.jpg` y varias fichas del seed usan fotografía real con
licencia libre en `public/productos/` (detalle y licencias en `CREDITOS-IMAGENES.md`, atribuidas
en el footer). Reemplázalas por fotografía propia o del catálogo oficial del proveedor
manteniendo las rutas; **no usar imágenes descargadas de sitios de competidores.**

## Modo demo (sin configurar nada)

```bash
npm install
npm run dev
```

Sin variables de entorno, la app corre en **modo demo** con el catálogo local de `src/data/seed.ts`. Usuarios de prueba (clave `demo1234`):

| Correo | Rol |
|---|---|
| `cliente@demo.cl` | Cliente particular |
| `empresa@demo.cl` | Cliente empresa (cotizaciones con RUT) |
| `admin@demo.cl` | Administrador (acceso a `/admin`) |

## Configuración de Firebase

1. Crea un proyecto en [console.firebase.google.com](https://console.firebase.google.com) y habilita:
   - **Authentication** → métodos Email/Contraseña y Google.
   - **Firestore** (modo producción) y **Storage**.
2. Registra una app web y copia sus credenciales a `.env` (usa `.env.example` como plantilla):

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

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

4. **Carga el catálogo de ejemplo**: descarga una clave de cuenta de servicio (Configuración del proyecto → Cuentas de servicio → Generar clave privada), guárdala como `serviceAccountKey.json` en la raíz y ejecuta:

```bash
npm run seed
```

5. **Crea el usuario admin**: regístrate en la web y, en Firestore, edita `usuarios/{uid}` poniendo `rol: "admin"`.

## Credenciales de las pasarelas de pago

Las Cloud Functions (`functions/src/index.ts`) usan secretos de Firebase. Complétalos con las credenciales reales del cliente:

```bash
cd functions && npm install && cd ..
firebase functions:secrets:set WEBPAY_COMMERCE_CODE   # código de comercio Transbank producción
firebase functions:secrets:set WEBPAY_API_KEY         # API key secreta Transbank producción
firebase functions:secrets:set MP_ACCESS_TOKEN        # access token Mercado Pago
firebase deploy --only functions
```

> **Sin los secretos de Transbank**, las funciones usan automáticamente el **ambiente de integración** de Webpay (tarjeta de prueba VISA `4051 8856 0044 6623`, CVV `123`, cualquier fecha), ideal para probar el flujo completo antes de pasar a producción. Producción requiere contrato con Transbank ([portal de comercios](https://www.transbankdevelopers.cl)).

Los **datos bancarios para transferencia** se editan en `src/services/pagos.ts` (`DATOS_TRANSFERENCIA`), y las **tarifas de courier** en `src/services/envios.ts`.

## Estructura

```
src/
  components/    Header, Footer, BuscadorCompatibilidad, GaleriaFotos, TablaVolumen…
  pages/         Home, Tienda, Producto, Carrito, Checkout, MiCuenta, CotizacionNueva…
  pages/admin/   Panel de administración (productos, pedidos, cotizaciones, clientes)
  services/      Acceso a datos (productos, pedidos, cotizaciones, pagos, envíos, PDF)
  stores/        Zustand: sesión (useAuth) y carrito (useCarrito)
  data/seed.ts   Catálogo de ejemplo (18 productos reales del rubro)
functions/       Cloud Functions: Webpay, Mercado Pago, PDF de cotizaciones
scripts/seed.ts  Poblado de Firestore
```

## Comandos

```bash
npm run dev       # desarrollo (modo demo si no hay .env)
npm run build     # typecheck + build de producción → dist/
npm run preview   # sirve el build localmente
npm run seed      # sube el catálogo de ejemplo a Firestore
firebase deploy   # hosting + functions + reglas
```
