# Importación del inventario real + refactor de compatibilidad por marca

Fecha: 2026-08-30
Estado: aprobado (diseño)

## Contexto

- El catálogo hoy son 18 productos demo hechos a mano (`src/data/seed.ts`), datos
  ficticios pero con fichas ricas (fotos, descripciones, tramos de volumen,
  compatibilidad).
- El cliente entregó su inventario real: `inventario_cdlms (1).xls` — en realidad
  un TSV (tab-separado), codificación ISO-8859-1, CRLF, 499 filas de datos.
  Columnas: `Codigo`, `Descripcion`, `Precio Costo`, `Precio Venta`,
  `Precio Mayoreo`, `Inventario`, `Inv. Minimo`, `Departamento`.
- Ya existe el proyecto Firebase (antes no; ver
  `memory/estado-deploy-firebase.md`). Falta `.env` y `serviceAccountKey.json`
  en la raíz (ambos en `.gitignore`) — los pone el usuario, nadie los pega en el chat.
- **Bug encontrado durante el análisis:** el filtro "por marca/modelo" mezcla
  modelos entre marcas. Al elegir *Stihl* el selector ofrece `CS-590` (Echo),
  `455 Rancher` (Husqvarna), `RT43L` (Toyama), `UMK435` (Honda). Afecta portada,
  `/tienda`, `/marcas` y `/compatibilidad` (todos leen los mismos campos).

### Causa raíz del bug de compatibilidad

En `Producto`, `marcasCompatibles: string[]` y `modelosCompatibles: string[]` son
dos listas planas independientes, sin relación entre sí. Un repuesto
cross-compatible aporta **todos** sus modelos a **cada** una de sus marcas.
`obtenerModelosPorMarca('Stihl')` devuelve la unión de modelos de todo producto
que tenga "Stihl" en su lista, incluidos modelos de otras marcas de esos productos.

## Objetivo

1. Reestructurar el dato de compatibilidad para que cada marca liste solo sus
   modelos.
2. Cargar el inventario real (~497 ítems tras limpieza) a Firestore y regenerar
   `src/data/seed.ts` desde el inventario (una sola fuente de verdad).
3. Dejar una vía re-ejecutable para futuras actualizaciones de stock/precio sin
   pisar el enriquecimiento manual del cliente.

Todo en un solo spec / rama / PR (decisión del usuario: "todo junto").

## Decisiones tomadas (con el usuario)

| Tema | Decisión |
|---|---|
| Catálogo demo actual | Reemplazar todo. Firestore y `seed.ts` quedan solo con el inventario real. |
| `src/data/seed.ts` | Regenerado desde el inventario. Pasa a ser archivo generado. |
| Publicación | Todo `activo: true`, categoría por heurística; salvo los 6 servicios de "MANO DE OBRA" → `activo: false`. |
| IVA | Los "Precio Venta" ya incluyen IVA. Entran tal cual a `precio`. |
| Precio Mayoreo | Tramo por volumen desde 10 unidades cuando `mayoreo > 0 && mayoreo < venta`. |
| Compatibilidad | Solo marca por palabras clave del nombre. `modelos` vacío en toda la importación. |
| Servicios "MANO DE OBRA" | Importar como `activo: false`. |
| Alcance | Refactor de compatibilidad + importación + regeneración de seed, juntos. |
| Universales multi-marca | Una entrada por marca con `modelos: []`. |

---

## Parte 1 — Refactor de compatibilidad

### Nuevo modelo de datos (`src/types/index.ts`)

```ts
/** Compatibilidad de un repuesto con una marca de máquina y sus modelos */
export interface Compatibilidad {
  marca: string;
  /** Modelos de esa marca; vacío = sirve para toda la marca (consumible universal) */
  modelos: string[];
}

export interface Producto {
  // …resto igual…
  /** Reemplaza a marcasCompatibles + modelosCompatibles */
  compatibilidades: Compatibilidad[];
}
```

- Se **eliminan** `marcasCompatibles` y `modelosCompatibles` de `Producto`.
- `compatibilidades: []` = repuesto no atado a ninguna máquina (aceites, EPP,
  consumibles genéricos). No aparece en ningún filtro de marca, sí en el catálogo.
- `MaquinaCliente` (perfil de usuario) **no cambia**: sigue guardando
  `{ marca, modelo }` como strings.

