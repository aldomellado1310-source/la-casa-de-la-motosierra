# La Casa de la Motosierra · Progreso de la sesión de rediseño

**Fecha:** 23–24 de septiembre de 2026
**Proyecto:** `C:\Users\aldon\Documents\Proyectos\clients\la_casa_de_la_motosierra`
**Estado:** rediseño completo implementado y con build de producción verde. **Sin commit** y **sin deploy**.

---

## 1. Objetivo

Rediseñar toda la webapp para que se vea moderna, atractiva e intuitiva, pensada para
**hombres de 40 a 65 años, de clase media baja y con poco manejo de tecnología**, que compran
**desde el teléfono**.

> No existe un "Appllama MCP" en la sesión. Se usaron las skills de diseño (`impeccable`,
> `redesign-existing-projects`) y se tomaron ideas de https://appllama.io/elements.

---

## 2. Problemas encontrados y corregidos

- **Móvil roto:** el menú y el carrito quedaban fuera de la pantalla (la página medía 461px en un teléfono de 390px), y la paginación de la tienda se desbordaba hasta 619px.
- **Contraste insuficiente:** texto blanco sobre naranja a 2,7:1, por debajo del mínimo AA. Los botones naranjos ahora llevan texto negro (7:1).
- **Letra muy chica:** textos de 11–12px. La base pasó a 17px y el mínimo a ~14px.
- **Jerga técnica:** "SKU" → "Código", "compatibilidad" → "Buscar por mi máquina", etc.
- **Fotos de relleno externas** (placehold.co): se reemplazaron por un ícono de categoría con "Foto próximamente", sin gastar datos.
- **Avisos de React Router** en la consola: silenciados con las opciones de v7.

---

## 3. Propuestas exploradas (solo en desarrollo, fuera del build)

- `http://localhost:5173/propuestas/`: ronda 1.
  - **A · Naranja a fondo**
  - **B · Asistente paso a paso**
  - **C · Vitrina viva**
- `http://localhost:5173/propuestas/ronda-2.html`: ronda 2.
  - **D · Foto de Aysén**
  - **E · Conversación (chat estilo WhatsApp)**
  - **F · Toca la pieza (dibujo técnico interactivo)**
- Lienzo de diseño con A, B y C (privado): https://claude.ai/artifact/STD9PeW7CdT8YpgwMRjMHV

**Elegida por el cliente: A · Naranja a fondo**, con el **logo real visible**.

---

## 4. Qué quedó implementado (dirección A)

### Marca
- **Logo real** del cliente (`public/logo-lcm.webp`, `.png` y versiones transparentes), recortado y optimizado (17 KB).
  - Componente `LogoLCM`: 56px de alto en móvil y 72px en escritorio. En fondos oscuros va sobre una placa blanca.
- **Tipografía:** Barlow (cuerpo) + Barlow Condensed 800 (títulos y precios).
- **Estilo visual:** bordes negros de 2px, sombra "dura" (`shadow-dura`) que se hunde al presionar el botón naranjo, y radios de 14 a 22px.

### Portada
- Hero naranja a sangre: "¿Qué le hace falta a tu máquina?", buscador con sombra dura y chips de categorías.
- Cinta negra inclinada en movimiento con las garantías.
- "Elige tu marca": botones que saltan al elegirlos; el modelo aparece después; un botón "Otra marca" lleva a WhatsApp.
- Riel horizontal "Lo más pedido" con sticker de oferta animado.
- Bloque de ayuda humana ("¿No sabes qué pieza es?": enviar foto por WhatsApp o llamar).
- Lista de categorías, tarjeta del taller con foto, "Comprar es fácil" en 3 pasos y garantías.

### Navegación
- **Móvil:** barra inferior flotante negra con píldora naranja en la pestaña activa (Inicio · Repuestos · Mi máquina · Carrito · Menú).
  - "Menú" abre una hoja a pantalla completa con el logo, WhatsApp, Llamar y todas las secciones.
- **Escritorio:** franja superior con los datos de contacto, header con logo, buscador y cuenta, y nav negra con píldora blanca activa.
- En la portada, el buscador del header se oculta mientras el del hero está a la vista.

### Resto del sitio
- **Tarjeta de producto:** borde negro, precio grande, botón "Agregar" negro y aviso emergente "Agregado al carrito · Ver carrito".
- **Tienda:** título descriptivo, filtro "¿Para qué máquina es?", botón "Filtrar por categoría" y paginación "Anterior · Página X de Y · Siguiente".
- **Ficha:** stepper grande, "Preguntar por WhatsApp si le sirve", tabla "Más barato por cantidad" y "Le sirve a estas máquinas".
- **Carrito:** barra flotante con el total y "Continuar" en móvil.
- **Checkout:** pasos numerados, opciones grandes (la elegida se levanta) y errores claros.
- **Mi Cuenta:** las pestañas en móvil pasan a ser una grilla visible.
- **Botón flotante de WhatsApp:** se oculta en páginas de compra en móvil (tapaba "Agregar") y en el panel admin.

