# Imágenes de Sendas Desde Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que el CMS cargue, previsualice y asocie imágenes de sendas almacenadas en el bucket privado `media`, y mostrarlas en las tarjetas públicas sin assets codificados.

**Architecture:** `senda.imagen_recurso_id` tendrá una relación opcional con `recurso_multimedia`. El admin reutilizará la carga multipart existente y persistirá el ID retornado; las rutas públicas crearán URLs firmadas de cinco minutos para el recurso asociado. El inicio consumirá `GET /sendas` y renderizará una tarjeta por senda activa usando sus datos y color.

**Tech Stack:** Bun test, TypeScript estricto, React 19, TanStack Query/Router, Hono, Drizzle ORM, Zod, Supabase Storage privado.

## Global Constraints

- Usar `bun`, nunca `npm`, `pnpm` ni `yarn`.
- Mantener `media` como bucket privado; no exponer la clave de Storage ni una URL pública permanente.
- Reutilizar `POST /media/subir`, que solo acepta JPEG, PNG y WebP de hasta 5 MB para `tipo=imagen`.
- La imagen es opcional: una senda sin imagen debe seguir navegable y sin imagen rota.
- Mantener DTOs y propiedades públicas en español (`imagen_recurso_id`, `imagen_url`).
- No eliminar automáticamente el recurso anterior cuando se sustituya una imagen.
- No crear commits sin autorización explícita del usuario.

---

## Estructura De Archivos

- `supabase/migrations/20260712000005_senda_imagen_recurso.sql`: migración imperativa de la clave foránea opcional.
- `semilla_base.sql`: esquema fuente reproducible con la misma columna y referencia.
- `backend/src/db/schema.ts`: definición Drizzle de `senda.imagenRecursoId` y relación opcional.
- `backend/src/db/database.types.ts`: tipos Supabase de la columna para lecturas y escrituras.
- `backend/src/modules/admin/*`: validación, persistencia y serialización administrativa de la asociación.
- `backend/src/modules/sendas/*`: serialización pública de sendas e imágenes firmadas.
- `frontend/src/features/admin/*`: contratos de API y componente de carga/previsualización reutilizable para el editor.
- `frontend/src/routes/admin.sendas*.tsx`: formularios y lista de sendas con preview/miniatura.
- `frontend/src/features/home/*` y `frontend/src/routes/app.index.tsx`: consulta de sendas y tarjetas públicas dinámicas.

### Task 1: Persistir La Asociación De Imagen En La Base

**Files:**
- Create: `supabase/migrations/20260712000005_senda_imagen_recurso.sql`
- Modify: `semilla_base.sql:74-85`
- Modify: `backend/src/db/schema.ts:151-162`
- Modify: `backend/src/db/database.types.ts:1324-1358`
- Test: `backend/src/db/senda-imagen-schema.test.ts`

**Interfaces:**
- Produces: `schema.senda.imagenRecursoId: uuid | null`.
- Produces: filas Supabase `senda` con `imagen_recurso_id: string | null`.
- Consumes: tabla existente `recurso_multimedia(id)`.

- [ ] **Step 1: Escribir la prueba de esquema en RED**

```ts
import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";

describe("esquema de imagen de senda", () => {
  it("declara una referencia opcional a recurso_multimedia en las dos fuentes SQL", async () => {
    const [base, migracion] = await Promise.all([
      readFile("../semilla_base.sql", "utf8"),
      readFile("../supabase/migrations/20260712000005_senda_imagen_recurso.sql", "utf8"),
    ]);

    expect(base).toMatch(/imagen_recurso_id\s+uuid.*REFERENCES\s+recurso_multimedia\(id\).*ON DELETE SET NULL/is);
    expect(migracion).toMatch(/ALTER TABLE senda ADD COLUMN IF NOT EXISTS imagen_recurso_id uuid REFERENCES recurso_multimedia\(id\) ON DELETE SET NULL/i);
  });
});
```

- [ ] **Step 2: Ejecutar la prueba y verificar RED**

Run: `bun test src/db/senda-imagen-schema.test.ts`

Expected: falla porque la migración y la columna no existen.

- [ ] **Step 3: Añadir la migración y sincronizar las definiciones de tipos**

```sql
-- supabase/migrations/20260712000005_senda_imagen_recurso.sql
ALTER TABLE senda
  ADD COLUMN IF NOT EXISTS imagen_recurso_id uuid
  REFERENCES recurso_multimedia(id)
  ON DELETE SET NULL;
```