### `src/services/productos.ts`

```ts
export async function obtenerMarcasCompatibles(): Promise<string[]> {
  const productos = await obtenerProductos();
  const marcas = new Set<string>();
  productos.forEach((p) => p.compatibilidades.forEach((c) => marcas.add(c.marca)));
  return [...marcas].sort();
}

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

`buscarPorTexto` no usa compatibilidad — sin cambios.

### Guardas defensivas

Al leer de Firestore, un documento sin `compatibilidades` rompería `.forEach`.
`obtenerProductos` (rama Firebase) normaliza:

```ts
cacheProductos = snap.docs.map((d) => {
  const data = d.data() as Producto;
  return { ...data, id: d.id, compatibilidades: data.compatibilidades ?? [] };
});
```

### `src/pages/Tienda.tsx`

Filtro de marca/modelo (líneas ~57-64) pasa a usar `compatibilidades`:

```ts
if (marca) {
  lista = lista.filter((p) => {
    const c = p.compatibilidades.find((x) => x.marca === marca);
    if (!c) return false;
    if (!modelo) return true;
    return c.modelos.length === 0 || c.modelos.includes(modelo);
  });
}
```

### `src/pages/Marcas.tsx`

La agregación recorre `p.compatibilidades` en vez de los dos arrays paralelos:
por cada `c` de `p.compatibilidades`, suma 1 a `c.marca` y agrega `c.modelos` al
set de esa marca. El resto de la página no cambia.

### `src/pages/Compatibilidad.tsx`

El `reduce` que cuenta repuestos por marca (líneas ~33-36) recorre
`p.compatibilidades` en vez de `p.marcasCompatibles`.

### `src/pages/Producto.tsx`

- Sección "Compatible con" (líneas ~257-279): itera `producto.compatibilidades`.
  Por cada marca: un chip-enlace a `/tienda?marca=…`, y debajo sus modelos como
  chips de texto. Si la marca no tiene modelos → "Universal para toda la marca".
  Si `compatibilidades` está vacío → no se muestra la sección.
- `puntaje` de productos relacionados (líneas ~73-78): "comparten marca" =
  intersección de `marca` en `compatibilidades`; "comparten modelo" = intersección
  de pares `marca+modelo`.

### `src/pages/admin/AdminProductos.tsx`

- Formulario: reemplazar los dos inputs "Marcas compatibles" / "Modelos
  compatibles" por un editor de `compatibilidades`: lista de filas
  `[ marca (input) | modelos separados por coma (input) | quitar ]` + "Agregar
  marca". Mismo patrón visual que el editor de tramos de volumen ya existente.
- `productoVacio()`: `compatibilidades: []` en vez de los dos arrays.
- **Importador CSV** (`importarCsv`): la columna `marcascompatibles` (listas con
  `|`) se mantiene para marca; nueva columna opcional `compatibilidades` con
  formato `Marca:modelo1;modelo2|Marca2:` (— `|` separa marcas, `:` separa marca
  de sus modelos, `;` separa modelos). Si solo viene `marcascompatibles`, se
  arma `compatibilidades` con `modelos: []` por marca. Documentar el nuevo
  formato en el texto de ayuda de la barra.
- **Exportador CSV** (`exportarCsv`): nueva columna `compatibilidades` con ese
  mismo formato; se mantiene `marcascompatibles` (derivada) para lectura humana.

### `src/data/seed.ts`

`MARCAS_MAQUINA`: agregar `'Castor'` (aparece en ~20 ítems del inventario; el
filtro es data-driven, así que basta con que los productos la usen — la constante
solo documenta el conjunto canónico).

---

## Parte 2 — Importador

### Enfoque

Script `scripts/importar-inventario.ts` + lógica pura extraída a
`scripts/lib/transformarInventario.ts` (testeable con `node --test`).

- **Sin flags:** lee `scripts/datos/inventario.tsv`, transforma, y **regenera
  `src/data/seed.ts`** (plantilla con `CATEGORIAS_SEED` y `MARCAS_MAQUINA` fijos +
  `PRODUCTOS_SEED` generado). Cabecera del archivo:
  `// ARCHIVO GENERADO por scripts/importar-inventario.ts — no editar a mano.`