### Archivos nuevos
- `src/components/BarraInferior.tsx`
- `src/components/AvisoCarrito.tsx`
- `src/components/FotoProducto.tsx`
- `src/stores/useAviso.ts`
- `src/config/tienda.ts` (teléfono, horario, dirección y enlaces de WhatsApp centralizados)
- `public/logo-lcm*.{webp,png}`
- `propuestas/index.html` y `propuestas/ronda-2.html` (solo en desarrollo)

### Documentación
- `DESIGN.md`: documenta el sistema 3.0 y la dirección A.
- `CLAUDE.md`: actualizada con el público objetivo, las clases del sistema y las reglas de contraste.

### Verificación
- `npm run build` pasa.
- Sin desborde horizontal a 390px en todas las rutas revisadas.
- Todos los botones tocables miden 44px o más.
- Capturas revisadas en móvil y escritorio.

---

## 5. Deploy: pendiente (bloqueado)

El `deploy` fue bloqueado por el sistema de permisos (acción de producción). Además:

- **Firestore NO está creado**: la API está desactivada en el proyecto `la-casa-de-la-motosierra`.
- **La sesión de gcloud expiró** y hay que volver a iniciarla.
- El CLI de Firebase tiene sesión activa como `amellado@micorriza.bio`.
- `dist/` ya se generó con el `.env` real (modo Firebase).

### Pasos para publicar en producción

1. **Consola Firebase → Firestore Database → Crear base de datos**: región `southamerica-west1` (Santiago), modo producción. La región es permanente.
2. **Authentication → Método de acceso**: activar Correo/contraseña (y Google si se quiere).
3. **Storage → Comenzar**: lo usan las fotos y los comprobantes.
4. Subir el inventario (497 productos + 8 categorías):
   ```
   gcloud auth application-default login
   npm run importar-inventario -- --push
   ```
5. Compilar y publicar:
   ```
   npm run build
   npx firebase deploy --only hosting,firestore:rules,firestore:indexes,storage:rules
   ```
   Queda en https://la-casa-de-la-motosierra.web.app

### Pendiente después del deploy
- **Cuenta admin:** asignar `rol: "admin"` en el documento del usuario en la colección `usuarios`.
- **Pagos:** Webpay y Mercado Pago requieren las Cloud Functions de la rama de pagos (plan Blaze + secretos). Mientras tanto solo funciona la transferencia.

---

## 6. Otros pendientes

- **Commit:** el rediseño no está commiteado. Hay que correr `npm run build` antes, según la regla del proyecto. `package-lock.json` y el cambio de `scrollTo` en `src/App.tsx` ya estaban modificados antes de esta sesión.
- **Color de marca:** la barra del logo es dorada `#E19B37` y el naranja del sitio es `#EE8100`. Decidir si se unifican.
- **Contenido real por cargar:** fotos de productos y de categorías, modelos por marca, `public/hero.webp` definitivo, y la calificación y opiniones de Google para la prueba social.
- **Datos por validar** con el cliente: **dirección** ("Teniente Merino 500" es de ejemplo), **horario** (hoy "Lun a Vie 9:00–18:30 · Sáb 9:30–13:30" en `src/config/tienda.ts`), plazos en `/terminos` y `/privacidad`; dominio placeholder en `robots.txt`, `sitemap.xml` y `src/utils/seo.ts`.

### Datos reales ya cargados (24-09-2026, sin commit, build verde)
- **Razón social:** La Casa de la Motosierra Aysén SpA · **RUT** 78.269.561-4 (checkout, Términos, Privacidad, PDF de cotizaciones, footer).
- **Transferencia:** Banco Santander · Cuenta Corriente N° 2726354-2 (`src/services/pagos.ts`).
- **Correo único de la tienda:** lacasadelamotosierraaysenspa@gmail.com (comprobantes, ventas, contacto, derechos ARCO, PDF).
- **Teléfono / WhatsApp:** +56 9 8756 8465 (`VITE_WHATSAPP_NUMERO` en `.env`, respaldo en `src/config/firebase.ts`, Términos, PDF). Reemplazó el `56961156322` que había en `.env`; si ese era el WhatsApp real, separar llamada y WhatsApp.

---

## 8. Medios de pago: qué falta

**Ya existe en código:** checkout con Webpay, Mercado Pago y transferencia; `PagoRetorno.tsx`; Cloud Functions `webpayCrear/Confirmar` y `mercadoPagoCrear/Confirmar` (el monto se lee del pedido en Firestore, no del navegador). Webpay usa el ambiente de integración mientras no haya secretos.

**Rama `claude/payment-methods-flow-a22933`** (3 commits fuera de `main`): Flow (con webhook, idempotencia y tests), cupones, envío estimado y reintento de pago. **Tiene conflictos con `main`**: resolverlos a mano conservando el rediseño.

**Pasos técnicos:**
1. Terminar el deploy base (sección 5).
2. Commitear el rediseño y fusionar la rama de pagos.
3. Pasar Firebase a **plan Blaze** (con alerta de presupuesto).
4. Secretos: `firebase functions:secrets:set` → `WEBPAY_COMMERCE_CODE`, `WEBPAY_API_KEY`, `MP_ACCESS_TOKEN`, `FLOW_API_KEY`, `FLOW_SECRET_KEY`.
5. `firebase deploy --only functions` y poner la URL en `VITE_FUNCTIONS_URL` (sin ella el front simula los pagos); recompilar.
6. Restringir CORS de las functions (hoy `*`) al dominio de la tienda.

