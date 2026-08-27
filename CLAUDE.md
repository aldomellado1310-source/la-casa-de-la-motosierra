# CLAUDE.md — La Casa de la Motosierra

Guía para trabajar en este repositorio con Claude Code.

## Qué es

E-commerce de repuestos forestales/agrícolas para una tienda real de Puerto Aysén, Chile.
React 18 + TypeScript estricto + Vite + Tailwind + Zustand + React Router + Firebase.
La estrategia de producto vive en `PRODUCT.md` y el sistema visual en `DESIGN.md`:
**leerlos antes de tocar diseño o UX**.

## Comandos

```bash
npm run dev       # dev server (modo demo sin .env)
npm run build     # tsc -b estricto + vite build — DEBE pasar antes de commitear
npm run preview   # sirve dist/ (puerto 4173)
npm run seed      # puebla Firestore (requiere serviceAccountKey.json)
```

En `functions/`: `npm run build` (tsc) y `npm test` (test runner nativo de Node,
`node --test`, sobre la lógica pura de las pasarelas — hoy `flow.ts`/`flow.test.ts`).

## Convenciones

- **Todo en español**: comentarios, nombres de variables/funciones (`obtenerProductos`,
  `precioVigente`), textos de UI, mensajes de commit. Términos técnicos en inglés solo
  cuando son de la plataforma (hooks, props, store).
- **TypeScript estricto**: sin `any`; `noUnusedLocals` activo (limpiar imports muertos o
  el build falla).
- Componentes de página en `src/pages/`, reutilizables en `src/components/`, acceso a
  datos SOLO vía `src/services/` (nunca Firestore directo desde componentes).
- Rutas nuevas: lazy-load en `App.tsx` (la carga inicial importa: público con conexión lenta).

## Patrón MODO_DEMO (importante)

`src/config/firebase.ts` exporta `MODO_DEMO` (true si no hay credenciales en `.env`).
**Todo servicio debe funcionar en ambos modos**: rama demo (datos en memoria/`src/data/seed.ts`)
y rama Firebase. Al agregar una función de datos, implementar las dos ramas.
Usuarios demo: `cliente@demo.cl` / `empresa@demo.cl` / `admin@demo.cl`, clave `demo1234`.

## Sistema de diseño (resumen; detalle en DESIGN.md)

- Tokens Tailwind: `carbon`, `grafito`, `gris-600`, `borde`, `gris-fondo`, `naranja(-oscuro)`,
  `verde(-oscuro/-badge)`, `oferta`. **No usar hex sueltos en componentes.**
- Clases del sistema (en `index.css`): `btn-primario` (naranja, UN solo CTA por pantalla),
  `btn-verde` (estructural), `btn-secundario`, `campo`, `etiqueta`, `tarjeta`, `titulo-seccion`.
- Contraste: texto naranja pleno sobre blanco NO cumple AA → usar `naranja-oscuro` para
  montos y `verde` para enlaces.
- Motion: 150–250 ms, ease-out (`--ease-salida`), solo estado/feedback; clases
  `animar-entrada`, `animar-pulso`, `animar-favorito`. `prefers-reduced-motion` se respeta
  globalmente. Sin bounce, sin coreografías de carga (excepto hero y splash existentes).
- Tipografía: Barlow Condensed solo para display/títulos; Inter para todo lo demás.

## Reglas del negocio clave

- **Precio vigente** = `precioOferta` si existe y es menor a `precio` (`precioVigente()` en
  `utils/precio.ts`). En el carrito, la oferta actúa como TECHO de los tramos por volumen.
- Estado de stock derivado solo del número: >5 en stock, 1–5 últimas unidades, 0 agotado
  (o "bajo pedido" si `bajoPedido`). No hay flag manual de disponibilidad.
- Productos sin `modelosCompatibles` pero con `marcasCompatibles` = consumibles universales
  para toda la marca (el filtro de compatibilidad los incluye).
- Folios de cotización: `COT-AAAA-NNNN`; ids de pedido: `PED-AAAAMMDD-XXXX` (el id funciona
  como token del seguimiento público).

## Cosas que NO hacer

- **No usar imágenes de sitios de competidores** (p. ej. raismanchile.cl): riesgo legal.
  Solo fotografía propia del cliente, catálogo oficial del proveedor o licencia libre con
  atribución en `CREDITOS-IMAGENES.md`.
- No subir `.env` ni `serviceAccountKey.json` (ya ignorados).
- No commitear sin `npm run build` verde.
- No agregar dependencias pesadas sin justificar (presupuesto de peso por conexión lenta).

## Pendientes conocidos

- `public/hero.webp` es provisional (foto CC de Puerto Aysén); el cliente generará la
  definitiva. Reemplazar manteniendo el nombre y el formato WebP (~1600px de ancho).
- Dominio placeholder `lacasadelamotosierra.cl` en `robots.txt` y `sitemap.xml`.
- Datos legales de referencia en `/terminos` y `/privacidad` (RUT, plazos): validar con el
  cliente antes de producción.
- Fotos placeholder en varios productos hasta recibir el catálogo oficial del proveedor.
- Deploy a Firebase pendiente: el CLI ya está autenticado pero **no existe proyecto
  Firebase para esta tienda** (crear `la-casa-de-la-motosierra`, enlazar con `.firebaserc`,
  habilitar Firestore/Storage/Auth, `.env` con credenciales web y desplegar hosting+reglas;
  las functions de pago requieren plan Blaze y sus secretos).
- Flow ya está integrado (`flowCrear`/`flowConfirmar`/`flowWebhook` en
  `functions/src/index.ts`) pero falta configurar `FLOW_API_KEY` y `FLOW_SECRET_KEY`
  (`firebase functions:secrets:set`) con las credenciales reales del cliente en flow.cl
  antes de salir de modo sandbox.