- **`--push`:** además sube a Firestore con `firebase-admin` +
  `serviceAccountKey.json` (mismo patrón que `scripts/seed.ts`). Escritura en
  lotes (`db.batch()`, chunks de 450). Sube las 8 categorías y los ~497 productos
  con `set` por id (upsert).
- **`--push --solo-stock`:** solo `updateDoc` de `stock`, `precio`, `precioOferta`
  (borrar si no hay) y `preciosPorVolumen` de los docs cuyo `id` ya existe.
  **No toca** `nombre`, `descripcion`, `categoria`, `compatibilidades`, `fotos`,
  `activo`, `destacado`. Reporta ids del inventario que no existen en Firestore.

`package.json`: `"importar-inventario": "tsx scripts/importar-inventario.ts"`,
`"test:scripts": "tsx --test scripts/lib/*.test.ts"` (ajustar la invocación exacta
en implementación si la versión de tsx lo requiere).

### Flujo de uso

```bash
# el usuario deja serviceAccountKey.json y .env en la raíz
npm run importar-inventario              # regenera seed.ts → revisar git diff
npm run build                            # tsc estricto verde
npm run importar-inventario -- --push    # sube a Firestore

# actualizaciones futuras: reemplazar scripts/datos/inventario.tsv y:
npm run importar-inventario -- --push --solo-stock
```

### Datos de entrada

`scripts/datos/inventario.tsv` = copia UTF-8 de `inventario_cdlms (1).xls`,
commiteada. El `.xls` original queda fuera del repo.

### Reglas de transformación (fila → `Producto`)

**Limpieza previa:**
- Trim de cada celda; colapsar espacios internos del nombre.
- `precio`, `mayoreo`: `parseInt(celda.replace(/[^\d]/g, ''), 10)`
  (`$45,000` → `45000`, `$300` → `300`, `$0` → `0`).
- `stock`: `Math.max(0, Math.floor(parseFloat(celda)))`; `N/A` → `0`.
- **Descartar filas** con `precio < 100` (2 filas de prueba: códigos `1` y `1000`,
  precio `$1`). Resultado: **497 ítems** (491 activos + 6 servicios inactivos).

**Campos:**

| Campo | Valor |
|---|---|
| `id` | `inv-` + slug(Codigo): minúsculas, sin acentos, `[^a-z0-9]+` → `-`, sin guiones extremos. (Códigos verificados: sin duplicados, sin `/`.) |
| `sku` | Codigo (trim), tal cual |
| `nombre` | `Descripcion` si no está vacía; si no, `Codigo`. Verbatim (MAYÚS incluidas). |
| `descripcion` | `''` |
| `categoria`, `subcategoria` | Heurística (abajo) |
| `precio` | Precio Venta |
| `precioOferta` | — (nunca) |
| `stock` | Inventario |
| `preciosPorVolumen` | `mayoreo > 0 && mayoreo < precio` → `[{desde:1,hasta:9,precioUnitario:precio},{desde:10,hasta:null,precioUnitario:mayoreo}]`; si no → `[{desde:1,hasta:null,precioUnitario:precio}]` |
| `compatibilidades` | Extracción de marca (abajo). Sin match → `[]` |
| `fotos` | `["https://placehold.co/600x600/FFFFFF/9AA09B/png?text=" + encodeURIComponent(sku)]` |
| `destacado` | `false` |
| `activo` | `true`; `false` si `Departamento === 'MANO DE OBRA'` |
| `bajoPedido` | `false` |

**No se importa** `Precio Costo` (dato interno) ni `Inv. Minimo`.

### Heurística de categoría

Tabla departamento → `categoria` / `subcategoria`:

| Departamento(s) | categoria | subcategoria |
|---|---|---|
| CARBURADORES | carburacion-arranque | Carburadores |
| MEMBRANAS, CODOS, MANGUERA BENCINA | carburacion-arranque | Kits de reparación |
| RESORTE DE ARRANQUE, MANGO DE PARTIDA | carburacion-arranque | Arranque |
| FILTRO DE AIRE | filtros-bujias | Filtros de aire |
| FILTROS BENCINA | filtros-bujias | Filtros de combustible |
| BUJIA | filtros-bujias | Bujías |
| PISTONES, ANILLOS, EMPAQUETADURA | repuestos-varios | Pistones y cilindros |
| EMBRAGUES, TAMBORES | repuestos-varios | Embragues |
| PIÑONES | espadas-cadenas | Piñones |
| CADENAS | espadas-cadenas | Cadenas |
| ESPADA, TENSOR/PERNO/REGULDR | espadas-cadenas | Espadas |
| CABEZAL, SIN FIN | desbrozadoras | Accesorios de corte |
| LIMAS | herramientas-seguridad | Afilado |
| BOBINAS, BOMBA ACEITE, RETENES, RODAMIENTOS, POLEAS, AVR, AMORTIGUADORES | repuestos-varios | Otros |
| MANO DE OBRA | repuestos-varios | Otros (+ `activo: false`) |
| - Sin Departamento - | heurística por palabra clave (abajo) |