**Trámites del cliente:**
- **Transbank (Webpay Plus):** afiliación + proceso de validación (días/semanas). Empezar ya.
- **Mercado Pago:** cuenta vendedor verificada → Access Token de producción.
- **Flow (opcional):** la vía más rápida para cobrar con tarjeta sin afiliación directa a Transbank.
- Definir quién absorbe las comisiones.

**Recomendación:** partir con transferencia + Flow o Webpay; Mercado Pago después.

---

## 9. Bot de ayuda: qué falta

No existe nada todavía (hoy la ayuda son botones de WhatsApp/llamar). Referencia visual: propuesta **E · Conversación** (ronda 2).

- **Opción 1 · Asistente guiado (sin IA), recomendado para partir:** botones "Buscar pieza para mi máquina / Estado de mi pedido / Horario y dirección / Hablar con alguien". Sin costo por mensaje, 1–2 días.
- **Opción 2 · Bot con IA (Claude):** Cloud Function `asistenteChat` (API key solo en servidor, requiere Blaze) con herramientas: buscar productos, compatibilidad por marca/modelo, precio vigente, estado de pedido por `PED-…` y derivar a WhatsApp con el mensaje armado. Reglas: precio/stock solo desde los datos, lenguaje simple, salida humana visible, límite de uso por sesión/IP. Secreto `ANTHROPIC_API_KEY` y presupuesto mensual acordado. UI según `DESIGN.md` (no tapar "Agregar" ni la barra inferior; 17px; ≥48px) y rama MODO_DEMO.

---

## 10. Qué le falta para una cotización y compra completas

### Crítico
1. **Avisos:** no hay envío de correos ni WhatsApp en `functions/`. Falta:
   - aviso a la tienda por cada pedido o cotización nueva;
   - correo al cliente con el N° de pedido, el enlace de seguimiento y cada cambio de estado;
   - enviar los "avísame cuando llegue" (hoy `notificado` queda siempre en `false`).
   → Cloud Function que se active al crear o actualizar un pedido (Gmail de la tienda o Resend).
2. **Cotización en dos vías:**
   - el admin no puede editar precios, descuentos ni observaciones antes de responder;
   - el cliente no puede aceptar y pagar la cotización desde la web (la conversión deja el pedido "pendiente de pago" sin enlace para pagar);
   - `validaHasta` no vence solo.
   Flujo objetivo: pide → admin ajusta y envía → cliente recibe "Aceptar y pagar" → pedido con los precios cotizados → Webpay o transferencia.
3. **Boleta o factura:** no hay integración con el SII ni con un proveedor.
   - Mínimo: elegir boleta o factura en el checkout y pedir RUT, razón social y giro.
   - Ideal: emisión automática al confirmar el pago (OpenFactura, Bsale, Haulmer…).
   - **Preguntar al cliente qué sistema usa hoy.**
4. **Apartar stock:** hoy el stock se descuenta recién al confirmar el pago, así que se puede vender la misma última unidad dos veces. Falta apartarla (p. ej. 48 h en transferencia) y cancelar solo los pedidos impagos, devolviendo el stock.

### Importante
5. Cotizar **sin cuenta** (nombre, teléfono y correo; RUT si quiere factura). Hoy cotizar exige registrarse y comprar no.
6. "Enviar esta lista por WhatsApp" desde el carrito, con códigos y cantidades.
7. Cotizar una pieza **que no está en el catálogo**: foto, marca y modelo de la máquina y descripción.
8. **Costo de envío real:** las tarifas de `envios.ts` son fijas por zona, sin peso ni tamaño. Definir con el cliente tarifas por tamaño o "envío por pagar".
9. **Seguimiento más completo:** N° del courier con enlace, fecha estimada, y dirección y horario para retiro.
10. Página de **devoluciones y garantía**.

### Después, con uso real
- Recuperar carritos abandonados.
- Precios por cliente frecuente o empresa.
- Repetir un pedido anterior.
- Reportes para el admin: ventas, lo más cotizado y cotizaciones sin cerrar.

### Orden recomendado
1. Avisos (1).
2. Cotización en dos vías (2) + cotizar sin cuenta (5).
3. Boleta o factura, versión mínima (3).
4. Apartar stock y cancelar pedidos vencidos (4).

Casi todo depende de lo mismo que los pagos: **plan Blaze y functions publicadas**.

**Decisiones del cliente antes de programar:** qué sistema de facturación usa y cómo cobra hoy los envíos.

---

## 7. Para ver el sitio en local

```
# modo demo (catálogo local de 497 productos, sin Firebase)
VITE_FIREBASE_API_KEY= npx vite --port 5173
```
- Sitio: http://localhost:5173
- Propuestas: http://localhost:5173/propuestas/
- Usuarios demo: `cliente@demo.cl`, `empresa@demo.cl` y `admin@demo.cl`, clave `demo1234`.
