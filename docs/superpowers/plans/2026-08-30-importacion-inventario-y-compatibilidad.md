# Importación de inventario + refactor de compatibilidad — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el catálogo demo por los ~497 ítems del inventario real del cliente (en Firestore y en `src/data/seed.ts`), y corregir la clasificación por marca/modelo reemplazando `marcasCompatibles` + `modelosCompatibles` por un campo `compatibilidades` estructurado.

**Architecture:** (1) Refactor incremental del tipo `Producto` y sus ~8 consumidores, manteniendo el build verde en cada commit. (2) Librería pura y testeada (`scripts/lib/transformarInventario.ts`) que convierte el TSV del inventario en `Producto[]`. (3) Script `scripts/importar-inventario.ts` que regenera `src/data/seed.ts` y, con `--push`, sube a Firestore vía `firebase-admin`.

**Tech Stack:** React 18 + TypeScript estricto + Vite + Firebase (Firestore) + `firebase-admin` (ya es devDependency) + `tsx` + `node:test`.

**Spec:** `docs/superpowers/specs/2026-08-30-importacion-inventario-y-compatibilidad-design.md`

**Contexto de rama:** rama `claude/importar-inventario` (desde `main`). Hay 3 archivos con cambios sueltos pre-existentes que NO son de este trabajo (`package-lock.json`, `src/App.tsx`, `src/pages/Home.tsx` — un fix menor del `<img>` del hero). No revertirlos. Al commitear `Home.tsx` en la Task 12, ese fix viajará en el mismo commit; mencionarlo en el cuerpo del commit.

**Convenciones del repo (obligatorias):** todo en español (nombres, comentarios, commits, UI). TS estricto, sin `any`. `noUnusedLocals`/`noUnusedParameters` activos en `tsconfig.app.json` → limpiar imports/parámetros muertos o el build falla. `npm run build` (`tsc -b && vite build`) DEBE pasar antes de cada commit. `tsc -b` también typechea `scripts/` (vía `tsconfig.node.json`).

---

## Estructura de archivos

**Nuevos:**
- `scripts/lib/transformarInventario.ts` — lógica pura: parseo TSV, normalización de precios/stock, slug de id, extracción de marca, heurística de categoría, ensamblado de `Producto`. Sin dependencias de Firebase ni del DOM.
- `scripts/lib/transformarInventario.test.ts` — tests con `node:test`.
- `scripts/importar-inventario.ts` — CLI: regenera `src/data/seed.ts`; con `--push` sube a Firestore; con `--push --solo-stock` actualiza solo stock/precio de docs existentes.
- `scripts/datos/inventario.tsv` — snapshot UTF-8 del inventario del cliente (commiteado).

**Modificados:**
- `src/types/index.ts` — nuevo `Compatibilidad`; `Producto.compatibilidades` reemplaza a `marcasCompatibles` + `modelosCompatibles`.
- `src/services/productos.ts` — `obtenerMarcasCompatibles`, `obtenerModelosPorMarca`, `buscarPorCompatibilidad`, guarda defensiva en `obtenerProductos`, `guardarProducto` (CSV no aquí), y las funciones de import/export CSV están en `AdminProductos.tsx`.
- `src/pages/Tienda.tsx` — filtro marca/modelo.
- `src/pages/Marcas.tsx` — agregación por marca.
- `src/pages/Compatibilidad.tsx` — conteo por marca.
- `src/pages/Producto.tsx` — sección "Compatible con", relacionados, placeholder de descripción vacía.
- `src/pages/admin/AdminProductos.tsx` — editor de compatibilidades en el formulario + import/export CSV + `productoVacio()`.
- `src/data/seed.ts` — migración de los 18 productos demo (Task 1), limpieza (Task 6), y **regeneración completa** por el script (Task 11).
- `src/pages/Home.tsx` — fallback de "Productos destacados" vacío.
- `package.json` — scripts `importar-inventario` y `test:scripts`.
- `CLAUDE.md` — sección PENDIENTES.

**Sin cambios:** `functions/`, `firestore.rules`, `storage.rules`, `src/pages/MiCuenta.tsx` (solo consume servicios), `src/components/BuscadorCompatibilidad.tsx` (solo consume servicios), `src/components/TarjetaProducto.tsx`, `src/utils/seo.ts` (`jsonLdProducto` usa un tipo estructural, no `Producto`).

---

## Task 1: Tipo `Compatibilidad` + migración de los 18 productos demo

**Files:**
- Modify: `src/types/index.ts:5-41`
- Modify: `src/data/seed.ts` (los 18 productos + `MARCAS_MAQUINA`)

- [ ] **Step 1: Añadir `Compatibilidad` y cambiar `Producto` en `src/types/index.ts`**

Reemplazar las líneas 31-34 actuales:
```ts
  /** Marcas de máquina compatibles (ej: Stihl, Husqvarna) */
  marcasCompatibles: string[];
  /** Modelos compatibles (ej: MS 250, 236) */
  modelosCompatibles: string[];
```
por:
```ts
  /** Compatibilidad por marca de máquina (reemplaza marcasCompatibles + modelosCompatibles) */
  compatibilidades: Compatibilidad[];
```

Y añadir la interfaz justo antes de `/** Producto del catálogo ... */` (antes de la línea 15):
```ts
/**
 * Compatibilidad de un repuesto con una marca de máquina y sus modelos.
 * `modelos` vacío = sirve para toda la marca (consumible universal).
 */
export interface Compatibilidad {
  marca: string;
  modelos: string[];
}
```

- [ ] **Step 2: Migrar los 18 productos de `src/data/seed.ts`**

En cada producto, quitar las líneas `marcasCompatibles: [...]` y `modelosCompatibles: [...]` y poner en su lugar `compatibilidades: [...]` con este reparto (modelos asignados a la marca real a la que pertenecen):

```ts
// p001 Cadena .325
compatibilidades: [
  { marca: 'Stihl', modelos: ['MS 250', 'MS 251'] },
  { marca: 'Husqvarna', modelos: ['450', '445'] },
  { marca: 'Genérica/China', modelos: ['G5800'] },
],
// p002 Espada 20" .325
compatibilidades: [
  { marca: 'Stihl', modelos: ['MS 250', 'MS 260'] },
  { marca: 'Husqvarna', modelos: ['450', '455 Rancher'] },
  { marca: 'Toyama', modelos: ['TCS53X'] },
],
// p003 Bujía NGK BPMR7A
compatibilidades: [
  { marca: 'Stihl', modelos: ['MS 170', 'MS 180', 'MS 250', 'MS 361'] },
  { marca: 'Husqvarna', modelos: ['236', '445', '450'] },
  { marca: 'Echo', modelos: ['CS-590'] },
  { marca: 'Toyama', modelos: [] },
  { marca: 'Genérica/China', modelos: ['G4500', 'G5800'] },
],
// p004 Filtro aire MS 210/230/250
compatibilidades: [
  { marca: 'Stihl', modelos: ['MS 210', 'MS 230', 'MS 250'] },
],
// p005 Kit reparación carburador Walbro
compatibilidades: [
  { marca: 'Stihl', modelos: ['MS 170', 'MS 180'] },
  { marca: 'Husqvarna', modelos: ['236', '240'] },
  { marca: 'Echo', modelos: ['CS-310'] },
  { marca: 'Genérica/China', modelos: ['G3800'] },
],
// p006 Kit pistón Husqvarna 236/240
compatibilidades: [
  { marca: 'Husqvarna', modelos: ['236', '240'] },
],
// p007 Aceite de mezcla 2T
compatibilidades: [
  { marca: 'Stihl', modelos: [] },
  { marca: 'Husqvarna', modelos: [] },
  { marca: 'Honda', modelos: [] },
  { marca: 'Echo', modelos: [] },
  { marca: 'Toyama', modelos: [] },
  { marca: 'Genérica/China', modelos: [] },
],
// p008 Aceite de cadena 5 L  → mismo bloque que p007
compatibilidades: [
  { marca: 'Stihl', modelos: [] },
  { marca: 'Husqvarna', modelos: [] },
  { marca: 'Honda', modelos: [] },
  { marca: 'Echo', modelos: [] },
  { marca: 'Toyama', modelos: [] },
  { marca: 'Genérica/China', modelos: [] },
],
// p009 Cabezal de nylon universal
compatibilidades: [
  { marca: 'Stihl', modelos: ['FS 55', 'FS 120'] },
  { marca: 'Husqvarna', modelos: ['143R-II'] },
  { marca: 'Honda', modelos: ['UMK435'] },
  { marca: 'Toyama', modelos: ['RT43L'] },
  { marca: 'Genérica/China', modelos: [] },
],
// p010 Nylon de corte 2,4 mm
compatibilidades: [
  { marca: 'Stihl', modelos: [] },
  { marca: 'Husqvarna', modelos: [] },
  { marca: 'Honda', modelos: [] },
  { marca: 'Toyama', modelos: [] },
  { marca: 'Genérica/China', modelos: [] },
],
// p011 Motosierra Husqvarna 135
compatibilidades: [
  { marca: 'Husqvarna', modelos: ['135'] },
],
// p012 Arranque completo Stihl MS 170/180
compatibilidades: [
  { marca: 'Stihl', modelos: ['MS 170', 'MS 180'] },
],
// p013 Kit de afilado 5,5 mm
compatibilidades: [
  { marca: 'Stihl', modelos: [] },
  { marca: 'Husqvarna', modelos: [] },
  { marca: 'Echo', modelos: [] },
  { marca: 'Toyama', modelos: [] },
  { marca: 'Genérica/China', modelos: [] },
],
// p014 Casco forestal
compatibilidades: [],
// p015 Embrague completo Husqvarna 445/450
compatibilidades: [
  { marca: 'Husqvarna', modelos: ['445', '450'] },
],
// p016 Filtro de combustible universal
compatibilidades: [
  { marca: 'Stihl', modelos: ['MS 170', 'MS 180', 'MS 250'] },
  { marca: 'Husqvarna', modelos: ['236', '445'] },
  { marca: 'Echo', modelos: [] },
  { marca: 'Toyama', modelos: [] },
  { marca: 'Genérica/China', modelos: ['G4500'] },
],
// p017 Carburador completo Stihl MS 250
compatibilidades: [
  { marca: 'Stihl', modelos: ['MS 210', 'MS 230', 'MS 250'] },
],
// p018 Desbrozadora Toyama RT43L
compatibilidades: [
  { marca: 'Toyama', modelos: ['RT43L'] },
],
```

