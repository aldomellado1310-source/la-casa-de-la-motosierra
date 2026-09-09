# Mejoras de portada, tienda y compatibilidad — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portar a la app real las mejoras de UX/estructura identificadas en el prototipo de referencia
(orden y "cargar más" en la tienda, chips de marca y búsquedas rápidas en el buscador de compatibilidad,
panel dinámico "Tu máquina" en la portada, chips de compatibilidad en la tarjeta de producto) sin tocar
paleta/tipografía ni carrito/checkout.

**Architecture:** Cambios acotados a 4 archivos existentes (`Tienda.tsx`, `Home.tsx`,
`BuscadorCompatibilidad.tsx`, `TarjetaProducto.tsx`) más un nuevo módulo puro de ordenamiento
(`src/utils/ordenProductos.ts`) con su test. El proyecto no tiene runner de tests de componentes (no hay
Vitest/RTL); se sigue el patrón ya establecido en `scripts/lib/*.test.ts`: lógica pura testeada con
`node --test` vía `tsx`, y UI verificada con `npm run build` (tsc estricto) + revisión manual en
`npm run dev`, igual que documenta `docs/superpowers/specs/2026-08-30-importacion-inventario-y-compatibilidad-design.md`.
No se introduce ningún framework de testing de UI nuevo (no está justificado por el alcance ni por las
convenciones de `CLAUDE.md` sobre dependencias pesadas).

**Tech Stack:** React 18 + TypeScript estricto, Vite, Tailwind (tokens existentes), React Router, `tsx`
para tests de lógica pura.

**Spec de referencia:** `docs/superpowers/specs/2026-09-08-mejoras-portada-tienda-compatibilidad-design.md`

---

## Task 1: Utilidad `ordenarProductos` (TDD)

**Files:**
- Create: `src/utils/ordenProductos.ts`
- Test: `src/utils/ordenProductos.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Escribir el test que falla**

Crear `src/utils/ordenProductos.test.ts`:

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ordenarProductos } from './ordenProductos';
import type { Producto } from '../types';

function producto(overrides: Partial<Producto>): Producto {
  return {
    id: 'x',
    sku: 'X',
    nombre: 'X',
    descripcion: '',
    categoria: 'c',
    subcategoria: 's',
    precio: 0,
    stock: 1,
    fotos: [],
    compatibilidades: [],
    preciosPorVolumen: [],
    destacado: false,
    activo: true,
    ...overrides,
  };
}

test('orden vacío devuelve la misma lista (relevancia = sin cambios)', () => {
  const lista = [producto({ id: 'a', nombre: 'B' }), producto({ id: 'b', nombre: 'A' })];
  const resultado = ordenarProductos(lista, '');
  assert.equal(resultado, lista);
});

test('precio-asc ordena de menor a mayor precio vigente (respeta precioOferta)', () => {
  const lista = [
    producto({ id: 'a', precio: 30000 }),
    producto({ id: 'b', precio: 10000 }),
    producto({ id: 'c', precio: 50000, precioOferta: 5000 }),
  ];
  const resultado = ordenarProductos(lista, 'precio-asc').map((p) => p.id);
  assert.deepEqual(resultado, ['c', 'b', 'a']);
});

test('precio-desc ordena de mayor a menor precio vigente', () => {
  const lista = [producto({ id: 'a', precio: 30000 }), producto({ id: 'b', precio: 10000 })];
  const resultado = ordenarProductos(lista, 'precio-desc').map((p) => p.id);
  assert.deepEqual(resultado, ['a', 'b']);
});

test('nombre ordena alfabéticamente en español', () => {
  const lista = [
    producto({ id: 'a', nombre: 'Zeta' }),
    producto({ id: 'b', nombre: 'Amortiguador' }),
    producto({ id: 'c', nombre: 'Ñandú' }),
  ];
  const resultado = ordenarProductos(lista, 'nombre').map((p) => p.id);
  assert.deepEqual(resultado, ['b', 'c', 'a']);
});

test('no muta el arreglo original', () => {
  const lista = [producto({ id: 'a', precio: 30000 }), producto({ id: 'b', precio: 10000 })];
  const copia = [...lista];
  ordenarProductos(lista, 'precio-asc');
  assert.deepEqual(lista, copia);
});
```