```ts
// backend/src/db/schema.ts, dentro de pgTable("senda", ...)
imagenRecursoId: uuid("imagen_recurso_id").references(() => recursoMultimedia.id, {
  onDelete: "set null",
}),
```

En `semilla_base.sql`, incluir exactamente la columna entre `nombre_icono` y `orden`. En `database.types.ts`, incluirla como nullable en `Row`, opcional/null en `Insert` y `Update`.

- [ ] **Step 4: Ejecutar la prueba y typecheck en GREEN**

Run: `bun test src/db/senda-imagen-schema.test.ts && bun run typecheck`

Expected: PASS y TypeScript sin errores.

### Task 2: Exponer Y Persistir La Imagen En El API Administrativo

**Files:**
- Modify: `backend/src/modules/admin/admin.schemas.ts:106-124`
- Modify: `backend/src/modules/admin/admin.schemas.test.ts:1-137`
- Modify: `backend/src/modules/admin/admin.repository.ts:768-823`
- Modify: `backend/src/modules/admin/casos-uso/sendas.ts:1-68`
- Modify: `backend/src/modules/admin/admin.routes.test.ts`
- Modify: `frontend/src/features/admin/admin.api.ts:348-392`
- Modify: `frontend/src/features/admin/admin.api.test.ts`

**Interfaces:**
- Consumes: `imagen_recurso_id?: string | null` validado como UUID.
- Produces: `SendaAdmin` y `CrearSendaSolicitud` con `imagen_recurso_id: string | null`.
- Produces: `POST/PATCH /administracion/sendas` que persiste el ID y lo devuelve en su respuesta.

- [ ] **Step 1: Escribir las pruebas de contrato en RED**

```ts
it("acepta una imagen de recurso válida al crear y actualizar una senda", () => {
  const entrada = {
    codigo: "padre",
    nombre: "Senda del Padre",
    color_hex: "#3D8BD4",
    orden: 1,
    imagen_recurso_id: "550e8400-e29b-41d4-a716-446655440099",
  };

  expect(createSendaSchema.safeParse(entrada).success).toBe(true);
  expect(updateSendaSchema.safeParse({ imagen_recurso_id: entrada.imagen_recurso_id }).success).toBe(true);
  expect(updateSendaSchema.safeParse({ imagen_recurso_id: "no-es-uuid" }).success).toBe(false);
});
```

```ts
it("persiste y devuelve el recurso de imagen de una senda", async () => {
  const recursoId = "550e8400-e29b-41d4-a716-446655440099";
  let cuerpoInsertado: Record<string, unknown> | null = null;
  responderSupabase([
    {
      metodo: "GET",
      path: "/rest/v1/usuario_app",
      responder: () => new Response(JSON.stringify({
        id: "usuario-admin", rol: "administrador", proveedor: "invitado",
        nombre_visible: "Admin", correo: null, activo: true, token_invitado_hash: TOKEN_INVITADO_HASH,
      }), { headers: { "content-type": "application/json" } }),
    },
    {
      metodo: "POST",
      path: "/rest/v1/senda",
      responder: async (request) => {
        cuerpoInsertado = JSON.parse(await request.text()) as Record<string, unknown>;
        return new Response(JSON.stringify([{ id: "senda-1", ...cuerpoInsertado }]), {
          status: 201,
          headers: { "content-type": "application/json" },
        });
      },
    },
  ]);

  const response = await app.fetch(new Request("http://localhost/administracion/sendas", {
    method: "POST",
    headers: { "content-type": "application/json", "x-guest-user-id": "usuario-admin", "x-guest-token": TOKEN_INVITADO },
    body: JSON.stringify({ codigo: "padre", nombre: "Padre", color_hex: "#3D8BD4", orden: 1, imagen_recurso_id: recursoId }),
  }), env);
  const body = await response.json() as { exito: true; datos: { imagen_recurso_id: string | null } };

  expect(cuerpoInsertado).toMatchObject({ imagen_recurso_id: recursoId });
  expect(body.datos.imagen_recurso_id).toBe(recursoId);
});
```

- [ ] **Step 2: Ejecutar las pruebas para verificar RED**

Run: `bun test src/modules/admin/admin.schemas.test.ts src/modules/admin/admin.routes.test.ts`

Expected: falla porque los schemas y serializadores omiten `imagen_recurso_id`.

- [ ] **Step 3: Implementar el DTO y la persistencia mínima**

```ts
// admin.schemas.ts
imagen_recurso_id: z.string().uuid().nullable().optional(),

// admin.repository.ts: crearSenda
imagenRecursoId: body.imagen_recurso_id ?? null,

// admin.repository.ts: actualizarSenda
if (body.imagen_recurso_id !== undefined) {
  updateData.imagenRecursoId = body.imagen_recurso_id;
}

// casos-uso/sendas.ts: en cada respuesta
imagen_recurso_id: senda.imagenRecursoId,
```