Palabra clave sobre `nombre` en MAYÚS, primer match gana; fallback
`repuestos-varios` / `Otros`:

1. `ACEITE|LUBRICANTE|GRASA` → aceites-lubricantes (`MEZCLA|2T`→Aceite de mezcla 2T; `CADENA`→Aceite de cadena; resto→Grasas)
2. `CADENA` → espadas-cadenas / Cadenas
3. `ESPADA|\bBARRA\b` → espadas-cadenas / Espadas
4. `PI[ÑN]ON` → espadas-cadenas / Piñones
5. `FILTRO.*AIRE` → filtros-bujias / Filtros de aire
6. `FILTRO` → filtros-bujias / Filtros de combustible
7. `BUJIA` → filtros-bujias / Bujías
8. `CARBURADOR|CARBURACION` → carburacion-arranque / Carburadores
9. `ARRANQUE|PARTIDA|RESORTE|PIOLA|MANILLA` → carburacion-arranque / Arranque
10. `CABEZAL|N[AY]LON|DESBROZ|DESMALEZ|ORILLAD|\bHILO\b` → desbrozadoras / Accesorios de corte
11. `CASCO|PROTECTOR|GUANTE|ANTIPARRA|SALVAMANO|ARNES|FACIAL|OREJERA` → herramientas-seguridad / EPP
12. `\bLIMA\b|AFILAD|ESMERIL` → herramientas-seguridad / Afilado
13. `PISTON|CILINDRO|ANILLO` → repuestos-varios / Pistones y cilindros
14. `EMBRAGUE|CAMPANA` → repuestos-varios / Embragues

No se auto-detectan máquinas completas (motosierras/desbrozadoras): las pocas que
haya caen en `repuestos-varios/Otros` y el cliente las recategoriza.

### Extracción de marca

Regex sobre `nombre` (case-insensitive). Un ítem puede matchear varias marcas →
una `Compatibilidad` por marca, siempre con `modelos: []`.

| Marca | Patrones |
|---|---|
| Stihl | `\bSTIHL\b`, `\bSTHIL\b`, `\bSTHL\b`, `\bMS\s?\d{2,3}\b`, `\bFS\s?\d{2,3}\b`, `\bST0\d\d\b` |
| Husqvarna | `\bHUSQVARNA\b`, `\bHQV\b`, `\bHUSK\b` |
| Honda | `\bHONDA\b`, `\bGX\s?\d{2,3}\b` |
| Toyama | `\bTOYAMA\b` |
| Echo | `\bECHO\b` |
| Genérica/China | `\bCHIN[AO]S?\b`, `\bGENERIC[AO]\b` |
| Castor | `\bCASTOR\b` |

Sin match → `compatibilidades: []`.

---

## Parte 3 — Ajustes de UI que la importación hace necesarios

### `src/pages/Producto.tsx` — descripción vacía

Los 497 ítems entran sin descripción. Donde hoy se renderiza
`{producto.descripcion}` (línea ~286), si está vacía mostrar:
*"Sin descripción detallada todavía. Escríbenos por WhatsApp para confirmar
compatibilidad y disponibilidad."* (enlace a WhatsApp con `WHATSAPP_NUMERO`).
El `useSeo` de la ficha (línea ~55) ya tolera descripción vacía.

### `src/pages/Home.tsx` — destacados vacíos

`destacados` (línea 57) quedaría `[]` (ningún `destacado`, ninguna oferta) y la
sección "Productos destacados" se vería con encabezado y grilla vacía. Fallback:
si `destacados.length === 0`, usar
`productos.filter((p) => estadoStock(p) !== 'agotado').slice(0, 8)`.
(El archivo tiene un cambio sin commitear no relacionado — se conserva.)