- [ ] **Step 2: Agregar el script de test y correrlo para confirmar que falla**

En `package.json`, dentro de `"scripts"`, agregar (junto a `"test:scripts"`):

```json
    "test:utils": "tsx --test src/utils/ordenProductos.test.ts"
```

Run: `npm run test:utils`
Expected: FAIL — `Cannot find module './ordenProductos'` (el archivo todavía no existe).

- [ ] **Step 3: Implementación mínima**

Crear `src/utils/ordenProductos.ts`:

```ts
// Ordenamiento de listas de productos para /tienda
import { precioVigente } from './precio';
import type { Producto } from '../types';

export type OrdenProducto = '' | 'precio-asc' | 'precio-desc' | 'nombre';

/** Ordena una lista de productos; '' (relevancia) devuelve la lista tal cual llegó */
export function ordenarProductos(productos: Producto[], orden: OrdenProducto): Producto[] {
  if (orden === 'precio-asc') return [...productos].sort((a, b) => precioVigente(a) - precioVigente(b));
  if (orden === 'precio-desc') return [...productos].sort((a, b) => precioVigente(b) - precioVigente(a));
  if (orden === 'nombre') return [...productos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return productos;
}
```

- [ ] **Step 4: Correr el test y confirmar que pasa**

Run: `npm run test:utils`
Expected: PASS — 5 tests, 0 fallos.

- [ ] **Step 5: Verificar que el build sigue estricto**

Run: `npm run build`
Expected: compila sin errores (tsc `-b` incluye `src/utils/ordenProductos.ts` y su test vía `tsconfig.app.json`).

- [ ] **Step 6: Commit**

```bash
git add src/utils/ordenProductos.ts src/utils/ordenProductos.test.ts package.json
git commit -m "$(cat <<'EOF'
Utils: agregar ordenarProductos (relevancia/precio/nombre)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```

---

## Task 2: Tienda — "Ordenar por"

**Files:**
- Modify: `src/pages/Tienda.tsx`

- [ ] **Step 1: Importar la utilidad y leer el parámetro de orden**

En `src/pages/Tienda.tsx`, agregar el import junto a los demás de `utils`:

```ts
import { ordenarProductos, type OrdenProducto } from '../utils/ordenProductos';
```

Junto a la lectura de los demás parámetros de filtro (`const soloOfertas = params.get('ofertas') === '1';`),
agregar:

```ts
const orden = (params.get('orden') ?? '') as OrdenProducto;
```

- [ ] **Step 2: Aplicar el orden en `filtrados`**

Reemplazar el `useMemo` de `filtrados` para que aplique el orden al final y lo incluya en las dependencias:

```ts
const filtrados = useMemo(() => {
  let lista = productos;
  if (categoria) lista = lista.filter((p) => p.categoria === categoria);
  if (marca) {
    lista = lista.filter((p) => {
      const c = p.compatibilidades.find((x) => x.marca === marca);
      if (!c) return false;
      if (!modelo) return true;
      return c.modelos.length === 0 || c.modelos.includes(modelo);
    });
  }
  if (q) {
    const texto = q.toLowerCase();
    lista = lista.filter(
      (p) =>
        p.nombre.toLowerCase().includes(texto) ||
        p.sku.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto),
    );
  }
  if (soloDisponibles) lista = lista.filter((p) => estadoStock(p) !== 'agotado');
  if (soloOfertas) lista = lista.filter((p) => enOferta(p));
  return ordenarProductos(lista, orden);
}, [productos, categoria, marca, modelo, q, soloDisponibles, soloOfertas, orden]);
```

- [ ] **Step 3: Agregar la tarjeta "Ordenar por" en el sidebar**

En el bloque de filtros laterales, entre la tarjeta "Categorías" y la tarjeta "Disponibilidad", insertar:

```tsx
<div className="tarjeta">
  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Ordenar por</h3>
  <select
    value={orden}
    onChange={(e) => setFiltro('orden', e.target.value)}
    className="campo"
    aria-label="Ordenar productos"
  >
    <option value="">Relevancia</option>
    <option value="precio-asc">Precio: menor a mayor</option>
    <option value="precio-desc">Precio: mayor a menor</option>
    <option value="nombre">Nombre A-Z</option>
  </select>
</div>
```