Actualizar `SendaAdmin`, `CrearSendaSolicitud` y `ActualizarSendaSolicitud` para transportar el mismo campo sin `any`.

- [ ] **Step 4: Ejecutar las pruebas y typecheck en GREEN**

Run: `bun test src/modules/admin/admin.schemas.test.ts src/modules/admin/admin.routes.test.ts && bun test src/features/admin/admin.api.test.ts && bun run typecheck`

Expected: PASS y DTOs consistentes entre frontend y backend.

### Task 3: Entregar URLs Firmadas En Las Sendas Públicas

**Files:**
- Modify: `backend/src/modules/sendas/sendas.routes.ts:27-51`
- Modify: `backend/src/modules/sendas/sendas.use-cases.ts:1-19`
- Modify: `backend/src/modules/sendas/sendas.routes.test.ts:1-72`
- Modify: `frontend/src/shared/api/api.ts:74-82`
- Modify: `frontend/src/features/sendas/sendas.api.ts:1-6`

**Interfaces:**
- Consumes: `senda.imagenRecursoId` y `recurso_multimedia` activo en el bucket `media`.
- Produces: `GET /sendas` con `Senda.imagen_url: string | null`.
- Produces: una URL firmada con duración de 300 segundos, nunca la clave de Storage.

- [ ] **Step 1: Escribir la prueba pública en RED**

```ts
it("devuelve una URL firmada para la imagen de una senda activa", async () => {
  const dbMock = {
    select: () => ({
      from: () => ({
        where: () => ({ orderBy: async () => [{
          id: "senda-1", codigo: "padre", nombre: "Padre", descripcion: null,
          colorHex: "#3D8BD4", nombreIcono: null, orden: 1, activo: true,
          imagenRecursoId: "550e8400-e29b-41d4-a716-446655440099",
        }] }),
      }),
    }),
  } as unknown as DbClient;
  const obtenerUrlImagen = async (id: string) =>
    id === "550e8400-e29b-41d4-a716-446655440099"
      ? "https://example.supabase.co/signed/padre.webp"
      : null;

  const app = crearModuloSendas({ db: dbMock, obtenerUrlImagen });
  const response = await app.fetch(new Request("http://localhost/"), env);

  await expect(response.json()).resolves.toEqual({
    exito: true,
    datos: [expect.objectContaining({
      imagen_recurso_id: "550e8400-e29b-41d4-a716-446655440099",
      imagen_url: "https://example.supabase.co/signed/padre.webp",
    })],
  });
});

it("devuelve imagen_url nula cuando la senda no tiene imagen", async () => {
  const dbMock = {
    select: () => ({
      from: () => ({
        where: () => ({ orderBy: async () => [{
          id: "senda-2", codigo: "hijo", nombre: "Hijo", descripcion: null,
          colorHex: "#E9A23B", nombreIcono: null, orden: 2, activo: true, imagenRecursoId: null,
        }] }),
      }),
    }),
  } as unknown as DbClient;

  const app = crearModuloSendas({ db: dbMock, obtenerUrlImagen: async () => null });
  const response = await app.fetch(new Request("http://localhost/"), env);
  const body = await response.json() as { exito: true; datos: Array<{ imagen_recurso_id: string | null; imagen_url: string | null }> };

  expect(body.datos[0]).toEqual(expect.objectContaining({ imagen_recurso_id: null, imagen_url: null }));
});
```

- [ ] **Step 2: Ejecutar la prueba y verificar RED**

Run: `bun test src/modules/sendas/sendas.routes.test.ts`

Expected: falla porque la ruta no recibe Storage ni serializa `imagen_url`.

- [ ] **Step 3: Implementar firma privada y serialización tolerante**

```ts
type Dependencias = {
  db?: DbClient;
  obtenerUrlImagen?: (recursoId: string) => Promise<string | null>;
};

function crearModuloSendas({ db, obtenerUrlImagen }: Dependencias = {}) {
  const sendasRoutes = new Hono<AppBindings>();
  function obtenerCasosUso(c: Context<AppBindings>) {
    const cliente = db ?? c.get("drizzle");
    const repositorio = crearSendasRepository(cliente);
    const obtenerUrlImagenFirmada = obtenerUrlImagen ?? (async (recursoId: string) => {
      const media = crearMediaRepository(c.get("db"));
      const recurso = await media.obtenerRecursoActivo(recursoId);
      if (!recurso?.clave_almacenamiento) return null;
      const bucket = recurso.bucket_almacenamiento ?? media.bucket;
      const { data } = await media.crearURLFirmada(bucket, recurso.clave_almacenamiento, 300);
      return data?.signedUrl ?? null;
    });
    return crearCasosUsoSendas(repositorio, obtenerUrlImagenFirmada);
  }
  return sendasRoutes;
}
```