### Estados vacíos aceptados sin cambio

- `/tienda?ofertas=1` → 0 resultados: el empty state existente ("No encontramos
  productos… escríbenos por WhatsApp") es suficiente.
- Selector de modelo vacío para casi todo el catálogo: esperado hasta que el
  cliente enriquezca.

---

## Archivos afectados

**Nuevos**
- `scripts/importar-inventario.ts`
- `scripts/lib/transformarInventario.ts`
- `scripts/lib/transformarInventario.test.ts`
- `scripts/datos/inventario.tsv`
- `docs/superpowers/specs/2026-08-30-importacion-inventario-y-compatibilidad-design.md`

**Modificados**
- `src/types/index.ts` — `Compatibilidad`, `Producto.compatibilidades`
- `src/services/productos.ts` — 3 funciones de compatibilidad + guarda defensiva + CSV
- `src/pages/Tienda.tsx` — filtro
- `src/pages/Marcas.tsx` — agregación
- `src/pages/Compatibilidad.tsx` — conteo por marca
- `src/pages/Producto.tsx` — "Compatible con" + relacionados + placeholder descripción
- `src/pages/admin/AdminProductos.tsx` — editor de compatibilidades + CSV
- `src/pages/Home.tsx` — fallback de destacados
- `src/data/seed.ts` — **regenerado** (generado por el script)
- `package.json` — scripts `importar-inventario`, `test:scripts`

**Sin cambios:** `functions/`, reglas Firestore/Storage, checkout, pagos,
cotizaciones, `MaquinaCliente`, rutas.

## Verificación

1. `npm run build` verde (tsc `-b` estricto, `noUnusedLocals`).
2. `npm run test:scripts` verde — casos del transform:
   - `$45,000` → `45000`; `2.00` → `2`; `N/A` → `0`.
   - fila precio `$1` descartada.
   - `mayoreo` presente → 2 tramos; ausente → 1 tramo.
   - `AMORTIGUADOR STIHL 361` → `[{marca:'Stihl',modelos:[]}]`.
   - `BUJIA NGK MOTOSIERRA` sin marca → `compatibilidades: []`.
   - `CARBURADOR HQV61` → Husqvarna; `CADENA 36/D HQV440... CHINAS` → Husqvarna + Genérica/China.
   - departamento `CARBURADORES` → `carburacion-arranque/Carburadores`;
     `- Sin Departamento -` + nombre `ACEITE MEZCLA…` → `aceites-lubricantes/Aceite de mezcla 2T`.
   - `MANO DE OBRA` → `activo: false`.
3. `git diff src/data/seed.ts`: ~497 productos, spot-check de 10 (precio, stock,
   categoría, compatibilidades).
4. `npm run dev` (MODO_DEMO) y comprobar en el navegador:
   - Portada → elegir *Stihl*: el selector de modelos ya **no** ofrece CS-590 /
     455 Rancher / RT43L / UMK435. (Con `modelos: []` en todo, el selector queda
     casi vacío pero sin contaminación.)
   - `/marcas`: cada marca con "Consumibles universales para toda la marca".
   - `/tienda?marca=Husqvarna`: filtra solo ítems con esa marca.
   - Ficha de producto sin descripción: muestra el placeholder de WhatsApp.
   - Portada: "Productos destacados" con 8 ítems (fallback).
5. Reporte del importador: total importado, conteo por categoría, y **lista de
   revisión** (ítems cuyo `nombre` es solo un código, ej. `C222`).
6. Tras `--push` con `.env` real: contar docs en `productos` (=497) y `categorias`
   (=8); abrir la tienda apuntando a Firebase.

## Riesgos / pendientes conocidos

- Catálogo "crudo": nombres en MAYÚS, sin descripción, sin modelos, foto
  placeholder. El cliente enriquece desde el panel admin (queda en PENDIENTES de
  `CLAUDE.md`).
- Heurística de categoría imperfecta, sobre todo en los 132 "Sin Departamento".
- `C222` y similares (nombre = código) entran activos; van a la lista de revisión.
- Extracción de marca conservadora: ítems con marca implícita no detectada quedan
  como `compatibilidades: []` (no aparecen en el buscador por máquina).
- `--solo-stock` asume que el `id` (`inv-` + slug del código) se mantiene estable
  entre exportaciones del inventario del cliente.