- [ ] **Step 4: Verificar el build**

Run: `npm run build`
Expected: compila sin errores.

- [ ] **Step 5: Verificar manualmente**

Run: `npm run dev`, abrir `/tienda`, cambiar "Ordenar por" a cada opción y confirmar que la grilla cambia de
orden (precio ascendente/descendente correcto, nombre alfabético). Confirmar que la URL refleja `?orden=...`
y que recargar la página mantiene el orden elegido.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Tienda.tsx
git commit -m "$(cat <<'EOF'
Tienda: agregar filtro "Ordenar por" (precio, nombre)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```

---

## Task 3: Tienda — paginación → "Cargar más productos"

Arregla un bug real: con ~497 productos y `POR_PAGINA = 12` la paginación numerada actual renderiza ~42
botones sin ventana ni elipsis.

**Files:**
- Modify: `src/pages/Tienda.tsx`

- [ ] **Step 1: Quitar el parámetro `pagina` y su lógica**

Eliminar estas líneas (y todo lo que dependa de `pagina`):

```ts
const pagina = Math.max(1, parseInt(params.get('pagina') ?? '1', 10));
```

```ts
const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
const paginaActual = Math.min(pagina, totalPaginas);
const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
```

```ts
const irAPagina = (n: number) => {
  const nuevos = new URLSearchParams(params);
  nuevos.set('pagina', String(n));
  setParams(nuevos);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

Quitar también el `<nav aria-label="Paginación">...</nav>` completo (bloque al final del componente, con los
botones `←`, números y `→`).

En `setFiltro`, quitar la línea `nuevos.delete('pagina');` (ya no existe ese parámetro):

```ts
const setFiltro = (clave: string, valor: string) => {
  const nuevos = new URLSearchParams(params);
  if (valor) nuevos.set(clave, valor);
  else nuevos.delete(clave);
  setParams(nuevos);
};
```

En el botón que quita el filtro de marca (chip "Compatible: ..."), quitar también ahí
`nuevos.delete('pagina');`:

```tsx
onClick={() => {
  const nuevos = new URLSearchParams(params);
  nuevos.delete('marca');
  nuevos.delete('modelo');
  setParams(nuevos);
}}
```

- [ ] **Step 2: Agregar el estado de "cantidad visible" y su reseteo al cambiar filtros**

Junto a los demás `useState` del componente, agregar:

```ts
const [cantidadVisible, setCantidadVisible] = useState(POR_PAGINA);
```

Después del `useMemo` de `filtrados`, agregar:

```ts
useEffect(() => {
  setCantidadVisible(POR_PAGINA);
}, [categoria, marca, modelo, q, soloDisponibles, soloOfertas, orden]);
```

Reemplazar la línea que armaba `visibles` (la que se eliminó en el Step 1) por:

```ts
const visibles = filtrados.slice(0, cantidadVisible);
```

- [ ] **Step 3: Actualizar el texto de conteo**

Reemplazar:

```tsx
<div className="mb-3 text-sm text-gris-600">
  {cargando ? 'Cargando catálogo…' : error ? '' : `${filtrados.length} producto${filtrados.length === 1 ? '' : 's'}`}
</div>
```

por:

```tsx
<div className="mb-3 text-sm text-gris-600">
  {cargando
    ? 'Cargando catálogo…'
    : error
      ? ''
      : `Mostrando ${Math.min(cantidadVisible, filtrados.length)} de ${filtrados.length} producto${filtrados.length === 1 ? '' : 's'}`}
</div>
```

- [ ] **Step 4: Agregar el botón "Cargar más productos"**

Donde estaba el `<nav aria-label="Paginación">` (después de la grilla `.grid`), agregar:

```tsx
{cantidadVisible < filtrados.length && (
  <div className="mt-8 flex justify-center">
    <button onClick={() => setCantidadVisible((v) => v + POR_PAGINA)} className="btn-secundario px-6 py-2.5">
      Cargar más productos
    </button>
  </div>
)}
```

- [ ] **Step 5: Verificar el build**

Run: `npm run build`
Expected: compila sin errores (confirma que no quedaron referencias sueltas a `pagina`/`irAPagina`/`totalPaginas`/`paginaActual`).

- [ ] **Step 6: Verificar manualmente**

Run: `npm run dev`, abrir `/tienda` sin filtros: deben aparecer 12 productos y el botón "Cargar más
productos"; al hacer clic, deben sumarse 12 más (24 total) hasta agotar el catálogo, momento en que el botón
desaparece. Cambiar cualquier filtro y confirmar que la cantidad visible vuelve a 12.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Tienda.tsx
git commit -m "$(cat <<'EOF'
Tienda: reemplazar paginación numerada por "Cargar más productos"

Con el catálogo real (~497 ítems) la paginación numerada rendería
~42 botones sin ventana ni elipsis.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```

---

## Task 4: Tienda — estado "sin resultados" + sidebar sticky

**Files:**
- Modify: `src/pages/Tienda.tsx`

- [ ] **Step 1: Ampliar los imports**

Cambiar:

```ts
import { useSearchParams } from 'react-router-dom';
```

por:

```ts
import { Link, useSearchParams } from 'react-router-dom';
```

Agregar dos imports nuevos junto a los existentes:

```ts
import { WHATSAPP_NUMERO } from '../config/firebase';
import { IconoWhatsApp } from '../components/Iconos';
```

- [ ] **Step 2: Ampliar el estado "sin resultados"**

Reemplazar:

```tsx
{!cargando && !error && filtrados.length === 0 && (
  <div className="tarjeta py-12 text-center">
    <p className="font-semibold">No encontramos productos con esos filtros.</p>
    <p className="mt-1 text-sm text-gris-600">
      Prueba con otra marca/modelo o escríbenos por WhatsApp: lo conseguimos bajo pedido.
    </p>
  </div>
)}
```

por:

```tsx
{!cargando && !error && filtrados.length === 0 && (
  <div className="tarjeta py-12 text-center">
    <p className="font-semibold">No encontramos productos con esos filtros.</p>
    <p className="mt-1 text-sm text-gris-600">
      Prueba con otra marca/modelo o escríbenos por WhatsApp: lo conseguimos bajo pedido.
    </p>
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <Link to="/tienda" className="btn-secundario">Limpiar filtros</Link>
      <a
        href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, busco un repuesto que no encontré en la tienda')}`}
        target="_blank"
        rel="noreferrer"
        className="btn-primario"
      >
        <IconoWhatsApp className="h-5 w-5" /> Escríbenos por WhatsApp
      </a>
    </div>
  </div>
)}
```

- [ ] **Step 3: Sidebar sticky en desktop**

Cambiar:

```tsx
<aside className="lg:w-60 lg:shrink-0">
```

por:

```tsx
<aside className="lg:w-60 lg:shrink-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
```

- [ ] **Step 4: Verificar el build**

Run: `npm run build`
Expected: compila sin errores.

- [ ] **Step 5: Verificar manualmente**

Run: `npm run dev`. Forzar "sin resultados" (ej: buscar un texto inexistente en `/tienda?q=zzzznoexiste`):
deben aparecer los dos botones y ambos deben funcionar ("Limpiar filtros" vuelve a `/tienda` sin parámetros;
WhatsApp abre `wa.me` con el mensaje). En desktop, hacer scroll en `/tienda` con muchos resultados y
confirmar que el sidebar de filtros queda pegado (sticky) sin quedar tapado por el header ni dejar un hueco
grande — si el offset se ve mal, ajustar `lg:top-28` (probar `lg:top-20`/`lg:top-32`) hasta que calce con la
altura real del header compacto.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Tienda.tsx
git commit -m "$(cat <<'EOF'
Tienda: acciones en "sin resultados" y sidebar de filtros sticky

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```

---

## Task 5: BuscadorCompatibilidad — chips de marca, aviso de cambio y búsquedas rápidas

**Files:**
- Modify: `src/components/BuscadorCompatibilidad.tsx`

- [ ] **Step 1: Agregar la constante de búsquedas rápidas**

Cerca del inicio del archivo (después de los imports), agregar:

```ts
/** Términos curados con resultados garantizados en el catálogo real */
const BUSQUEDAS_RAPIDAS = ['Cadena', 'Filtro de aire', 'Bujía', 'Carburador', 'Aceite 2T'];
```

- [ ] **Step 2: Agregar la prop `onCambio`**

Cambiar:

```ts
interface Props {
  /** Variante compacta para la barra de la tienda (sin tarjeta ni texto libre) */
  compacto?: boolean;
  marcaInicial?: string;
  modeloInicial?: string;
}

export default function BuscadorCompatibilidad({ compacto = false, marcaInicial = '', modeloInicial = '' }: Props) {
```

por:

```ts
interface Props {
  /** Variante compacta para la barra de la tienda (sin tarjeta ni texto libre) */
  compacto?: boolean;
  marcaInicial?: string;
  modeloInicial?: string;
  /** Notifica al padre la selección actual (marca/modelo), sin esperar al submit */
  onCambio?: (marca: string, modelo: string) => void;
}

export default function BuscadorCompatibilidad({
  compacto = false,
  marcaInicial = '',
  modeloInicial = '',
  onCambio,
}: Props) {
```

- [ ] **Step 3: Disparar `onCambio` cuando cambia la selección**

Después del `useEffect` del "Conteo en vivo de repuestos compatibles" (el que llama a
`buscarPorCompatibilidad`), agregar un efecto nuevo y separado:

```ts
// Notifica al padre (ej: portada) la selección actual
useEffect(() => {
  onCambio?.(marca, modelo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [marca, modelo]);
```

- [ ] **Step 4: Agregar los chips de marca**

Dentro de `selects`, en el primer `<div className="flex-1">` (el de marca), insertar los chips entre el
`<label>` y el `<select>`:

```tsx
<div className="flex-1">
  <label className="etiqueta" htmlFor="sel-marca">
    {compacto ? 'Marca' : '1. Selecciona la marca'}
  </label>
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
  <select id="sel-marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="campo">
    <option value="">Marca (ej: Stihl)…</option>
    {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
  </select>
</div>
```

- [ ] **Step 5: Agregar las búsquedas rápidas**

En el `return` de la variante completa (no `compacto`), después del `<form onSubmit={buscarTexto} ...>` de
texto libre y antes del `</div>` de cierre del componente, agregar:

```tsx
{/* Búsquedas rápidas */}
<div className="mt-3 flex flex-wrap gap-1.5">
  {BUSQUEDAS_RAPIDAS.map((termino) => (
    <button
      key={termino}
      type="button"
      onClick={() => navigate(`/tienda?q=${encodeURIComponent(termino)}`)}
      className="rounded-full border border-borde bg-white px-3 py-1 text-xs font-semibold text-gris-600 transition-colors hover:border-verde hover:text-verde"
    >
      {termino}
    </button>
  ))}
</div>
```

- [ ] **Step 6: Verificar el build**

Run: `npm run build`
Expected: compila sin errores.

- [ ] **Step 7: Verificar manualmente**

Run: `npm run dev`, abrir la portada:
- Los chips de marca aparecen sobre el select; al hacer clic en uno, el select de marca se actualiza, se
  cargan los modelos y el contador de "Ver repuestos compatibles (N)"; el chip elegido queda resaltado en
  naranja.
- Los 5 chips de "búsquedas rápidas" navegan a `/tienda?q=...` y cada uno devuelve al menos un resultado
  (si alguno no trae resultados, ajustar el término en `BUSQUEDAS_RAPIDAS` por otro que sí tenga stock en el
  catálogo real).
- En `/tienda` (variante `compacto`), confirmar que NO aparecen ni los chips de marca ni las búsquedas
  rápidas (siguen ocultos por la condición `!compacto`).

- [ ] **Step 8: Commit**

```bash
git add src/components/BuscadorCompatibilidad.tsx
git commit -m "$(cat <<'EOF'
Buscador: chips de marca, búsquedas rápidas y aviso de cambio

Agrega selección de marca de un toque y términos de búsqueda
sugeridos en la portada. onCambio permite que un padre (portada)
conozca la marca/modelo elegidos sin esperar al submit.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```

---

## Task 6: Home — panel dinámico "Tu máquina" junto a destacados

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Ampliar los imports**

Cambiar:

```ts
import { obtenerCategorias, obtenerMarcasCompatibles, obtenerProductos } from '../services/productos';
```

por:

```ts
import { buscarPorCompatibilidad, obtenerCategorias, obtenerMarcasCompatibles, obtenerProductos } from '../services/productos';
```

- [ ] **Step 2: Extraer la constante `BENEFICIOS`**

Justo después de la constante `ICONO_CATEGORIA`, agregar:

```ts
/** Beneficios junto a "Productos destacados" cuando no hay máquina seleccionada */
const BENEFICIOS: [React.ComponentType<{ className?: string }>, string, string][] = [
  [IconoCarrito, 'Retiro en tienda', 'Gratis en Puerto Aysén'],
  [IconoCamion, 'Despachos a todo Chile', 'Cotiza tu envío en el checkout'],
  [IconoEscudo, 'Métodos de pago', 'Webpay, Mercado Pago, transferencia'],
  [IconoDocumento, 'Cotizaciones para empresas', 'Genera cotizaciones formales en PDF'],
];
```

- [ ] **Step 3: Agregar el estado de la máquina seleccionada y sus compatibles**

Junto a los demás `useState` del componente `Home`, agregar:

```ts
const [maquinaSel, setMaquinaSel] = useState<{ marca: string; modelo: string } | null>(null);
const [compatibles, setCompatibles] = useState<Producto[]>([]);
```

Después del `useEffect(cargar, [])` existente, agregar:

```ts
useEffect(() => {
  if (!maquinaSel) {
    setCompatibles([]);
    return;
  }
  void buscarPorCompatibilidad(maquinaSel.marca, maquinaSel.modelo || undefined).then((ps) =>
    setCompatibles(ps.slice(0, 5)),
  );
}, [maquinaSel]);
```

- [ ] **Step 4: Hero a 2 columnas (quitar el aside de beneficios de ahí)**

Cambiar la clase del grid del hero:

```tsx
<div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1.1fr_1fr_0.8fr] lg:items-center lg:py-14">
```

por:

```tsx
<div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-14">
```

Cambiar el buscador del hero para que informe la selección:

```tsx
<div className="animar-hero [animation-delay:80ms]">
  <BuscadorCompatibilidad />
</div>
```

por:

```tsx
<div className="animar-hero [animation-delay:80ms]">
  <BuscadorCompatibilidad
    onCambio={(marca, modelo) => setMaquinaSel(marca ? { marca, modelo } : null)}
  />
</div>
```

Eliminar por completo el `<aside className="hidden rounded-2xl bg-white p-2 shadow-tarjeta lg:block">...</aside>`
de beneficios que sigue (con su `.map` de 4 ítems) — su contenido ya quedó en `BENEFICIOS` (Step 2) y se
reutiliza en el Step 5.

- [ ] **Step 5: Panel junto a "Productos destacados"**

Reemplazar:

```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
  {destacados.map((p) => (
    <TarjetaProducto key={p.id} producto={p} />
  ))}
</div>
```

(dentro de la sección "Productos destacados") por:

```tsx
<div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    {destacados.map((p) => (
      <TarjetaProducto key={p.id} producto={p} />
    ))}
  </div>

  {/* Panel "Tu máquina": beneficios por defecto, compatibles cuando hay marca elegida */}
  <aside className="hidden rounded-2xl bg-white p-4 shadow-tarjeta lg:block">
    {maquinaSel ? (
      <>
        <p className="font-display text-lg font-bold uppercase text-grafito">
          Para tu {maquinaSel.marca}
          {maquinaSel.modelo ? ` ${maquinaSel.modelo}` : ''}
        </p>
        {compatibles.length > 0 ? (
          <ul className="mt-3 space-y-1">
            {compatibles.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/producto/${p.id}`}
                  className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gris-fondo"
                >
                  <img
                    src={p.fotos[0]}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-lg border border-borde object-cover"
                  />
                  <span className="min-w-0 flex-1 line-clamp-1 text-sm font-semibold">{p.nombre}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gris-600">
            No encontramos repuestos cargados para esta máquina todavía.
          </p>
        )}
        <Link
          to={`/tienda?marca=${encodeURIComponent(maquinaSel.marca)}${
            maquinaSel.modelo ? `&modelo=${encodeURIComponent(maquinaSel.modelo)}` : ''
          }`}
          className="mt-3 block text-center text-sm font-semibold text-verde hover:underline"
        >
          Ver todos los repuestos compatibles →
        </Link>
      </>
    ) : (
      BENEFICIOS.map(([Icono, titulo, detalle], i) => (
        <div key={titulo} className={`flex items-start gap-3 p-3.5 ${i > 0 ? 'border-t border-borde' : ''}`}>
          <Icono className="mt-0.5 h-6 w-6 shrink-0 text-verde" />
          <div>
            <p className="text-sm font-bold">{titulo}</p>
            <p className="text-xs text-gris-600">{detalle}</p>
          </div>
        </div>
      ))
    )}
  </aside>