En `listarActivas`, por cada `imagenRecursoId` se obtiene el recurso activo y se firma `bucket_almacenamiento`/`clave_almacenamiento` por 300 segundos. La falla de firma retorna `imagen_url: null` para esa senda sin anular las demás. La salida no incluye `clave_almacenamiento` ni `bucket_almacenamiento`.

- [ ] **Step 4: Ejecutar pruebas y comprobar el contrato público**

Run: `bun test src/modules/sendas/sendas.routes.test.ts && bun test ../../tests/contrato-publico.test.ts`

Expected: PASS; las sendas activas exponen `imagen_url` firmada o `null`.

### Task 4: Crear El Selector Y Preview De Imagen Para El Editor De Sendas

**Files:**
- Create: `frontend/src/features/admin/componentes/senda-imagen-field.tsx`
- Create: `frontend/src/features/admin/componentes/senda-imagen-field.test.tsx`
- Modify: `frontend/src/routes/admin.sendas.new.tsx:1-247`
- Modify: `frontend/src/routes/admin.sendas.$sendaId.edit.tsx:1-285`
- Modify: `frontend/src/routes/admin.sendas.tsx:17-116`

**Interfaces:**
- Consumes: `subirArchivo(archivo, "imagen", textoAlternativo?)` y `obtenerUrlFirmadaRecurso(id)`.
- Produces: `SendaImagenField` con props `{ imagenInicial?: string | null; alCambiarArchivo: (archivo: File | null) => void }`.
- Produces: formularios que suben una imagen nueva antes de invocar `crearSendaAdmin` o `actualizarSendaAdmin`.

- [ ] **Step 1: Escribir las pruebas de preview en RED**

```tsx
it("muestra la imagen existente y reemplaza el preview con el archivo seleccionado", () => {
  const htmlInicial = renderToStaticMarkup(
    <SendaImagenField imagenInicial="https://signed.test/padre.webp" alCambiarArchivo={() => undefined} />,
  );

  expect(htmlInicial).toContain("https://signed.test/padre.webp");
  expect(htmlInicial).toContain("Imagen de la senda");
});

it("declara un input que acepta solo formatos de imagen permitidos", () => {
  const html = renderToStaticMarkup(
    <SendaImagenField imagenInicial={null} alCambiarArchivo={() => undefined} />,
  );

  expect(html).toContain('accept="image/jpeg,image/png,image/webp"');
});
```

Añadir un test de ruta que mockee `subirArchivo`, compruebe que recibe `"imagen"`, y confirme que el DTO enviado contiene el ID devuelto.

- [ ] **Step 2: Ejecutar las pruebas y verificar RED**

Run: `bun test src/features/admin/componentes/senda-imagen-field.test.tsx`

Expected: falla porque el componente y el flujo de carga no existen.

- [ ] **Step 3: Implementar el campo de imagen y conectarlo a ambos formularios**

```tsx
export function SendaImagenField({ imagenInicial, alCambiarArchivo }: SendaImagenFieldProps) {
  const [previewLocal, setPreviewLocal] = useState<string | null>(null);
  const imagenPreview = previewLocal ?? imagenInicial ?? null;

  function cambiarArchivo(event: ChangeEvent<HTMLInputElement>) {
    const archivo = event.target.files?.[0] ?? null;
    setPreviewLocal((actual) => {
      if (actual) URL.revokeObjectURL(actual);
      return archivo ? URL.createObjectURL(archivo) : null;
    });
    alCambiarArchivo(archivo);
  }

  // Revocar la URL temporal al desmontar.
}
```

En los handlers `handleSubmit`, resolver `const imagenRecursoId = archivo ? (await subirArchivo(archivo, "imagen")).id : imagenRecursoIdActual;` antes de llamar a la mutación. Si la subida falla, mostrar `toast.error`, conservar los valores del formulario y no enviar la mutación de senda. En edición, cargar `obtenerUrlFirmadaRecurso(senda.imagen_recurso_id)` con TanStack Query. En la lista usar la misma URL firmada para la miniatura y un bloque de color como fallback.

