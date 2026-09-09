# Mejoras de portada, tienda y compatibilidad (Opción B)

Fecha: 2026-09-08
Estado: aprobado (diseño)

## Contexto

El usuario trajo como referencia un prototipo HTML standalone (`LA_CASA_DE_LA_MOTOSIERRA/index(20260908-233116).html`,
capturas desktop/mobile y `TEST-RESULTS.md`, 20/20 pruebas) generado por otra herramienta como exploración de
rediseño. Ese prototipo usa una identidad visual oscura/verde-bosque con fotografía de fondo fija (imagen de
Wikimedia, no del cliente), tipografía Impact y un naranja distinto al del sistema (`#f15a18` vs `naranja`
`#EE8100`). El `PRODUCT.md` del proyecto registra que la identidad anterior con "verde bosque como color
dominante" fue **descartada por decisión del cliente**, así que ese tema no se adopta.

Comparando el prototipo con el sitio real (`Home.tsx`, `Tienda.tsx`, `TarjetaProducto.tsx`,
`BuscadorCompatibilidad.tsx`, `BuscadorConSugerencias.tsx`, `Header.tsx`) se confirmó que buena parte de la
funcionalidad ya existe (buscador con autocompletado y miniaturas, favoritos, badges de stock, chips de
máquinas guardadas, filtros de tienda). Se identificaron mejoras puntuales de estructura/UX que sí valen la
pena portar, y un bug real de escalabilidad expuesto por el catálogo real (~497 ítems, ver
`docs/superpowers/specs/2026-08-30-importacion-inventario-y-compatibilidad-design.md`).

## Decisiones tomadas (con el usuario)

| Tema | Decisión |
|---|---|
| Identidad visual | Se mantiene el sistema aprobado de `DESIGN.md` tal cual (colores, tipografía, tokens). No se adopta el tema oscuro del prototipo. |
| Alcance | Híbrido: se toma la estructura/composición del prototipo (no su paleta) para partes puntuales de portada y tienda. |
| Carrito / checkout | Sin cambios. Se mantienen `/carrito` y `/checkout` como páginas completas; no se construye drawer ni modal. |
| Nivel de esfuerzo | Opción B ("Estándar"): incluye el panel dinámico "Tu máquina", chips de compatibilidad en la tarjeta, búsquedas rápidas y tarjetas de categoría con más jerarquía, además de los arreglos de Opción A. |
| Fotos de categoría | No se agregan fotos nuevas por categoría (el cliente aún no las entrega — ya está en "Pendientes conocidos" de `CLAUDE.md`). Se mantienen los íconos de línea actuales. |
| Colores por marca (chips) | No se hardcodean colores por marca como en el prototipo (naranja STIHL, azul Husqvarna, etc.): viola la regla de `DESIGN.md` de no usar hex sueltos por componente. Los chips usan los tokens existentes. |

## 1. `src/pages/Tienda.tsx`

### 1.1 Paginación → "Cargar más productos"

Bug actual: con ~497 productos y `POR_PAGINA = 12` se renderizan ~42 botones de página sin ventana ni
elipsis (`Array.from({ length: totalPaginas }, ...)`, líneas ~239-249). Se reemplaza por un patrón de carga
incremental:

- Se elimina el parámetro de URL `pagina`, `irAPagina` y la navegación `<nav aria-label="Paginación">`.
- Nuevo estado local `const [visibles, setVisibles] = useState(POR_PAGINA)` (cantidad de productos a
  mostrar, no un array).
- `useEffect` que resetea `setVisibles(POR_PAGINA)` cuando cambian los filtros (mismas dependencias que
  `filtrados`: `categoria, marca, modelo, q, soloDisponibles, soloOfertas, orden`).
- Render: `filtrados.slice(0, visibles)`.
- Bajo la grilla: si `visibles < filtrados.length`, botón `btn-secundario` "Cargar más productos" que hace
  `setVisibles((v) => v + POR_PAGINA)`.