</div>
```

- [ ] **Step 6: Verificar el build**

Run: `npm run build`
Expected: compila sin errores (confirma que `BENEFICIOS` y `Producto` se usan correctamente y no quedó nada
huérfano del aside eliminado).

- [ ] **Step 7: Verificar manualmente**

Run: `npm run dev`, abrir la portada en desktop:
- Sin tocar el buscador: el panel junto a "Productos destacados" muestra los 4 beneficios (igual contenido
  que antes, solo que movido).
- Elegir una marca (con o sin modelo) en el buscador del hero: el panel cambia a "Para tu <marca> <modelo>"
  con hasta 5 repuestos compatibles (foto + nombre, clicable a la ficha) y el link "Ver todos los repuestos
  compatibles →" apunta a `/tienda?marca=...` (y `&modelo=...` si corresponde) con el conteo correcto.
- Elegir una marca sin repuestos cargados (si existe alguna): se ve el mensaje "No encontramos repuestos
  cargados para esta máquina todavía."
- Volver a vaciar la marca (select a "Marca (ej: Stihl)…"): el panel vuelve a mostrar los beneficios.
- En mobile (375px): el hero se ve en una columna, sin scroll horizontal, y el panel permanece oculto (como
  antes).

- [ ] **Step 8: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "$(cat <<'EOF'
Home: panel dinámico "Tu máquina" junto a destacados

El hero pasa a 2 columnas; el panel de beneficios se muda junto a
"Productos destacados" y, cuando el usuario elige marca/modelo en
el buscador, muestra los repuestos compatibles en vivo.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```