- [ ] **Step 4: Ejecutar pruebas de UI y typecheck en GREEN**

Run: `bun test src/features/admin/componentes/senda-imagen-field.test.tsx src/features/admin/admin.api.test.ts && bun run typecheck`

Expected: PASS; preview local/persistido y carga previa a guardar verificados.

### Task 5: Reemplazar Las Tarjetas Estáticas Del Inicio Por Sendas De API

**Files:**
- Modify: `frontend/src/features/home/componentes/paths-grid.tsx:1-50`
- Modify: `frontend/src/features/home/componentes/senda-card.tsx:1-70`
- Create: `frontend/src/features/home/componentes/paths-grid.test.tsx`
- Modify: `frontend/src/features/home/hooks/use-app-home-page.ts:1-66`
- Modify: `frontend/src/routes/app.index.tsx:1-61`
- Modify: `frontend/src/shared/api/api.ts:74-82`

**Interfaces:**
- Consumes: `obtenerSendas(): Promise<Senda[]>`, donde `Senda` incluye `imagen_url: string | null`.
- Produces: `PathsGrid({ sendas: Senda[] })` que crea una tarjeta por senda activa.
- Produces: fallback visual de color cuando `imagen_url` sea `null` o el `<img>` emita error.

- [ ] **Step 1: Escribir las pruebas de tarjetas dinámicas en RED**

```tsx
it("renderiza cada senda recibida con su color e imagen firmada", () => {
  const html = renderToStaticMarkup(
    <PathsGrid sendas={[{
      id: "senda-1",
      codigo: "padre",
      nombre: "Senda del Padre",
      descripcion: "Dios es nuestro Padre amoroso.",
      color_hex: "#3D8BD4",
      nombre_icono: null,
      orden: 1,
      imagen_url: "https://signed.test/padre.webp",
    }]} />,
  );

  expect(html).toContain("Senda del Padre");
  expect(html).toContain("https://signed.test/padre.webp");
  expect(html).toContain("#3D8BD4");
});

it("mantiene una tarjeta navegable sin imagen", () => {
  const html = renderToStaticMarkup(<PathsGrid sendas={[{
    id: "senda-2", codigo: "sin-imagen", nombre: "Senda sin imagen", descripcion: null,
    color_hex: "#17A398", nombre_icono: null, orden: 2, imagen_url: null,
  }]} />);

  expect(html).toContain("Abrir temas de Senda sin imagen");
  expect(html).not.toContain('src="undefined"');
});
```

- [ ] **Step 2: Ejecutar las pruebas para verificar RED**

Run: `bun test src/features/home/componentes/paths-grid.test.tsx`

Expected: falla porque `PathsGrid` requiere tres props estáticas y no acepta una lista.

- [ ] **Step 3: Implementar el grid basado en datos y conectar la consulta**

```tsx
export function PathsGrid({ sendas }: { sendas: Senda[] }) {
  return (
    <section className="home-paths" aria-labelledby="home-paths-title">
      <div className="paths-grid">
        {sendas.map((senda) => <SendaCard key={senda.id} senda={senda} />)}
      </div>
    </section>
  );
}
```

`useAppHomePage` añadirá `useQuery({ queryKey: ["sendas"], queryFn: obtenerSendas, staleTime: 240_000, refetchInterval: 240_000 })`, devolviendo `sendas: sendasQuery.data ?? []`. `app.index.tsx` eliminará los tres imports de ilustraciones y pasará `sendas` al grid. `SendaCard` usará estilos inline derivados de `senda.color_hex`; si no hay imagen o falla `onError`, ocultará el `<img>` y preservará la tarjeta y su fondo de color.

- [ ] **Step 4: Ejecutar pruebas, comprobaciones y build en GREEN**

Run: `bun test src/features/home/componentes/paths-grid.test.tsx && bun run test && bun run check && bun run build`

Expected: PASS; no quedan imports de las tres ilustraciones de sendas en `app.index.tsx` y el build finaliza correctamente.

## Revisión Del Plan

- Cobertura de especificación: Task 1 cubre migración, `semilla_base.sql`, Drizzle y tipos; Task 2 cubre el contrato CMS; Task 3 cubre URLs firmadas públicas; Task 4 cubre carga, preview y miniaturas administrativas; Task 5 cubre la pantalla pública dinámica, colores y fallback.
- Sin placeholders: todos los cambios usan rutas, DTOs, comandos y asserts concretos.
- Consistencia de tipos: `imagen_recurso_id` permanece nullable y opcional al escribir; `imagen_url` es siempre `string | null` al leer. El recurso anterior no se elimina en ningún task.