- [ ] **Step 3: Añadir 'Castor' a `MARCAS_MAQUINA` en `src/data/seed.ts:24`**

```ts
export const MARCAS_MAQUINA = ['Stihl', 'Husqvarna', 'Honda', 'Toyama', 'Echo', 'Castor', 'Genérica/China'] as const;
```

- [ ] **Step 4: Verificar que el build falla todavía (consumidores rotos)**

Run: `npx tsc -b`
Expected: FALLA con errores en `src/services/productos.ts`, `src/pages/Tienda.tsx`, `src/pages/Marcas.tsx`, `src/pages/Compatibilidad.tsx`, `src/pages/Producto.tsx`, `src/pages/admin/AdminProductos.tsx` (todos referencian `marcasCompatibles`/`modelosCompatibles`). Es lo esperado; se arreglan en las Tasks 2-5.

**NO COMMITEAR TODAVÍA.** Las Tasks 1-6 forman un solo commit (el refactor no compila a mitad de camino). Continuar a Task 2.

---

## Task 2: `src/services/productos.ts` — funciones de compatibilidad + guarda defensiva

**Files:**
- Modify: `src/services/productos.ts:20-24` (guarda), `:47-52`, `:54-62`, `:69-76`

- [ ] **Step 1: Guarda defensiva al leer de Firestore**

Reemplazar líneas 20-23:
```ts
  if (!cacheProductos) {
    const snap = await getDocs(collection(db!, 'productos'));
    cacheProductos = snap.docs.map((d) => ({ ...(d.data() as Producto), id: d.id }));
  }
```
por:
```ts
  if (!cacheProductos) {
    const snap = await getDocs(collection(db!, 'productos'));
    cacheProductos = snap.docs.map((d) => {
      const datos = d.data() as Producto;
      // Docs antiguos podrían no traer `compatibilidades`
      return { ...datos, id: d.id, compatibilidades: datos.compatibilidades ?? [] };
    });
  }
```

- [ ] **Step 2: `obtenerMarcasCompatibles` (líneas 47-52)**

```ts
/** Todas las marcas presentes en el catálogo (para el buscador de compatibilidad) */
export async function obtenerMarcasCompatibles(): Promise<string[]> {
  const productos = await obtenerProductos();
  const marcas = new Set<string>();
  productos.forEach((p) => p.compatibilidades.forEach((c) => marcas.add(c.marca)));
  return [...marcas].sort();
}
```

- [ ] **Step 3: `obtenerModelosPorMarca` (líneas 54-62)**

```ts
/** Modelos disponibles para una marca dada */
export async function obtenerModelosPorMarca(marca: string): Promise<string[]> {
  const productos = await obtenerProductos();
  const modelos = new Set<string>();
  productos.forEach((p) =>
    p.compatibilidades
      .filter((c) => c.marca === marca)
      .forEach((c) => c.modelos.forEach((m) => modelos.add(m))),
  );
  return [...modelos].sort();
}
```

- [ ] **Step 4: `buscarPorCompatibilidad` (líneas 69-76)**

```ts
/**
 * Buscador por compatibilidad de máquina (filtro estructurado).
 * Un producto compatible con la marca pero sin modelos declarados para ella
 * (consumible universal de la marca) también se incluye.
 */
export async function buscarPorCompatibilidad(marca: string, modelo?: string): Promise<Producto[]> {
  const productos = await obtenerProductos();
  return productos.filter((p) => {
    const c = p.compatibilidades.find((x) => x.marca === marca);
    if (!c) return false;
    if (!modelo) return true;
    return c.modelos.length === 0 || c.modelos.includes(modelo);
  });
}
```

- [ ] **Step 5: Verificar que `productos.ts` ya no menciona los campos viejos**

Run: `grep -n "marcasCompatibles\|modelosCompatibles" src/services/productos.ts`
Expected: sin resultados.

---

## Task 3: `Tienda.tsx`, `Marcas.tsx`, `Compatibilidad.tsx`

**Files:**
- Modify: `src/pages/Tienda.tsx:57-64`
- Modify: `src/pages/Marcas.tsx:29-36`
- Modify: `src/pages/Compatibilidad.tsx:33-36`

- [ ] **Step 1: `Tienda.tsx` — filtro (líneas 57-64)**

Reemplazar:
```ts
    if (marca) {
      lista = lista.filter((p) => {
        if (!p.marcasCompatibles.includes(marca)) return false;
        if (!modelo) return true;
        // Consumibles sin modelos declarados sirven para toda la marca
        return p.modelosCompatibles.length === 0 || p.modelosCompatibles.includes(modelo);
      });
    }
```
por:
```ts
    if (marca) {
      lista = lista.filter((p) => {
        const c = p.compatibilidades.find((x) => x.marca === marca);
        if (!c) return false;
        if (!modelo) return true;
        // Sin modelos declarados para esta marca = sirve para toda la marca
        return c.modelos.length === 0 || c.modelos.includes(modelo);
      });
    }
```

- [ ] **Step 2: `Marcas.tsx` — agregación (líneas 29-36)**

Reemplazar:
```ts
        for (const p of productos) {
          for (const m of p.marcasCompatibles) {
            const datos = mapa.get(m) ?? { productos: 0, modelos: new Set<string>() };
            datos.productos++;
            p.modelosCompatibles.forEach((mod) => datos.modelos.add(mod));
            mapa.set(m, datos);
          }
        }
```
por:
```ts
        for (const p of productos) {
          for (const c of p.compatibilidades) {
            const datos = mapa.get(c.marca) ?? { productos: 0, modelos: new Set<string>() };
            datos.productos++;
            c.modelos.forEach((mod) => datos.modelos.add(mod));
            mapa.set(c.marca, datos);
          }
        }
```

- [ ] **Step 3: `Compatibilidad.tsx` — conteo por marca (líneas 33-36)**

Reemplazar:
```ts
  const marcas = [...productos.reduce((mapa, p) => {
    p.marcasCompatibles.forEach((m) => mapa.set(m, (mapa.get(m) ?? 0) + 1));
    return mapa;
  }, new Map<string, number>())].sort((a, b) => b[1] - a[1]);
```
por:
```ts
  const marcas = [...productos.reduce((mapa, p) => {
    p.compatibilidades.forEach((c) => mapa.set(c.marca, (mapa.get(c.marca) ?? 0) + 1));
    return mapa;
  }, new Map<string, number>())].sort((a, b) => b[1] - a[1]);
```

---

## Task 4: `src/pages/Producto.tsx` — compatibilidad, relacionados y descripción vacía

**Files:**
- Modify: `src/pages/Producto.tsx:74-75` (relacionados), `:253-277` (sección compatible), `:279-283` (descripción)

- [ ] **Step 1: `puntaje` de relacionados (líneas 74-75)**

Reemplazar:
```ts
        const compartenModelo = x.modelosCompatibles.some((m) => p.modelosCompatibles.includes(m));
        const compartenMarca = x.marcasCompatibles.some((m) => p.marcasCompatibles.includes(m));
```
por:
```ts
        const marcasX = x.compatibilidades.map((c) => c.marca);
        const marcasP = p.compatibilidades.map((c) => c.marca);
        const modelosX = x.compatibilidades.flatMap((c) => c.modelos);
        const modelosP = p.compatibilidades.flatMap((c) => c.modelos);
        const compartenModelo = modelosX.some((m) => modelosP.includes(m));
        const compartenMarca = marcasX.some((m) => marcasP.includes(m));
```