---

## Task 7: Home — categorías con más jerarquía visual

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Ajustar la grilla y las tarjetas de categoría**

Cambiar:

```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
  {categorias.map((c) => {
    const Icono = ICONO_CATEGORIA[c.id] ?? IconoEngranaje;
    const n = conteoPorCategoria(c.id);
    return (
      <Link
        key={c.id}
        to={`/tienda?categoria=${c.id}`}
        className="group flex flex-col items-center gap-2 rounded-xl border border-borde bg-white p-4 text-center transition-colors duration-150 hover:border-verde"
      >
        <Icono className="h-8 w-8 text-grafito transition-colors group-hover:text-verde" />
        <span className="text-sm font-semibold leading-tight">{c.nombre}</span>
        <span className="text-xs text-gris-600">{n} producto{n === 1 ? '' : 's'}</span>
      </Link>
    );
  })}
</div>
```

por:

```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
  {categorias.map((c) => {
    const Icono = ICONO_CATEGORIA[c.id] ?? IconoEngranaje;
    const n = conteoPorCategoria(c.id);
    return (
      <Link
        key={c.id}
        to={`/tienda?categoria=${c.id}`}
        className="group flex flex-col items-center gap-2 rounded-xl border border-borde bg-white p-5 text-center transition-[border-color,box-shadow] duration-150 hover:border-verde hover:shadow-tarjeta"
      >
        <Icono className="h-9 w-9 text-grafito transition-colors group-hover:text-verde" />
        <span className="text-sm font-semibold leading-tight">{c.nombre}</span>
        <span className="text-xs text-gris-600">{n} producto{n === 1 ? '' : 's'}</span>
      </Link>
    );
  })}
</div>
```