- Texto de conteo actualizado: `Mostrando {Math.min(visibles, filtrados.length)} de {filtrados.length}
  productos` (reemplaza el conteo actual de solo `filtrados.length`).

### 1.2 Ordenar por

- Nuevo parámetro de URL `orden` (`relevancia` por defecto, `precio-asc`, `precio-desc`, `nombre`).
- Nueva tarjeta en el sidebar de filtros, entre "Categorías" y "Disponibilidad":

```tsx
<div className="tarjeta">
  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Ordenar por</h3>
  <select value={orden} onChange={(e) => setFiltro('orden', e.target.value)} className="campo">
    <option value="">Relevancia</option>
    <option value="precio-asc">Precio: menor a mayor</option>
    <option value="precio-desc">Precio: mayor a menor</option>
    <option value="nombre">Nombre A-Z</option>
  </select>
</div>
```

- En el `useMemo` de `filtrados`, después de aplicar todos los filtros, aplicar el orden (no afecta el orden
  "relevancia" = tal como viene de `productos`):

```ts
if (orden === 'precio-asc') lista = [...lista].sort((a, b) => precioVigente(a) - precioVigente(b));
else if (orden === 'precio-desc') lista = [...lista].sort((a, b) => precioVigente(b) - precioVigente(a));
else if (orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
```

(`precioVigente` ya se importa en el archivo desde `utils/precio`, junto a `enOferta` y `estadoStock`.)

### 1.3 Estado "sin resultados"

Se amplía el bloque actual (líneas ~214-221) con dos acciones, reutilizando el patrón de WhatsApp que ya usa
`Home.tsx` con `WHATSAPP_NUMERO`:

```tsx
<div className="tarjeta py-12 text-center">
  <p className="font-semibold">No encontramos productos con esos filtros.</p>
  <p className="mt-1 text-sm text-gris-600">
    Prueba con otra marca/modelo o escríbenos por WhatsApp: lo conseguimos bajo pedido.
  </p>
  <div className="mt-4 flex flex-wrap justify-center gap-2">
    <Link to="/tienda" className="btn-secundario">Limpiar filtros</Link>
    <a
      href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, busco un repuesto que no encontré en la tienda')}`}
      target="_blank" rel="noreferrer" className="btn-primario"
    >
      <IconoWhatsApp className="h-5 w-5" /> Escríbenos por WhatsApp
    </a>
  </div>