- [ ] **Step 2: Sección "Compatible con" (líneas 253-277)**

Reemplazar todo el bloque `{/* Compatibilidad */} ... )}` por:
```tsx
          {/* Compatibilidad */}
          {producto.compatibilidades.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Compatible con</h2>
              <div className="space-y-2">
                {producto.compatibilidades.map((c) => (
                  <div key={c.marca} className="flex flex-wrap items-center gap-1.5">
                    <Link
                      to={`/tienda?marca=${encodeURIComponent(c.marca)}`}
                      className="rounded-full bg-verde/10 px-3 py-1 text-xs font-semibold text-verde hover:bg-verde/20"
                    >
                      {c.marca}
                    </Link>
                    {c.modelos.length > 0 ? (
                      c.modelos.map((m) => (
                        <span key={m} className="rounded-full border border-borde px-3 py-1 text-xs text-grafito/80">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gris-600">Todos los modelos</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
```

- [ ] **Step 3: Descripción vacía (líneas 279-283)**

Reemplazar:
```tsx
          {/* Descripción */}
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Descripción</h2>
            <p className="text-sm leading-relaxed text-grafito/90">{producto.descripcion}</p>
          </div>
```
por:
```tsx
          {/* Descripción */}
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-verde">Descripción</h2>
            {producto.descripcion.trim() ? (
              <p className="text-sm leading-relaxed text-grafito/90">{producto.descripcion}</p>
            ) : (
              <p className="text-sm leading-relaxed text-gris-600">
                Sin descripción detallada todavía.{' '}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`Hola, quiero consultar por el repuesto ${producto.sku} (${producto.nombre})`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-verde hover:underline"
                >
                  Escríbenos por WhatsApp
                </a>{' '}
                para confirmar compatibilidad y disponibilidad.
              </p>
            )}
          </div>
```

- [ ] **Step 4: Añadir el import de `WHATSAPP_NUMERO`**

`Producto.tsx` no importa nada de `../config/firebase` todavía. Añadir esta línea
justo después de `import { IconoCorazon } from '../components/Iconos';` (línea 15):
```ts
import { WHATSAPP_NUMERO } from '../config/firebase';
```

- [ ] **Step 5: Verificar Producto.tsx**

Run: `grep -n "marcasCompatibles\|modelosCompatibles" src/pages/Producto.tsx`
Expected: sin resultados.

---

## Task 5: `src/pages/admin/AdminProductos.tsx` — editor de compatibilidades + CSV

**Files:**
- Modify: `src/pages/admin/AdminProductos.tsx:72-81` (`productoVacio`), `:147-192` (CSV import), `:194-213` (CSV export), `:250-252` (texto ayuda), `:313-332` (formulario)

- [ ] **Step 1: `productoVacio()` (línea 78)**

Reemplazar `marcasCompatibles: [], modelosCompatibles: [],` por:
```ts
    compatibilidades: [],
```

- [ ] **Step 2: Helper de serialización de compatibilidades (añadir tras `productoVacio`)**

```ts
/**
 * Formato de texto para compatibilidades en CSV / campo libre:
 *   "Stihl:MS 250;MS 260|Husqvarna:445|Genérica/China:"
 * `|` separa marcas · `:` separa marca de sus modelos · `;` separa modelos.
 */
function compatibilidadesATexto(compat: Compatibilidad[]): string {
  return compat.map((c) => `${c.marca}:${c.modelos.join(';')}`).join('|');
}

function textoACompatibilidades(texto: string): Compatibilidad[] {
  return texto
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entrada) => {
      const idx = entrada.indexOf(':');
      const marca = (idx >= 0 ? entrada.slice(0, idx) : entrada).trim();
      const modelos = (idx >= 0 ? entrada.slice(idx + 1) : '')
        .split(';')
        .map((m) => m.trim())
        .filter(Boolean);
      return { marca, modelos };
    })
    .filter((c) => c.marca);
}
```

- [ ] **Step 3: Import del tipo `Compatibilidad` (línea 13)**

Cambiar:
```ts
import type { Categoria, Producto, TramoPrecio } from '../../types';
```
por:
```ts
import type { Categoria, Compatibilidad, Producto, TramoPrecio } from '../../types';
```

- [ ] **Step 4: CSV import (líneas 168-185, dentro de `importarCsv`)**

Reemplazar las líneas:
```ts
        marcasCompatibles: (celdas[idx('marcascompatibles')] ?? '').split('|').map((s) => s.trim()).filter(Boolean),
        modelosCompatibles: (celdas[idx('modeloscompatibles')] ?? '').split('|').map((s) => s.trim()).filter(Boolean),
```
por:
```ts
        compatibilidades: celdas[idx('compatibilidades')]
          ? textoACompatibilidades(celdas[idx('compatibilidades')])
          : (celdas[idx('marcascompatibles')] ?? '')
              .split('|').map((s) => s.trim()).filter(Boolean)
              .map((marca) => ({ marca, modelos: [] })),
```

Y actualizar el comentario JSDoc de la función (líneas 147-151):
```ts
  /**
   * Importación masiva por CSV. Columnas esperadas (con encabezado):
   * sku,nombre,descripcion,categoria,subcategoria,precio,precioOferta,stock,compatibilidades
   * `compatibilidades`: "Stihl:MS 250;MS 260|Husqvarna:445" (| marcas, : modelos, ; entre modelos).
   * Retrocompat: si solo viene `marcascompatibles` (listas con "|"), se toma como marcas sin modelos.
   */
```

- [ ] **Step 5: CSV export (líneas 197-204, dentro de `exportarCsv`)**

Reemplazar:
```ts
    const encabezado = 'sku,nombre,descripcion,categoria,subcategoria,precio,precioOferta,stock,marcasCompatibles,modelosCompatibles';
    const filas = productos.map((p) =>
      [
        esc(p.sku), esc(p.nombre), esc(p.descripcion), esc(p.categoria), esc(p.subcategoria),
        String(p.precio), p.precioOferta ? String(p.precioOferta) : '',
        String(p.stock), esc(p.marcasCompatibles.join('|')), esc(p.modelosCompatibles.join('|')),
      ].join(','),
    );
```
por:
```ts
    const encabezado = 'sku,nombre,descripcion,categoria,subcategoria,precio,precioOferta,stock,compatibilidades';
    const filas = productos.map((p) =>
      [
        esc(p.sku), esc(p.nombre), esc(p.descripcion), esc(p.categoria), esc(p.subcategoria),
        String(p.precio), p.precioOferta ? String(p.precioOferta) : '',
        String(p.stock), esc(compatibilidadesATexto(p.compatibilidades)),
      ].join(','),
    );
```

- [ ] **Step 6: Texto de ayuda de la barra (líneas 250-252)**

Reemplazar el `<span>` de ayuda por:
```tsx
        <span className="text-xs text-gris-600">
          CSV: sku,nombre,descripcion,categoria,subcategoria,precio,precioOferta,stock,compatibilidades — compatibilidades como “Stihl:MS 250;MS 260|Husqvarna:445”
        </span>
```

- [ ] **Step 7: Formulario — reemplazar los inputs de marcas/modelos (líneas 313-332)**

Reemplazar los dos `<div className="sm:col-span-2">` (marcas y modelos) por un editor de filas:
```tsx
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="mb-1 flex items-center gap-3">
                <label className="etiqueta mb-0">Compatibilidad por marca</label>
                <button
                  type="button"
                  onClick={() => setEditando({
                    ...editando,
                    compatibilidades: [...editando.compatibilidades, { marca: '', modelos: [] }],
                  })}
                  className="text-xs font-semibold text-verde hover:underline"
                >
                  + Agregar marca
                </button>
              </div>
              {editando.compatibilidades.map((c, i) => (
                <div key={i} className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                  <input
                    value={c.marca}
                    onChange={(e) => {
                      const compat = [...editando.compatibilidades];
                      compat[i] = { ...compat[i], marca: e.target.value };
                      setEditando({ ...editando, compatibilidades: compat });
                    }}
                    placeholder="Marca (ej: Stihl)"
                    className="campo w-40"
                    aria-label={`Marca compatible ${i + 1}`}
                  />
                  <input
                    value={c.modelos.join(', ')}
                    onChange={(e) => {
                      const compat = [...editando.compatibilidades];
                      compat[i] = { ...compat[i], modelos: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) };
                      setEditando({ ...editando, compatibilidades: compat });
                    }}
                    placeholder="Modelos separados por coma (vacío = toda la marca)"
                    className="campo flex-1"
                    aria-label={`Modelos compatibles de ${c.marca || `marca ${i + 1}`}`}
                  />
                  <button
                    type="button"
                    onClick={() => setEditando({ ...editando, compatibilidades: editando.compatibilidades.filter((_, j) => j !== i) })}
                    className="text-red-600"
                    aria-label="Quitar marca compatible"
                  >✕</button>
                </div>
              ))}
            </div>
```