- [ ] **Step 2: Verificar el build**

Run: `npm run build`
Expected: compila sin errores.

- [ ] **Step 3: Verificar manualmente**

Run: `npm run dev`, revisar "Categorías principales" en desktop (6 columnas, tarjetas más grandes con sombra
al pasar el mouse) y en mobile 375px (2 columnas, sin scroll horizontal).

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "$(cat <<'EOF'
Home: tarjetas de categoría más grandes (6 columnas en desktop)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```

---

## Task 8: TarjetaProducto — chips de compatibilidad

**Files:**
- Modify: `src/components/TarjetaProducto.tsx`

- [ ] **Step 1: Agregar los chips bajo el SKU**

Cambiar:

```tsx
<p className="text-xs text-gris-600">SKU: {producto.sku}</p>
{oferta && <BadgeStock producto={producto} compacto />}
```

por:

```tsx
<p className="text-xs text-gris-600">SKU: {producto.sku}</p>
{producto.compatibilidades.length > 0 && (
  <div className="flex flex-wrap gap-1">
    {producto.compatibilidades.slice(0, 2).map((c) => (
      <span
        key={c.marca}
        className="rounded-md border border-borde bg-gris-fondo px-1.5 py-0.5 text-[10px] font-medium text-gris-600"
      >
        {c.marca}
        {c.modelos[0] ? ` ${c.modelos[0]}` : ''}
      </span>
    ))}
    {producto.compatibilidades.length > 2 && (
      <span className="rounded-md border border-borde bg-gris-fondo px-1.5 py-0.5 text-[10px] font-medium text-gris-600">
        +{producto.compatibilidades.length - 2}
      </span>
    )}
  </div>
)}
{oferta && <BadgeStock producto={producto} compacto />}
```

- [ ] **Step 2: Verificar el build**

Run: `npm run build`
Expected: compila sin errores.

- [ ] **Step 3: Verificar manualmente**

Run: `npm run dev`, revisar en `/tienda` y en la portada:
- Un producto con 1 marca compatible muestra 1 chip (con modelo si tiene, solo la marca si es universal para
  toda la marca — `modelos: []`).
- Un producto con más de 2 compatibilidades muestra 2 chips + "+N".
- Un producto con `compatibilidades: []` no muestra ningún chip (ni un contenedor vacío).
- La tarjeta no se ve rota ni desalineada con textos largos (2 columnas en mobile 375px).

- [ ] **Step 4: Commit**

```bash
git add src/components/TarjetaProducto.tsx
git commit -m "$(cat <<'EOF'
Tarjeta: mostrar chips de compatibilidad (marca + modelo)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```

---

## Task 9: Verificación final

**Files:** ninguno (checklist de QA manual sobre lo ya commiteado; solo se commitea si se encuentra y
corrige algo).

- [ ] **Step 1: Build y tests completos**

Run: `npm run build`
Expected: sin errores.

Run: `npm run test:utils`
Expected: 5 tests, 0 fallos.

Run: `npm run test:scripts`
Expected: sin fallos (verifica que nada de lo tocado rompió el importador).

- [ ] **Step 2: Recorrido manual end-to-end**

Run: `npm run dev` y revisar, en desktop y en 375px (sin scroll horizontal en ningún caso):

1. Portada: hero 2 columnas, chips de marca, buscador con conteo en vivo, panel dinámico "Tu máquina"
   (beneficios ↔ compatibles según selección), búsquedas rápidas con resultados reales, categorías en 6
   columnas.
2. Tienda: "Ordenar por" con las 3 opciones + relevancia, "Cargar más productos" hasta agotar el catálogo,
   sidebar sticky sin superponerse al header, estado "sin resultados" con "Limpiar filtros" y WhatsApp
   funcionando.
3. Tarjeta de producto: chips de compatibilidad correctos en catálogo y destacados; el resto de la tarjeta
   (favorito, stepper, agregar al carrito) sigue funcionando igual que antes.
4. Carrito y checkout: confirmar que agregar productos desde las tarjetas modificadas sigue llevando al
   carrito normal (páginas sin cambios de este plan).

- [ ] **Step 3: Ajustes finales si algo no calzó**

Si el offset del sidebar sticky (Task 4) o algún término de "búsquedas rápidas" (Task 5) no quedó bien en la
revisión visual, corregirlo directamente en el archivo correspondiente.

- [ ] **Step 4: Commit (solo si el Step 3 cambió algo)**

```bash
git add -A
git commit -m "$(cat <<'EOF'
QA: ajustes finales tras verificación manual

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ABi5bimHyZBPZhvMqt3Euj
EOF
)"
```