</div>
```

Requiere importar `WHATSAPP_NUMERO` de `../config/firebase` e `IconoWhatsApp` de `../components/Iconos`.

### 1.4 Sidebar sticky

El `<aside className="lg:w-60 lg:shrink-0">` pasa a `lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto`.
El offset (`top-28` ≈ 112px) es una aproximación a la altura del header compacto; se ajusta visualmente en la
verificación si queda desalineado.

## 2. `src/components/BuscadorCompatibilidad.tsx`

Chips rápidos de marca en la variante completa (no en `compacto`), generados desde el estado `marcas` ya
cargado (sin hardcodear marcas ni colores por marca):

```tsx
{!compacto && marcas.length > 0 && (
  <div className="mb-2 flex flex-wrap gap-1.5">
    {marcas.map((m) => (
      <button
        key={m}
        type="button"
        onClick={() => setMarca(m)}
        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
          marca === m
            ? 'border-naranja bg-naranja text-white'
            : 'border-borde bg-white text-grafito hover:border-verde hover:text-verde'
        }`}
      >
        {m}
      </button>
    ))}
  </div>
)}
```

Se ubica entre el label "1. Selecciona la marca" y el `<select>` de marca, dentro de `selects`. El `<select>`
se conserva para navegación por teclado/lectores de pantalla; el chip solo ofrece un atajo táctil.

### Prop `onCambio` para el panel dinámico de Home

Se agrega prop opcional para que un padre (Home) conozca la selección sin esperar al submit:

```ts
interface Props {
  compacto?: boolean;
  marcaInicial?: string;
  modeloInicial?: string;
  onCambio?: (marca: string, modelo: string) => void;
}
```

Se dispara desde un `useEffect` nuevo y separado del que calcula el conteo en vivo (para no mezclar
responsabilidades), con las mismas dependencias: `useEffect(() => { onCambio?.(marca, modelo); }, [marca, modelo]);`.

## 3. `src/pages/Home.tsx`

### 3.1 Hero a 2 columnas

El hero pasa de `lg:grid-cols-[1.1fr_1fr_0.8fr]` (titular / buscador / beneficios) a `lg:grid-cols-[1.1fr_1fr]`
(titular / buscador). El `<aside>` de beneficios se retira del hero y se reubica en la sección de destacados
(3.2).

### 3.2 Panel "Tu máquina" dinámico junto a destacados

- Estado nuevo en `Home`: `const [maquinaSel, setMaquinaSel] = useState<{ marca: string; modelo: string } | null>(null)`
  y `const [compatibles, setCompatibles] = useState<Producto[]>([])`.
- `BuscadorCompatibilidad` del hero recibe `onCambio={(marca, modelo) => setMaquinaSel(marca ? { marca, modelo } : null)}`.
- `useEffect` que, cuando `maquinaSel` tiene marca, llama a `buscarPorCompatibilidad(maquinaSel.marca, maquinaSel.modelo || undefined)`
  (ya importado desde `services/productos`) y guarda los primeros 5 en `compatibles`; si `maquinaSel` es
  `null`, limpia `compatibles`.
- La sección "Productos destacados" pasa de una sola columna a `lg:grid-cols-[1fr_18rem]` (grilla + panel
  lateral, oculto en mobile como el resto de asides del sitio):

```tsx
<div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    {destacados.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
  </div>
  <aside className="hidden rounded-2xl bg-white p-4 shadow-tarjeta lg:block">
    {maquinaSel ? (
      <>
        <p className="font-display text-lg font-bold uppercase text-grafito">
          Para tu {maquinaSel.marca}{maquinaSel.modelo ? ` ${maquinaSel.modelo}` : ''}
        </p>
        {compatibles.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {compatibles.map((p) => (
              <li key={p.id}>
                <Link to={`/producto/${p.id}`} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gris-fondo">
                  <img src={p.fotos[0]} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg border border-borde object-cover" />
                  <span className="min-w-0 flex-1 text-sm font-semibold line-clamp-1">{p.nombre}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gris-600">No encontramos repuestos cargados para esta máquina todavía.</p>
        )}
        <Link
          to={`/tienda?marca=${encodeURIComponent(maquinaSel.marca)}${maquinaSel.modelo ? `&modelo=${encodeURIComponent(maquinaSel.modelo)}` : ''}`}
          className="mt-3 block text-center text-sm font-semibold text-verde hover:underline"
        >
          Ver todos los repuestos compatibles →
        </Link>
      </>
    ) : (
      // beneficios actuales (retiro en tienda, despachos, pago, cotizaciones)
      BENEFICIOS.map(([Icono, titulo, detalle], i) => (/* igual que hoy */))
    )}
  </aside>
</div>
```

El array de beneficios hoy está inline dentro del `.map()` del aside del hero; se extrae a una constante
`BENEFICIOS` a nivel de módulo (mismo contenido: retiro en tienda, despachos, métodos de pago, cotizaciones)
para poder reutilizarlo en esta rama condicional.

### 3.3 Búsquedas rápidas

Bajo el formulario de texto libre del `BuscadorCompatibilidad` (variante completa), fila de chips con 5
términos curados del rubro que se sabe tienen resultados en el catálogo real (mapean a categorías/heurística
de la importación): `Cadena`, `Filtro de aire`, `Bujía`, `Carburador`, `Aceite 2T`. Cada uno navega a
`/tienda?q=<término>` (mismo patrón que `buscarTexto`).

### 3.4 Tarjetas de categoría

Se mantienen los íconos de línea actuales (sin fotos). Ajustes de jerarquía visual: grid de `lg:grid-cols-8` a
`lg:grid-cols-6` (tarjetas más grandes), `hover:shadow-tarjeta` añadido a la transición existente de borde.

## 4. `src/components/TarjetaProducto.tsx`

Bajo la línea de SKU (antes del badge de oferta), hasta 2 chips de compatibilidad derivados de
`producto.compatibilidades`:

```tsx
{producto.compatibilidades.length > 0 && (
  <div className="flex flex-wrap gap-1">
    {producto.compatibilidades.slice(0, 2).map((c) => (
      <span key={c.marca} className="rounded-md border border-borde bg-gris-fondo px-1.5 py-0.5 text-[10px] font-medium text-gris-600">
        {c.marca}{c.modelos[0] ? ` ${c.modelos[0]}` : ''}
      </span>
    ))}
    {producto.compatibilidades.length > 2 && (
      <span className="rounded-md border border-borde bg-gris-fondo px-1.5 py-0.5 text-[10px] font-medium text-gris-600">
        +{producto.compatibilidades.length - 2}
      </span>
    )}
  </div>
)}
```

Si `modelos` está vacío (consumible universal para la marca, regla ya documentada en `CLAUDE.md`), el chip
muestra solo la marca — coherente con el resto del sitio.

## Archivos afectados

**Modificados**
- `src/pages/Tienda.tsx` — paginación → "cargar más", orden, sin-resultados, sidebar sticky
- `src/components/BuscadorCompatibilidad.tsx` — chips de marca, prop `onCambio`
- `src/pages/Home.tsx` — hero a 2 columnas, panel "Tu máquina" junto a destacados, búsquedas rápidas, categorías a 6 columnas
- `src/components/TarjetaProducto.tsx` — chips de compatibilidad

**Sin cambios:** `DESIGN.md`/tokens, `/carrito`, `/checkout`, rutas, servicios de datos (solo se usan
funciones ya existentes de `services/productos.ts`), reglas Firestore/Storage.

## Verificación

1. `npm run build` verde (tsc `-b` estricto, `noUnusedLocals`).
2. `npm run dev` (modo demo) y revisar en el navegador:
   - **Home**: hero a 2 columnas; sin marca seleccionada el panel junto a destacados muestra los beneficios;
     al elegir marca (o marca+modelo) en el buscador del hero, el panel cambia a la lista de compatibles con
     link a cada ficha y a "Ver todos"; categorías en 6 columnas; búsquedas rápidas navegan a `/tienda?q=…`
     y cada una de las 5 devuelve al menos un resultado.
   - **Tienda**: "Ordenar por" cambia el orden visible (precio asc/desc, nombre); "Cargar más productos"
     revela de a 12 y desaparece al llegar al final; cambiar cualquier filtro resetea el conteo visible;
     estado sin resultados con filtros imposibles muestra "Limpiar filtros" y el botón de WhatsApp; sidebar
     sticky no se superpone al header ni se corta mal en desktop.
   - **Tarjeta de producto**: chips de compatibilidad visibles en catálogo y destacados, con "+N" cuando
     corresponde; sin chips cuando `compatibilidades` está vacío.
   - Mobile (375px): hero, categorías y tarjetas sin scroll horizontal; panel "Tu máquina" oculto (como los
     demás asides de escritorio).
3. Confirmar visualmente que el offset `lg:top-28` del sidebar de Tienda no queda tapado por el header
   compacto ni deja un hueco grande; ajustar el valor si hace falta.

## Riesgos / pendientes conocidos

- El offset exacto del sidebar sticky depende de la altura real del header (3 franjas, compacta al hacer
  scroll); puede requerir un ajuste fino de píxeles tras ver el resultado real.
- Las 5 búsquedas rápidas son curadas a mano (no hay datos de búsquedas populares reales); si el catálogo
  cambia mucho podrían quedar sin resultados y habría que revisarlas.
- El panel "Tu máquina" depende de que el usuario interactúe con el buscador de compatibilidad del hero
  (no persiste entre visitas ni usa "mis máquinas guardadas" del perfil); queda fuera de alcance ampliar eso.
- Fotos de categoría siguen pendientes de que el cliente las entregue (ya registrado en `CLAUDE.md`).