- [ ] **Step 8: Verificar AdminProductos.tsx**

Run: `grep -n "marcasCompatibles\|modelosCompatibles" src/pages/admin/AdminProductos.tsx`
Expected: sin resultados.

---

## Task 6: Quitar los campos viejos del tipo + verificar build + commit del refactor

**Files:**
- Modify: `src/types/index.ts` (ya hecho en Task 1 — verificar)
- Verify: repo completo

- [ ] **Step 1: Confirmar que ningún archivo `src/` menciona los campos viejos**

Run: `grep -rn "marcasCompatibles\|modelosCompatibles" src/`
Expected: sin resultados. Si aparece algo, migrarlo con el mismo patrón (`p.compatibilidades`) antes de seguir.

- [ ] **Step 2: Build completo**

Run: `npm run build`
Expected: PASA (`tsc -b` verde + `vite build` OK).

- [ ] **Step 3: QA manual en modo demo**

Run: `npm run dev` y en el navegador:
- Portada → selector Marca "Stihl": el selector Modelo ofrece solo `MS 170/180/210/230/250/251/260/261/361`, `FS 55/120` — **NO** `CS-590`, `455 Rancher`, `RT43L`, `UMK435`, `G3800`.
- `/tienda?marca=Echo&modelo=CS-590`: devuelve la bujía y el kit Walbro (los que declaran Echo), no productos solo-Stihl.
- `/marcas`: cada marca muestra solo sus modelos.
- Ficha p014 (casco): no aparece la sección "Compatible con".
- Ficha p007 (aceite 2T): "Compatible con" lista las 6 marcas, cada una "Todos los modelos".

- [ ] **Step 4: Commit del refactor completo**

```bash
git add src/types/index.ts src/data/seed.ts src/services/productos.ts src/pages/Tienda.tsx src/pages/Marcas.tsx src/pages/Compatibilidad.tsx src/pages/Producto.tsx src/pages/admin/AdminProductos.tsx
git commit -m "Compatibilidad por marca: reemplazar arrays planos por campo estructurado

marcasCompatibles + modelosCompatibles eran dos listas independientes: un
repuesto cross-compatible aportaba todos sus modelos a todas sus marcas, así
el selector mostraba modelos Echo/Husqvarna al elegir Stihl. Ahora
Producto.compatibilidades: { marca, modelos }[] mantiene cada modelo con su
marca. Migrados los 18 productos demo y todos los consumidores (servicios,
Tienda, Marcas, Compatibilidad, Producto, AdminProductos + CSV).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013d5CiYTruToq7E47Vcj7pw"
```

---

## Task 7: Librería de transformación — parseo y normalización (TDD)

**Files:**
- Create: `scripts/lib/transformarInventario.ts`
- Create: `scripts/lib/transformarInventario.test.ts`

- [ ] **Step 1: Escribir los tests que fallan**

`scripts/lib/transformarInventario.test.ts`:
```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsearPrecio, parsearStock, slugId } from './transformarInventario';

test('parsearPrecio: quita $ y separador de miles', () => {
  assert.equal(parsearPrecio('$45,000'), 45000);
  assert.equal(parsearPrecio('$2,900'), 2900);
  assert.equal(parsearPrecio('$300'), 300);
  assert.equal(parsearPrecio('$0'), 0);
  assert.equal(parsearPrecio(''), 0);
});

test('parsearStock: entero, N/A -> 0, negativos -> 0', () => {
  assert.equal(parsearStock('2.00'), 2);
  assert.equal(parsearStock('152.00'), 152);
  assert.equal(parsearStock('0.00'), 0);
  assert.equal(parsearStock('N/A'), 0);
  assert.equal(parsearStock(''), 0);
});

test('slugId: prefijo inv-, minúsculas, sin acentos, sin caracteres raros', () => {
  assert.equal(slugId('AM102'), 'inv-am102');
  assert.equal(slugId('503 520 048'), 'inv-503-520-048');
  assert.equal(slugId('  C222 '), 'inv-c222');
  assert.equal(slugId('PIÑON-01'), 'inv-pinon-01');
});
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

Run: `npx tsx --test scripts/lib/transformarInventario.test.ts`
Expected: FALLA — "Cannot find module './transformarInventario'".

> Si esta versión de `tsx` no acepta `--test`, usar en su lugar:
> `node --import tsx --test scripts/lib/transformarInventario.test.ts`
> (y ajustar el script `test:scripts` de la Task 11 igual).

- [ ] **Step 3: Implementación mínima**

`scripts/lib/transformarInventario.ts`:
```ts
// ============================================================
// Lógica pura de importación del inventario del cliente.
// Sin dependencias de Firebase ni del DOM: testeable con node:test.
// ============================================================
import type { Compatibilidad, Producto } from '../../src/types';

/** "$45,000" -> 45000 (quita todo lo que no sea dígito) */
export function parsearPrecio(valor: string): number {
  const n = parseInt(valor.replace(/[^\d]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

/** "2.00" -> 2 ; "N/A" -> 0 ; negativo -> 0 */
export function parsearStock(valor: string): number {
  const n = Math.floor(parseFloat(valor));
  return Number.isNaN(n) || n < 0 ? 0 : n;
}

/** Código del inventario -> id de documento estable (`inv-` + slug) */
export function slugId(codigo: string): string {
  const slug = codigo
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita acentos (ñ -> n, á -> a)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `inv-${slug}`;
}
```

- [ ] **Step 4: Ejecutar los tests — deben pasar**

Run: `npx tsx --test scripts/lib/transformarInventario.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/transformarInventario.ts scripts/lib/transformarInventario.test.ts
git commit -m "Importador: helpers de parseo de precio, stock y slug de id

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013d5CiYTruToq7E47Vcj7pw"
```

---

## Task 8: Librería de transformación — marca y categoría (TDD)

**Files:**
- Modify: `scripts/lib/transformarInventario.ts`
- Modify: `scripts/lib/transformarInventario.test.ts`

- [ ] **Step 1: Añadir tests que fallan**

Añadir a `transformarInventario.test.ts`:
```ts
import { extraerMarcas, clasificar } from './transformarInventario';

test('extraerMarcas: por palabra clave del nombre', () => {
  assert.deepEqual(extraerMarcas('AMORTIGUADOR STIHL 361'), ['Stihl']);
  assert.deepEqual(extraerMarcas('CARBURADOR HQV61'), ['Husqvarna']);
  assert.deepEqual(extraerMarcas('CADENA 36/D HQV440-445-450 CASTOR 52CC-CHINAS'), ['Husqvarna', 'Castor', 'Genérica/China']);
  assert.deepEqual(extraerMarcas('FILTRO DE AIRE MS 250'), ['Stihl']);
  assert.deepEqual(extraerMarcas('ACEITE 10W30'), []);
});

test('clasificar: por departamento', () => {
  assert.deepEqual(clasificar('CARBURADORES', 'CARBURADOR HQV61'), { categoria: 'carburacion-arranque', subcategoria: 'Carburadores' });
  assert.deepEqual(clasificar('FILTRO DE AIRE', 'FILTRO X'), { categoria: 'filtros-bujias', subcategoria: 'Filtros de aire' });
  assert.deepEqual(clasificar('PIÑONES', 'PIÑON X'), { categoria: 'espadas-cadenas', subcategoria: 'Piñones' });
  assert.deepEqual(clasificar('BOBINAS', 'BOBINA MS250'), { categoria: 'repuestos-varios', subcategoria: 'Otros' });
});

test('clasificar: "- Sin Departamento -" por palabra clave del nombre', () => {
  assert.deepEqual(clasificar('- Sin Departamento -', 'ACEITE MEZCLA ANTEROS 125CC'), { categoria: 'aceites-lubricantes', subcategoria: 'Aceite de mezcla 2T' });
  assert.deepEqual(clasificar('- Sin Departamento -', 'CADENA 25/D STIHL170'), { categoria: 'espadas-cadenas', subcategoria: 'Cadenas' });
  assert.deepEqual(clasificar('- Sin Departamento -', 'SALVAMANO MS310-390-260'), { categoria: 'herramientas-seguridad', subcategoria: 'EPP' });
  assert.deepEqual(clasificar('- Sin Departamento -', 'PIEZA RARA XYZ'), { categoria: 'repuestos-varios', subcategoria: 'Otros' });
});
```

- [ ] **Step 2: Ejecutar — deben fallar**

Run: `npx tsx --test scripts/lib/transformarInventario.test.ts`
Expected: FALLA — "extraerMarcas is not exported".

- [ ] **Step 3: Implementación**

Añadir a `transformarInventario.ts`:
```ts
// Sin `\b` final tras los prefijos de modelo: "HQV61", "MS250C" deben matchear.
const PATRONES_MARCA: { marca: string; re: RegExp }[] = [
  { marca: 'Stihl', re: /\bSTIHL\b|\bSTHIL\b|\bMS\s?\d{2,3}|\bFS\s?\d{2,3}|\bST0\d\d/i },
  { marca: 'Husqvarna', re: /\bHUSQVARNA\b|\bHQV/i },
  { marca: 'Honda', re: /\bHONDA\b|\bGX\s?\d{2,3}/i },
  { marca: 'Toyama', re: /\bTOYAMA\b/i },
  { marca: 'Echo', re: /\bECHO\b/i },
  { marca: 'Castor', re: /\bCASTOR\b/i },
  { marca: 'Genérica/China', re: /\bCHIN[AO]S?\b|\bGEN[EÉ]RIC[AO]\b/i },
];

/** Marcas de máquina detectadas en el nombre (puede ser []) */
export function extraerMarcas(nombre: string): string[] {
  return PATRONES_MARCA.filter(({ re }) => re.test(nombre)).map(({ marca }) => marca);
}

type Clasif = { categoria: string; subcategoria: string };

const MAPA_DEPTO: Record<string, Clasif> = {
  CARBURADORES: { categoria: 'carburacion-arranque', subcategoria: 'Carburadores' },
  MEMBRANAS: { categoria: 'carburacion-arranque', subcategoria: 'Kits de reparación' },
  CODOS: { categoria: 'carburacion-arranque', subcategoria: 'Kits de reparación' },
  'MANGUERA BENCINA': { categoria: 'carburacion-arranque', subcategoria: 'Kits de reparación' },
  'RESORTE DE ARRANQUE': { categoria: 'carburacion-arranque', subcategoria: 'Arranque' },
  'MANGO DE PARTIDA': { categoria: 'carburacion-arranque', subcategoria: 'Arranque' },
  'FILTRO DE AIRE': { categoria: 'filtros-bujias', subcategoria: 'Filtros de aire' },
  'FILTROS BENCINA': { categoria: 'filtros-bujias', subcategoria: 'Filtros de combustible' },
  BUJIA: { categoria: 'filtros-bujias', subcategoria: 'Bujías' },
  PISTONES: { categoria: 'repuestos-varios', subcategoria: 'Pistones y cilindros' },
  ANILLOS: { categoria: 'repuestos-varios', subcategoria: 'Pistones y cilindros' },
  EMPAQUETADURA: { categoria: 'repuestos-varios', subcategoria: 'Pistones y cilindros' },
  EMBRAGUES: { categoria: 'repuestos-varios', subcategoria: 'Embragues' },
  TAMBORES: { categoria: 'repuestos-varios', subcategoria: 'Embragues' },
  'PIÑONES': { categoria: 'espadas-cadenas', subcategoria: 'Piñones' },
  CADENAS: { categoria: 'espadas-cadenas', subcategoria: 'Cadenas' },
  ESPADA: { categoria: 'espadas-cadenas', subcategoria: 'Espadas' },
  'TENSOR/PERNO/REGULDR': { categoria: 'espadas-cadenas', subcategoria: 'Espadas' },
  CABEZAL: { categoria: 'desbrozadoras', subcategoria: 'Accesorios de corte' },
  'SIN FIN': { categoria: 'desbrozadoras', subcategoria: 'Accesorios de corte' },
  LIMAS: { categoria: 'herramientas-seguridad', subcategoria: 'Afilado' },
  BOBINAS: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  'BOMBA ACEITE': { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  RETENES: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  RODAMIENTOS: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  POLEAS: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  AVR: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  AMORTIGUADORES: { categoria: 'repuestos-varios', subcategoria: 'Otros' },
  'MANO DE OBRA': { categoria: 'repuestos-varios', subcategoria: 'Otros' },
};

const REGLAS_NOMBRE: { re: RegExp; clasif: Clasif }[] = [
  { re: /ACEITE.*MEZCLA|MEZCLA.*ACEITE|\b2T\b/i, clasif: { categoria: 'aceites-lubricantes', subcategoria: 'Aceite de mezcla 2T' } },
  { re: /ACEITE.*CADENA/i, clasif: { categoria: 'aceites-lubricantes', subcategoria: 'Aceite de cadena' } },
  { re: /ACEITE|LUBRICANTE|GRASA/i, clasif: { categoria: 'aceites-lubricantes', subcategoria: 'Grasas' } },
  { re: /CADENA/i, clasif: { categoria: 'espadas-cadenas', subcategoria: 'Cadenas' } },
  { re: /ESPADA|\bBARRA\b/i, clasif: { categoria: 'espadas-cadenas', subcategoria: 'Espadas' } },
  { re: /PI[ÑN]ON/i, clasif: { categoria: 'espadas-cadenas', subcategoria: 'Piñones' } },
  { re: /FILTRO.*AIRE/i, clasif: { categoria: 'filtros-bujias', subcategoria: 'Filtros de aire' } },
  { re: /FILTRO/i, clasif: { categoria: 'filtros-bujias', subcategoria: 'Filtros de combustible' } },
  { re: /BUJIA/i, clasif: { categoria: 'filtros-bujias', subcategoria: 'Bujías' } },
  { re: /CARBURADOR|CARBURACION/i, clasif: { categoria: 'carburacion-arranque', subcategoria: 'Carburadores' } },
  { re: /ARRANQUE|PARTIDA|RESORTE|PIOLA|MANILLA/i, clasif: { categoria: 'carburacion-arranque', subcategoria: 'Arranque' } },
  { re: /CABEZAL|N[AY]LON|DESBROZ|DESMALEZ|ORILLAD|\bHILO\b/i, clasif: { categoria: 'desbrozadoras', subcategoria: 'Accesorios de corte' } },
  { re: /CASCO|PROTECTOR|GUANTE|ANTIPARRA|SALVAMANO|ARNES|FACIAL|OREJERA/i, clasif: { categoria: 'herramientas-seguridad', subcategoria: 'EPP' } },
  { re: /\bLIMA\b|AFILAD|ESMERIL/i, clasif: { categoria: 'herramientas-seguridad', subcategoria: 'Afilado' } },
  { re: /PISTON|CILINDRO|ANILLO/i, clasif: { categoria: 'repuestos-varios', subcategoria: 'Pistones y cilindros' } },
  { re: /EMBRAGUE|CAMPANA/i, clasif: { categoria: 'repuestos-varios', subcategoria: 'Embragues' } },
];

const CLASIF_FALLBACK: Clasif = { categoria: 'repuestos-varios', subcategoria: 'Otros' };

/** categoria/subcategoria del sitio a partir del departamento del inventario y el nombre */
export function clasificar(departamento: string, nombre: string): Clasif {
  const depto = departamento.trim().toUpperCase();
  if (depto in MAPA_DEPTO) return MAPA_DEPTO[depto];
  for (const { re, clasif } of REGLAS_NOMBRE) {
    if (re.test(nombre)) return clasif;
  }
  return CLASIF_FALLBACK;
}
```

- [ ] **Step 4: Ejecutar — deben pasar**

Run: `npx tsx --test scripts/lib/transformarInventario.test.ts`
Expected: PASS (6 tests). Si algún caso de `extraerMarcas`/`clasificar` no calza, ajustar el patrón hasta que pase (los tests son la especificación).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/transformarInventario.ts scripts/lib/transformarInventario.test.ts
git commit -m "Importador: extracción de marca y heurística de categoría

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013d5CiYTruToq7E47Vcj7pw"
```

---

## Task 9: Librería de transformación — fila a Producto + orquestador (TDD)

**Files:**
- Modify: `scripts/lib/transformarInventario.ts`
- Modify: `scripts/lib/transformarInventario.test.ts`

- [ ] **Step 1: Añadir tests que fallan**

Añadir a `transformarInventario.test.ts`:
```ts
import { transformarInventario } from './transformarInventario';

const CABECERA = 'Codigo\tDescripcion\tPrecio Costo\tPrecio Venta\tPrecio Mayoreo\tInventario\tInv. Minimo\tDepartamento';
const tsv = (...filas: string[]) => [CABECERA, ...filas].join('\r\n');

test('transformarInventario: fila normal con mayoreo -> 2 tramos', () => {
  const { productos } = transformarInventario(tsv(
    ' AM102\tAMORTIGUADOR STIHL 361\t$0\t$10,000\t$9,000\t3.00\t2\tAMORTIGUADORES',
  ));
  assert.equal(productos.length, 1);
  const p = productos[0];
  assert.equal(p.id, 'inv-am102');
  assert.equal(p.sku, 'AM102');
  assert.equal(p.nombre, 'AMORTIGUADOR STIHL 361');
  assert.equal(p.precio, 10000);
  assert.equal(p.stock, 3);
  assert.deepEqual(p.preciosPorVolumen, [
    { desde: 1, hasta: 9, precioUnitario: 10000 },
    { desde: 10, hasta: null, precioUnitario: 9000 },
  ]);
  assert.deepEqual(p.compatibilidades, [{ marca: 'Stihl', modelos: [] }]);
  assert.equal(p.categoria, 'repuestos-varios');
  assert.equal(p.subcategoria, 'Otros');
  assert.equal(p.activo, true);
  assert.equal(p.descripcion, '');
  assert.equal(p.destacado, false);
  assert.deepEqual(p.fotos, ['https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AM102']);
});

test('transformarInventario: sin mayoreo -> 1 tramo', () => {
  const { productos } = transformarInventario(tsv(
    ' 500\tTAPA DE CADENA CHINA\t$0\t$25,000\t$0\t1.00\t2\t- Sin Departamento -',
  ));
  assert.deepEqual(productos[0].preciosPorVolumen, [{ desde: 1, hasta: null, precioUnitario: 25000 }]);
  assert.deepEqual(productos[0].compatibilidades, [{ marca: 'Genérica/China', modelos: [] }]);
});

test('transformarInventario: nombre desde el código si la descripción está vacía', () => {
  const { productos, revisar } = transformarInventario(tsv(
    ' GOLILLA FS 120\t\t$0\t$10,000\t$0\t1.00\t0.000\t- Sin Departamento -',
  ));
  assert.equal(productos[0].nombre, 'GOLILLA FS 120');
  assert.equal(productos[0].sku, 'GOLILLA FS 120');
  assert.equal(productos[0].id, 'inv-golilla-fs-120');
  // nombre == código -> va a la lista de revisión
  assert.ok(revisar.some((r) => r.id === 'inv-golilla-fs-120'));
});

test('transformarInventario: descarta filas de prueba (precio <= 1)', () => {
  const { productos, descartados } = transformarInventario(tsv(
    ' 1\t1\t$0\t$1\t$0\tN/A\t0.000\t- Sin Departamento -',
    ' 6\tACEITE CADENA\t$0\t$1,500\t$0\tN/A\t0.000\t- Sin Departamento -',
  ));
  assert.equal(productos.length, 1);
  assert.equal(productos[0].sku, '6');
  assert.equal(descartados.length, 1);
  assert.equal(descartados[0].codigo, '1');
});

test('transformarInventario: MANO DE OBRA -> activo false', () => {
  const { productos } = transformarInventario(tsv(
    ' 40\tMANTENCION MOTOSIERRA\t$0\t$20,000\t$0\tN/A\t0.000\tMANO DE OBRA',
  ));
  assert.equal(productos[0].activo, false);
});

test('transformarInventario: ids duplicados por slug se desambiguan', () => {
  const { productos } = transformarInventario(tsv(
    ' AM 102\tPIEZA A\t$0\t$5,000\t$0\t1\t2\tAMORTIGUADORES',
    ' AM-102\tPIEZA B\t$0\t$5,000\t$0\t1\t2\tAMORTIGUADORES',
  ));
  assert.equal(productos[0].id, 'inv-am-102');
  assert.equal(productos[1].id, 'inv-am-102-2');
});
```

- [ ] **Step 2: Ejecutar — deben fallar**

Run: `npx tsx --test scripts/lib/transformarInventario.test.ts`
Expected: FALLA — "transformarInventario is not exported".

- [ ] **Step 3: Implementación**

Añadir a `transformarInventario.ts`:
```ts
export interface FilaInventario {
  codigo: string;
  descripcion: string;
  precioVenta: string;
  precioMayoreo: string;
  inventario: string;
  departamento: string;
}

export interface ResultadoTransformacion {
  productos: Producto[];
  /** Filas no importadas (prueba/basura) */
  descartados: { codigo: string; motivo: string }[];
  /** Productos importados que el cliente debería revisar */
  revisar: { id: string; nombre: string; motivo: string }[];
}

const PLACEHOLDER = (sku: string) =>
  `https://placehold.co/600x600/FFFFFF/9AA09B/png?text=${encodeURIComponent(sku)}`;

/** Parsea el TSV (tab-separado, con cabecera). Sin comillas ni escapes. */
export function parsearTsv(contenido: string): FilaInventario[] {
  const lineas = contenido.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lineas.slice(1).map((linea) => {
    const c = linea.split('\t');
    return {
      codigo: (c[0] ?? '').trim(),
      descripcion: (c[1] ?? '').trim(),
      precioVenta: (c[3] ?? '').trim(),
      precioMayoreo: (c[4] ?? '').trim(),
      inventario: (c[5] ?? '').trim(),
      departamento: (c[7] ?? '').trim(),
    };
  });
}

function tramos(precio: number, mayoreo: number) {
  if (mayoreo > 0 && mayoreo < precio) {
    return [
      { desde: 1, hasta: 9, precioUnitario: precio },
      { desde: 10, hasta: null, precioUnitario: mayoreo },
    ];
  }
  return [{ desde: 1, hasta: null as number | null, precioUnitario: precio }];
}

/** Ensambla un Producto a partir de una fila. `id` sin desambiguar. */
export function filaAProducto(fila: FilaInventario): Producto {
  const nombre = (fila.descripcion || fila.codigo).replace(/\s+/g, ' ').trim();
  const precio = parsearPrecio(fila.precioVenta);
  const mayoreo = parsearPrecio(fila.precioMayoreo);
  const marcas = extraerMarcas(nombre);
  const { categoria, subcategoria } = clasificar(fila.departamento, nombre);
  return {
    id: slugId(fila.codigo),
    sku: fila.codigo,
    nombre,
    descripcion: '',
    categoria,
    subcategoria,
    precio,
    stock: parsearStock(fila.inventario),
    fotos: [PLACEHOLDER(fila.codigo)],
    compatibilidades: marcas.map((marca): Compatibilidad => ({ marca, modelos: [] })),
    preciosPorVolumen: tramos(precio, mayoreo),
    destacado: false,
    activo: fila.departamento.trim().toUpperCase() !== 'MANO DE OBRA',
    bajoPedido: false,
  };
}

/** Orquesta: parsea, descarta basura, ensambla, desambigua ids, arma listas de revisión. */
export function transformarInventario(contenidoTsv: string): ResultadoTransformacion {
  const filas = parsearTsv(contenidoTsv);
  const productos: Producto[] = [];
  const descartados: ResultadoTransformacion['descartados'] = [];
  const revisar: ResultadoTransformacion['revisar'] = [];
  const idsVistos = new Map<string, number>();

  for (const fila of filas) {
    const precio = parsearPrecio(fila.precioVenta);
    if (precio <= 1) {
      descartados.push({ codigo: fila.codigo, motivo: `precio ${fila.precioVenta || '(vacío)'}` });
      continue;
    }
    const p = filaAProducto(fila);

    const previos = idsVistos.get(p.id) ?? 0;
    if (previos > 0) {
      p.id = `${p.id}-${previos + 1}`;
      revisar.push({ id: p.id, nombre: p.nombre, motivo: 'id duplicado por slug del código' });
    }
    idsVistos.set(slugId(fila.codigo), previos + 1);

    if (!fila.descripcion) {
      revisar.push({ id: p.id, nombre: p.nombre, motivo: 'sin descripción: el nombre es el código' });
    }
    productos.push(p);
  }

  return { productos, descartados, revisar };
}
```

- [ ] **Step 4: Ejecutar — deben pasar**

Run: `npx tsx --test scripts/lib/transformarInventario.test.ts`
Expected: PASS (12 tests).

- [ ] **Step 5: Verificar que el build sigue verde (scripts se typechea)**

Run: `npm run build`
Expected: PASA.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/transformarInventario.ts scripts/lib/transformarInventario.test.ts
git commit -m "Importador: fila del inventario -> Producto + orquestador

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013d5CiYTruToq7E47Vcj7pw"
```

---

## Task 10: Snapshot del inventario en el repo

**Files:**
- Create: `scripts/datos/inventario.tsv`

- [ ] **Step 1: Convertir el .xls (TSV en ISO-8859-1) a UTF-8**

Run (Git Bash):
```bash
mkdir -p scripts/datos
iconv -f ISO-8859-1 -t UTF-8 "/c/Users/aldon/Downloads/inventario_cdlms (1).xls" > scripts/datos/inventario.tsv
```

- [ ] **Step 2: Verificar el contenido**

Run: `head -3 scripts/datos/inventario.tsv && echo "---" && wc -l scripts/datos/inventario.tsv`
Expected: primera línea `Codigo	Descripcion	Precio Costo	Precio Venta	Precio Mayoreo	Inventario	Inv. Minimo	Departamento`; ~500 líneas (499 de datos).

- [ ] **Step 3: Commit**

```bash
git add scripts/datos/inventario.tsv
git commit -m "Datos: snapshot del inventario del cliente (UTF-8)

Copia de inventario_cdlms (1).xls (TSV ISO-8859-1) convertida a UTF-8.
El .xls original queda fuera del repo.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013d5CiYTruToq7E47Vcj7pw"
```

---

## Task 11: Script `importar-inventario.ts` + regeneración de `seed.ts`

**Files:**
- Create: `scripts/importar-inventario.ts`
- Modify: `package.json:7-12`
- Modify (generado): `src/data/seed.ts`

- [ ] **Step 1: Añadir scripts a `package.json`**

En `"scripts"`:
```json
    "seed": "tsx scripts/seed.ts",
    "importar-inventario": "tsx scripts/importar-inventario.ts",
    "test:scripts": "tsx --test scripts/lib/transformarInventario.test.ts"
```

- [ ] **Step 2: Escribir `scripts/importar-inventario.ts`**

```ts
// ============================================================
// Importador del inventario del cliente.
//
//   npm run importar-inventario                  regenera src/data/seed.ts
//   npm run importar-inventario -- --push        + sube a Firestore
//   npm run importar-inventario -- --push --solo-stock
//                                                solo actualiza stock/precio
//                                                de los docs ya existentes
//
// --push requiere serviceAccountKey.json en la raíz (ver scripts/seed.ts).
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { transformarInventario } from './lib/transformarInventario';
import type { Producto } from '../src/types';

const RUTA_TSV = resolve(process.cwd(), 'scripts/datos/inventario.tsv');
const RUTA_SEED = resolve(process.cwd(), 'src/data/seed.ts');

const CATEGORIAS = `[
  { id: 'motosierras', nombre: 'Motosierras', slug: 'motosierras', subcategorias: ['Profesionales', 'Semi-profesionales', 'Domésticas'], orden: 1 },
  { id: 'desbrozadoras', nombre: 'Desbrozadoras/Orilladoras', slug: 'desbrozadoras', subcategorias: ['Desbrozadoras', 'Orilladoras', 'Accesorios de corte'], orden: 2 },
  { id: 'espadas-cadenas', nombre: 'Espadas y Cadenas', slug: 'espadas-cadenas', subcategorias: ['Cadenas', 'Espadas', 'Piñones'], orden: 3 },
  { id: 'filtros-bujias', nombre: 'Filtros y Bujías', slug: 'filtros-bujias', subcategorias: ['Filtros de aire', 'Filtros de combustible', 'Bujías'], orden: 4 },
  { id: 'carburacion-arranque', nombre: 'Carburación y Arranque', slug: 'carburacion-arranque', subcategorias: ['Carburadores', 'Kits de reparación', 'Arranque'], orden: 5 },
  { id: 'aceites-lubricantes', nombre: 'Aceites y Lubricantes', slug: 'aceites-lubricantes', subcategorias: ['Aceite de mezcla 2T', 'Aceite de cadena', 'Grasas'], orden: 6 },
  { id: 'herramientas-seguridad', nombre: 'Herramientas y Seguridad', slug: 'herramientas-seguridad', subcategorias: ['Afilado', 'EPP', 'Herramientas'], orden: 7 },
  { id: 'repuestos-varios', nombre: 'Repuestos Varios', slug: 'repuestos-varios', subcategorias: ['Pistones y cilindros', 'Embragues', 'Otros'], orden: 8 },
]`;

function generarSeed(productos: Producto[]): string {
  return `// ============================================================
// ARCHIVO GENERADO por scripts/importar-inventario.ts — NO EDITAR A MANO.
// Fuente: scripts/datos/inventario.tsv
// Para regenerar: npm run importar-inventario
// ============================================================
import type { Categoria, Producto } from '../types';

export const CATEGORIAS_SEED: Categoria[] = ${CATEGORIAS};

/** Marcas de máquinas soportadas por el buscador de compatibilidad */
export const MARCAS_MAQUINA = ['Stihl', 'Husqvarna', 'Honda', 'Toyama', 'Echo', 'Castor', 'Genérica/China'] as const;

export const PRODUCTOS_SEED: Producto[] = ${JSON.stringify(productos, null, 2)};
`;
}

async function subir(productos: Producto[], soloStock: boolean): Promise<void> {
  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const rutaClave = resolve(process.cwd(), 'serviceAccountKey.json');
  let credencial: Record<string, unknown>;
  try {
    credencial = JSON.parse(readFileSync(rutaClave, 'utf8')) as Record<string, unknown>;
  } catch {
    console.error('No se encontró serviceAccountKey.json en la raíz del proyecto.');
    process.exit(1);
  }
  initializeApp({ credential: cert(rutaClave) });
  const db = getFirestore();
  console.log(`Proyecto: ${credencial.project_id as string}`);

  if (soloStock) {
    let ok = 0;
    const faltantes: string[] = [];
    for (const p of productos) {
      const ref = db.collection('productos').doc(p.id);
      const snap = await ref.get();
      if (!snap.exists) { faltantes.push(p.id); continue; }
      await ref.update({ stock: p.stock, precio: p.precio, preciosPorVolumen: p.preciosPorVolumen });
      ok++;
    }
    console.log(`✔ Stock/precio actualizado en ${ok} productos.`);
    if (faltantes.length) console.log(`  ${faltantes.length} ids del inventario no existen en Firestore: ${faltantes.slice(0, 10).join(', ')}${faltantes.length > 10 ? '…' : ''}`);
    return;
  }

  // Categorías
  const cats = JSON.parse(CATEGORIAS.replace(/(\w+):/g, '"$1":').replace(/'/g, '"')) as { id: string }[];
  for (const cat of cats) {
    const { id, ...datos } = cat as Record<string, unknown> & { id: string };
    await db.collection('categorias').doc(id).set(datos);
  }
  console.log(`✔ ${cats.length} categorías subidas.`);

  // Productos en lotes de 450
  for (let i = 0; i < productos.length; i += 450) {
    const lote = db.batch();
    for (const p of productos.slice(i, i + 450)) {
      const { id, ...datos } = p;
      lote.set(db.collection('productos').doc(id), datos);
    }
    await lote.commit();
  }
  console.log(`✔ ${productos.length} productos subidos a Firestore.`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const push = args.includes('--push');
  const soloStock = args.includes('--solo-stock');

  const tsv = readFileSync(RUTA_TSV, 'utf8');
  const { productos, descartados, revisar } = transformarInventario(tsv);

  console.log(`\nInventario: ${productos.length} productos (${productos.filter((p) => p.activo).length} activos)`);
  console.log(`Descartados: ${descartados.length}`);
  const porCat = new Map<string, number>();
  productos.forEach((p) => porCat.set(p.categoria, (porCat.get(p.categoria) ?? 0) + 1));
  [...porCat.entries()].sort().forEach(([c, n]) => console.log(`  ${c}: ${n}`));
  if (revisar.length) {
    console.log(`\nRevisar (${revisar.length}):`);
    revisar.slice(0, 30).forEach((r) => console.log(`  ${r.id} — ${r.nombre} — ${r.motivo}`));
    if (revisar.length > 30) console.log(`  …y ${revisar.length - 30} más`);
  }

  if (!soloStock) {
    writeFileSync(RUTA_SEED, generarSeed(productos), 'utf8');
    console.log(`\n✔ ${RUTA_SEED} regenerado.`);
  }

  if (push) await subir(productos, soloStock);
  else console.log('\n(Sin --push: no se tocó Firestore.)');
}

main().catch((e) => { console.error(e); process.exit(1); });
```

> Nota sobre la subida de categorías: el `JSON.parse` de `CATEGORIAS` con regex es frágil. Si al implementar resulta incómodo, extraer `CATEGORIAS_SEED` a un `const` tipado dentro del script y usarlo tanto para generar el texto (`JSON.stringify`) como para subir — más simple y sin regex. Preferir esa forma.

- [ ] **Step 3: Regenerar el seed**

Run: `npm run importar-inventario`
Expected: imprime el resumen (≈497 productos, conteo por categoría, lista de revisión con `inv-c222` y similares) y "src/data/seed.ts regenerado". NO toca Firestore.

- [ ] **Step 4: Revisar el diff del seed**

Run: `git diff --stat src/data/seed.ts` y luego `grep -c '"id":' src/data/seed.ts`
Expected: ~497. Abrir el archivo y revisar 5-10 productos a mano (precio entero, stock entero, `compatibilidades` con forma `{ marca, modelos: [] }`, categoría plausible).

- [ ] **Step 5: Build + tests**

Run: `npm run build && npm run test:scripts`
Expected: ambos PASAN. (El seed generado es un objeto JSON válido como `Producto[]`; `tsc` lo acepta.)

- [ ] **Step 6: QA manual en modo demo**

Run: `npm run dev` — la tienda ahora muestra ~491 productos reales; `/marcas` lista Stihl/Husqvarna/Honda/Toyama/Echo/Castor/Genérica con "Consumibles universales para toda la marca"; una ficha cualquiera muestra el placeholder de descripción y foto genérica.

- [ ] **Step 7: Commit**

```bash
git add scripts/importar-inventario.ts package.json src/data/seed.ts
git commit -m "Importador: genera seed.ts y sube a Firestore; catálogo real (~497 ítems)

seed.ts pasa a ser archivo generado desde scripts/datos/inventario.tsv.
--push sube a Firestore por lotes; --push --solo-stock actualiza solo
stock/precio de los docs existentes (para actualizaciones futuras).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013d5CiYTruToq7E47Vcj7pw"
```

---

## Task 12: `Home.tsx` — fallback de "Productos destacados" vacío

**Files:**
- Modify: `src/pages/Home.tsx:57`

- [ ] **Step 1: Añadir el import de `estadoStock`**

Línea 19, cambiar:
```ts
import { useSeo } from '../utils/seo';
```
a (añadir línea antes):
```ts
import { estadoStock } from '../utils/precio';
import { useSeo } from '../utils/seo';
```

- [ ] **Step 2: Fallback en `destacados` (línea 57)**

Reemplazar:
```ts
  const destacados = productos.filter((p) => p.destacado || (p.precioOferta && p.precioOferta < p.precio)).slice(0, 8);
```
por:
```ts
  const marcados = productos.filter((p) => p.destacado || (p.precioOferta && p.precioOferta < p.precio));
  // Sin destacados ni ofertas (catálogo recién importado): mostrar productos con stock
  const destacados = (marcados.length > 0 ? marcados : productos.filter((p) => estadoStock(p) !== 'agotado')).slice(0, 8);
```

- [ ] **Step 3: Build + QA**

Run: `npm run build` → PASA. `npm run dev` → la portada muestra 8 productos en "Productos destacados".

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "Home: fallback de destacados cuando no hay marcados ni ofertas

Con el catálogo recién importado ningún producto tiene destacado ni oferta;
la sección quedaba con encabezado y grilla vacía. Ahora cae a los primeros
8 productos con stock.

(Este commit también arrastra un fix suelto previo del <img> del hero
—atributo fetchPriority— que ya estaba en el working tree.)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013d5CiYTruToq7E47Vcj7pw"
```

---

## Task 13: Actualizar `CLAUDE.md` — PENDIENTES

**Files:**
- Modify: `CLAUDE.md` (sección "Pendientes conocidos")

- [ ] **Step 1: Actualizar los pendientes de Firebase y catálogo**

En la sección `## Pendientes conocidos`:
- Reemplazar la viñeta larga "Deploy a Firebase pendiente: … **no existe proyecto Firebase para esta tienda** …" por:
```md
- Deploy a Firebase: el proyecto `la-casa-de-la-motosierra` ya existe y está
  enlazado (`.firebaserc`). Falta: `serviceAccountKey.json` en la raíz para
  `npm run importar-inventario -- --push`, y `firebase deploy --only
  hosting,firestore:rules,storage:rules`. Las functions de pago requieren plan
  Blaze y sus secretos (rama de pagos).
```
- Reemplazar "Fotos placeholder en varios productos hasta recibir el catálogo oficial del proveedor." por:
```md
- Catálogo real importado (~497 ítems). Pendiente de enriquecer desde el panel
  admin: fotos propias (hoy placeholder), descripciones, modelos compatibles
  por marca, revisar categorías de la heurística y renombrar ítems cuyo nombre
  es solo un código (`inv-c222`, etc.). `src/data/seed.ts` es archivo generado
  (`npm run importar-inventario`).
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "Docs: actualizar PENDIENTES (proyecto Firebase creado, catálogo importado)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013d5CiYTruToq7E47Vcj7pw"
```

---

## Task 14: Subir a Firestore + verificación final (runbook manual)

**Requisito:** `serviceAccountKey.json` en la raíz del proyecto (lo genera el usuario en la consola Firebase → Configuración → Cuentas de servicio → Generar nueva clave privada). También `.env` con las 6 `VITE_FIREBASE_*` (ya configurado).

- [ ] **Step 1: Verificación completa del build y tests**

Run: `npm run build && npm run test:scripts`
Expected: ambos PASAN.

- [ ] **Step 2: Confirmar que existe la llave**

Run: `ls -la serviceAccountKey.json .env .firebaserc`
Expected: los tres existen. (No abrir su contenido.)

- [ ] **Step 3: Subir a Firestore**

Run: `npm run importar-inventario -- --push`
Expected: imprime "✔ 8 categorías subidas." y "✔ ~497 productos subidos a Firestore." sin errores.

- [ ] **Step 4: Verificar en Firebase**

En la consola Firebase → Firestore: colección `productos` con ~497 documentos, colección `categorias` con 8. Abrir un doc `inv-*` y confirmar la forma (`compatibilidades` como array de `{ marca, modelos }`).

- [ ] **Step 5: QA de la app contra Firebase real**

Run: `npm run build && npm run preview` y en el navegador (`localhost:4173`):
- La tienda carga el catálogo desde Firestore (no demo).
- Portada → Marca "Stihl" → el selector Modelo **no** mezcla modelos de otras marcas.
- `/tienda?marca=Husqvarna` filtra correctamente.
- `/marcas` muestra las 7 marcas con conteos.
- Una ficha muestra placeholder de descripción + foto genérica.
- Portada "Productos destacados" con 8 ítems.
- Panel admin (`/admin`, usuario admin) → Productos: se listan los ~497, el editor de compatibilidades del formulario funciona, exportar CSV genera la columna `compatibilidades`.

- [ ] **Step 6: (Opcional) Deploy de hosting + reglas**

Run: `firebase deploy --only hosting,firestore:rules,storage:rules`
Expected: despliega sin errores. (El CLI ya está autenticado; si pide login, lo hace el usuario.)

- [ ] **Step 7: Merge de la rama**

Usar la sub-skill `superpowers:finishing-a-development-branch` para decidir merge/PR.

---

## Auto-revisión del plan (hecha)

**Cobertura del spec:**
- Refactor `compatibilidades` → Tasks 1-6. ✓
- `obtenerMarcasCompatibles` / `obtenerModelosPorMarca` / `buscarPorCompatibilidad` → Task 2. ✓
- Guarda defensiva Firestore → Task 2 Step 1. ✓
- Tienda / Marcas / Compatibilidad / Producto / AdminProductos → Tasks 3-5. ✓
- `MaquinaCliente` sin cambios, `BuscadorCompatibilidad` sin cambios → confirmado en "Estructura de archivos". ✓
- `MARCAS_MAQUINA` += Castor → Task 1 Step 3 (y en el seed generado, Task 11). ✓
- Librería pura + tests (`node:test`) → Tasks 7-9. ✓
- Reglas de transformación (precio, stock, id, nombre, tramos, fotos, activo) → Tasks 7-9, con tests. ✓
- Heurística de categoría (mapa depto + palabras clave) → Task 8. ✓
- Extracción de marca (patrones) → Task 8. ✓
- `scripts/datos/inventario.tsv` → Task 10. ✓
- Script `importar-inventario` con `--push` y `--push --solo-stock` → Task 11. ✓
- Regeneración de `seed.ts` con `CATEGORIAS_SEED` + `MARCAS_MAQUINA` fijos → Task 11. ✓
- `package.json` scripts → Task 11 Step 1. ✓
- Placeholder de descripción vacía en Producto.tsx → Task 4 Step 3. ✓
- Fallback de destacados en Home.tsx → Task 12. ✓
- Estados vacíos aceptados (`/tienda?ofertas=1`) → sin tarea (comportamiento actual suficiente, per spec). ✓
- Verificación (build, test:scripts, diff del seed, QA navegador, push, conteo Firestore) → Tasks 6, 9, 11, 14. ✓
- `CLAUDE.md` PENDIENTES → Task 13. ✓

**Consistencia de tipos:** `Compatibilidad { marca: string; modelos: string[] }` usado igual en types, servicios, páginas, admin (`compatibilidadesATexto`/`textoACompatibilidades`), y librería (`filaAProducto` → `marcas.map((marca): Compatibilidad => ({ marca, modelos: [] }))`). `transformarInventario` devuelve `{ productos, descartados, revisar }` — misma forma en Task 9 (definición) y Task 11 (consumo). ✓

**Sin placeholders:** cada step de código tiene el código completo. Los patrones regex de marca/categoría en Task 8 son "best effort": los tests de Task 8 Step 1 son la especificación y el step 4 dice ajustar hasta que pasen. ✓

**Riesgo anotado:** el JSON.parse con regex de `CATEGORIAS` en el importador es frágil — la nota del Task 11 Step 2 indica preferir un `const` tipado compartido. El ejecutor debe tomar esa forma.
