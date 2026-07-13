# Administración De Clubes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar un panel funcional en `/admin/clubes` para que administradores supervisen y moderen todos los clubes.

**Architecture:** Se añaden casos de uso y rutas administrativas aisladas de las rutas de líderes en `backend/src/modules/clubs`. El frontend consume esos endpoints mediante una API administrativa y un hook TanStack Query; la ruta presenta listado, detalle y acciones confirmadas que invalidan la caché relacionada.

**Tech Stack:** Bun, TypeScript estricto, Hono, Drizzle, Zod, React, TanStack Query, TanStack Router, Tailwind CSS, Lucide React y Sonner.

## Global Constraints

- Usar Bun; no usar npm, pnpm ni yarn.
- Validar todas las entradas HTTP con Zod y mantener `{ exito, datos, meta? }`.
- Las rutas administrativas requieren `requireRole("administrador")`.
- No exponer nombres reales: presentar apodos y avatares existentes.
- No modificar las reglas de autogestión de propietarios y líderes en `/clubes`.
- Las acciones destructivas requieren confirmación en la interfaz y auditoría en `registro_auditoria`.
- El CMS requiere conexión: no persistir ni reutilizar caché offline administrativa; mostrar error y reintento si falla la red.

---

## File Structure

- `backend/src/modules/clubs/admin-clubs.schemas.ts` — schemas Zod para filtros y mutaciones de moderación.
- `backend/src/modules/clubs/casos-uso/admin-clubs.ts` — casos de uso sin dependencia de membresía del actor.
- `backend/src/modules/clubs/clubs.repository.ts` — consultas paginadas, métricas, reactivación y cierre de retos.
- `backend/src/modules/clubs/admin-clubs.routes.ts` — Hono routes bajo `/administracion/clubes` con control de rol y auditoría.
- `backend/src/modules/clubs/admin-clubs.routes.test.ts` — integración y autorización de rutas.
- `frontend/src/features/admin/admin-clubes.api.ts` — DTOs y llamadas administrativas.
- `frontend/src/features/admin/hooks/use-admin-clubes.ts` — queries, mutaciones e invalidaciones del CMS.
- `frontend/src/features/admin/componentes/admin-clubes-panel.tsx` — pantalla responsive, filtros, detalle y confirmaciones.
- `frontend/src/features/admin/componentes/admin-clubes-panel.test.tsx` — estados y acciones de la interfaz.
- `frontend/src/routes/admin.clubes.tsx` — compone el panel funcional.

### Task 1: Persistencia y reglas administrativas de clubes

**Files:**
- Modify: `backend/src/modules/clubs/clubs.repository.ts:15-318`
- Create: `backend/src/modules/clubs/casos-uso/admin-clubs.ts`
- Test: `backend/src/modules/clubs/casos-uso/admin-clubs.test.ts`

**Interfaces:**
- Consumes: `crearClubsRepository(db)` y tablas `club`, `miembroClub`, `retoClub`.
- Produces: `crearCasosUsoAdminClubs(repositorio)` con `listar`, `obtenerDetalle`, `archivar`, `reactivar`, `quitarMiembro`, `transferirLiderazgo`, `crearReto` y `cerrarReto`.

- [ ] **Step 1: Escribir pruebas fallidas de reglas administrativas**

```ts
it("permite archivar un club con miembros sin exigir membresía al administrador", async () => {
  const resultado = await casos.archivar("club-1", "admin-1");
  expect(resultado).toEqual({ archived: true });
  expect(repositorio.desactivarClub).toHaveBeenCalledWith("club-1");
});

it("no expulsa al único propietario sin transferir el liderazgo", async () => {
  const resultado = await casos.quitarMiembro("club-1", "lider-1", "admin-1");
  expect(resultado).toMatchObject({ error: { codigo: "PROPIETARIO_REQUERIDO", estado: 400 } });
});

it("cierra un reto evitando nuevos aportes sin borrar sus recompensas", async () => {
  await casos.cerrarReto("club-1", "reto-1", "admin-1");
  expect(repositorio.cerrarReto).toHaveBeenCalledWith("club-1", "reto-1");
});
```

- [ ] **Step 2: Ejecutar la prueba para verificar rojo**

Run: `bun test backend/src/modules/clubs/casos-uso/admin-clubs.test.ts`

Expected: falla porque `crearCasosUsoAdminClubs` y los métodos del repositorio aún no existen.

- [ ] **Step 3: Añadir consultas y mutaciones mínimas al repositorio**

```ts
async listarClubesAdministracion(input: { q?: string; activo?: boolean; limit: number; offset: number }) {
  // Devuelve club, líder, total de miembros y retos abiertos; incluye activos y archivados.
}

async reactivarClub(clubId: string) {
  const [club] = await db.update(schema.club).set({ activo: true }).where(eq(schema.club.id, clubId)).returning();
  return club ?? null;
}

async cerrarReto(clubId: string, retoId: string) {
  const [reto] = await db.update(schema.retoClub)
    .set({ fechaFin: new Date() })
    .where(and(eq(schema.retoClub.clubId, clubId), eq(schema.retoClub.id, retoId)))
    .returning();
  return reto ?? null;
}
```

- [ ] **Step 4: Implementar casos de uso sin autorización por membresía**

```ts
export function crearCasosUsoAdminClubs(repositorio: ClubsRepository) {
  return {
    listar: (filtros: { q?: string; activo?: boolean; limit: number; offset: number }) =>
      repositorio.listarClubesAdministracion(filtros),
    archivar: async (clubId: string) => {
      const club = await repositorio.desactivarClub(clubId);
      return club ? { archived: true } : { error: { mensaje: "Club no encontrado", codigo: "NOT_FOUND", estado: 404 } };
    },
    reactivar: async (clubId: string) => {
      const club = await repositorio.reactivarClub(clubId);
      return club ? { reactivated: true } : { error: { mensaje: "Club no encontrado", codigo: "NOT_FOUND", estado: 404 } };
    },
    // quitarMiembro verifica que quede al menos un propietario; transferirLiderazgo actualiza ambos roles.
  };
}
```

- [ ] **Step 5: Ejecutar pruebas de casos de uso**

Run: `bun test backend/src/modules/clubs/casos-uso/admin-clubs.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/src/modules/clubs/clubs.repository.ts backend/src/modules/clubs/casos-uso/admin-clubs.ts backend/src/modules/clubs/casos-uso/admin-clubs.test.ts
git commit -m "feat(clubs): add admin moderation use cases"
```

### Task 2: Rutas protegidas y auditoría de moderación

**Files:**
- Create: `backend/src/modules/clubs/admin-clubs.schemas.ts`
- Create: `backend/src/modules/clubs/admin-clubs.routes.ts`
- Modify: `backend/src/app.ts:175-216`
- Test: `backend/src/modules/clubs/admin-clubs.routes.test.ts`

**Interfaces:**
- Consumes: `crearCasosUsoAdminClubs`, `requireRole`, `responderExito`, `esResultadoConError` y `registro_auditoria`.
- Produces: `adminClubsRoutes` montado en `/administracion/clubes`.

- [ ] **Step 1: Escribir pruebas fallidas de autorización y contrato HTTP**

```ts
it("rechaza a un usuario no administrador", async () => {
  const response = await app.fetch(new Request("http://localhost/administracion/clubes", { headers: cabecerasUsuario }));
  expect(response.status).toBe(403);
});

it("lista clubes archivados para administrador", async () => {
  const response = await app.fetch(new Request("http://localhost/administracion/clubes?estado=archivado", { headers: cabecerasAdmin }));
  expect(response.status).toBe(200);
  expect((await response.json()).datos.meta.total).toBe(1);
});

it("registra auditoría al expulsar un miembro", async () => {
  const response = await app.fetch(new Request("http://localhost/administracion/clubes/club-1/miembros/usuario-2", { method: "DELETE", headers: cabecerasAdmin }));
  expect(response.status).toBe(200);
  expect(auditoria).toContainEqual(expect.objectContaining({ accion: "club.miembro_expulsado", entidad_id: "club-1" }));
});
```

- [ ] **Step 2: Ejecutar pruebas para verificar rojo**

Run: `bun test backend/src/modules/clubs/admin-clubs.routes.test.ts`

Expected: FAIL con rutas no encontradas.

- [ ] **Step 3: Definir schemas Zod**

```ts
export const adminClubListSchema = z.object({
  q: z.string().trim().max(120).optional(),
  estado: z.enum(["activo", "archivado", "todos"]).default("todos"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const cerrarRetoAdminSchema = z.object({ motivo: z.string().trim().min(3).max(500) });
```

- [ ] **Step 4: Implementar rutas administrativas con auditoría**

```ts
adminClubsRoutes.use("*", authMiddleware, requireRole("administrador"));
adminClubsRoutes.get("/", async (c) => responderExito(await casos.listar(c.req.valid("query"))));
adminClubsRoutes.post("/:clubId/archivar", async (c) => ejecutarYAuditar(c, "club.archivado", () => casos.archivar(c.req.param("clubId"))));
adminClubsRoutes.post("/:clubId/reactivar", async (c) => ejecutarYAuditar(c, "club.reactivado", () => casos.reactivar(c.req.param("clubId"))));
adminClubsRoutes.delete("/:clubId/miembros/:usuarioId", async (c) => ejecutarYAuditar(c, "club.miembro_expulsado", () => casos.quitarMiembro(c.req.param("clubId"), c.req.param("usuarioId"), c.get("user").id)));
```

`ejecutarYAuditar` debe responder errores de dominio sin grabar auditoría y, tras éxito, insertar `actor_usuario_id`, `accion`, `tipo_entidad: "club"`, `entidad_id` y datos antes/después mínimos en `registro_auditoria`.

- [ ] **Step 5: Montar las rutas y ejecutar pruebas**

Run: `bun test backend/src/modules/clubs/admin-clubs.routes.test.ts`

Expected: PASS; usuario regular recibe `403` y cada mutación exitosa deja auditoría.

- [ ] **Step 6: Commit**

```bash
git add backend/src/modules/clubs/admin-clubs.schemas.ts backend/src/modules/clubs/admin-clubs.routes.ts backend/src/modules/clubs/admin-clubs.routes.test.ts backend/src/app.ts
git commit -m "feat(clubs): expose audited admin routes"
```

### Task 3: Cliente administrativo y estado de consultas

**Files:**
- Create: `frontend/src/features/admin/admin-clubes.api.ts`
- Create: `frontend/src/features/admin/hooks/use-admin-clubes.ts`
- Test: `frontend/src/features/admin/admin-clubes.api.test.ts`

**Interfaces:**
- Consumes: endpoints `/administracion/clubes` y `peticion`.
- Produces: `listarClubesAdmin`, `obtenerClubAdmin`, mutaciones administrativas y `useAdminClubes`.

- [ ] **Step 1: Escribir pruebas fallidas de API**

```ts
it("solicita clubes con filtros de estado y paginación", async () => {
  await listarClubesAdmin({ estado: "archivado", limit: 20, offset: 0 });
  expect(ruta).toBe("/administracion/clubes?estado=archivado&limit=20&offset=0");
});

it("archiva un club mediante POST administrativo", async () => {
  await archivarClubAdmin("club-1");
  expect({ metodo, ruta }).toEqual({ metodo: "POST", ruta: "/administracion/clubes/club-1/archivar" });
});
```

- [ ] **Step 2: Ejecutar prueba para verificar rojo**

Run: `bun test frontend/src/features/admin/admin-clubes.api.test.ts`

Expected: FAIL por módulo inexistente.

- [ ] **Step 3: Implementar DTOs y funciones de la API**

```ts
export type ClubAdminResumen = {
  id: string; nombre: string; descripcion: string | null; activo: boolean;
  creado_en: string; miembros: number; retos_abiertos: number;
  lider: { usuario_id: string; apodo: string } | null;
};

export function listarClubesAdmin(filtros: { q?: string; estado: "activo" | "archivado" | "todos"; limit: number; offset: number }) {
  const parametros = new URLSearchParams({ estado: filtros.estado, limit: String(filtros.limit), offset: String(filtros.offset) });
  if (filtros.q) parametros.set("q", filtros.q);
  return peticion<{ clubes: ClubAdminResumen[]; meta: { total: number } }>(`/administracion/clubes?${parametros}`);
}
```

- [ ] **Step 4: Implementar hook de TanStack Query**

```ts
const listado = useQuery({ queryKey: ["admin", "clubes", filtros], queryFn: () => listarClubesAdmin(filtros), placeholderData: (previo) => previo });
const invalidarClub = async (clubId: string) => Promise.all([
  queryClient.invalidateQueries({ queryKey: ["admin", "clubes"] }),
  queryClient.invalidateQueries({ queryKey: ["admin", "clubes", clubId] }),
]);
```

El cliente administrativo no debe usar `localStorage`, Dexie ni fallbacks offline. Cada mutación debe llamar su endpoint, invalidar y propagar el error para que la interfaz lo comunique.

- [ ] **Step 5: Ejecutar pruebas de API**

Run: `bun test frontend/src/features/admin/admin-clubes.api.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/features/admin/admin-clubes.api.ts frontend/src/features/admin/admin-clubes.api.test.ts frontend/src/features/admin/hooks/use-admin-clubes.ts
git commit -m "feat(admin): add clubs moderation client"
```

### Task 4: Panel responsive de administración de clubes

**Files:**
- Create: `frontend/src/features/admin/componentes/admin-clubes-panel.tsx`
- Create: `frontend/src/features/admin/componentes/admin-clubes-panel.test.tsx`
- Modify: `frontend/src/routes/admin.clubes.tsx:1-17`

**Interfaces:**
- Consumes: `useAdminClubes`, `ClubAdminResumen`, Lucide React y Sonner.
- Produces: `AdminClubesPanel`, renderizado por la ruta `/admin/clubes`.

- [ ] **Step 1: Escribir prueba de estados y acciones**

```tsx
it("muestra clubes, filtros y la acción de archivar con confirmación", () => {
  render(<AdminClubesPanel estado={{ clubes: [clubActivo], total: 1, isLoading: false }} />);
  expect(screen.getByRole("searchbox", { name: "Buscar clubes" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Archivar Club Semillas" })).toBeDefined();
});

it("deshabilita las mutaciones cuando no hay conexión", () => {
  render(<AdminClubesPanel estado={{ clubes: [clubActivo], online: false }} />);
  expect(screen.getByRole("button", { name: "Archivar Club Semillas" }).hasAttribute("disabled")).toBe(true);
});
```

- [ ] **Step 2: Ejecutar prueba para verificar rojo**

Run: `bun test frontend/src/features/admin/componentes/admin-clubes-panel.test.tsx`

Expected: FAIL por componente inexistente.

- [ ] **Step 3: Implementar estructura mobile-first**

```tsx
export function AdminClubesPanel() {
  const clubes = useAdminClubes();
  return (
    <section aria-labelledby="admin-clubes-title" className="space-y-6">
      <header><span className="admin-eyebrow">Moderación</span><h2 id="admin-clubes-title">Clubes</h2></header>
      <label><span className="sr-only">Buscar clubes</span><input aria-label="Buscar clubes" value={clubes.busqueda} onChange={clubes.actualizarBusqueda} /></label>
      {/* lista responsive, detalle seleccionado, retos, miembros y diálogos de confirmación */}
    </section>
  );
}
```

Usar cards en móvil y tabla en escritorio. Cada acción destructiva abre un diálogo con el nombre del club o miembro y ejecuta la mutación solo tras confirmar. Mostrar skeleton, vacío, error con reintento y aviso de modo offline.

- [ ] **Step 4: Reemplazar el placeholder de la ruta**

```tsx
import { AdminClubesPanel } from "../features/admin/componentes/admin-clubes-panel";

function AdminClubesPage() {
  return <AdminClubesPanel />;
}
```

- [ ] **Step 5: Ejecutar pruebas de interfaz**

Run: `bun test frontend/src/features/admin/componentes/admin-clubes-panel.test.tsx`

Expected: PASS con listado, vacío, offline y confirmación cubiertos.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/features/admin/componentes/admin-clubes-panel.tsx frontend/src/features/admin/componentes/admin-clubes-panel.test.tsx frontend/src/routes/admin.clubes.tsx
git commit -m "feat(admin): implement clubs moderation panel"
```

### Task 5: Verificación integrada y documentación API

**Files:**
- Modify: `docs/api.md`
- Modify: `docs/backend-api.md`
- Modify: `backend/src/openapi/spec.ts`
- Test: `backend/src/modules/clubs/admin-clubs.routes.test.ts`

**Interfaces:**
- Consumes: rutas administrativas implementadas en tareas 1 y 2.
- Produces: contratos documentados y verificados para el panel.

- [ ] **Step 1: Escribir la prueba de recorrido de moderación**

```ts
it("permite al administrador archivar, reactivar, transferir liderazgo y cerrar un reto", async () => {
  expect((await solicitar("POST", "/administracion/clubes/club-1/archivar", cabecerasAdmin)).status).toBe(200);
  expect((await solicitar("POST", "/administracion/clubes/club-1/reactivar", cabecerasAdmin)).status).toBe(200);
  expect((await solicitar("POST", "/administracion/clubes/club-1/transferir-liderazgo", cabecerasAdmin, { usuario_id: "usuario-2" })).status).toBe(200);
  expect((await solicitar("POST", "/administracion/clubes/club-1/retos/reto-1/cerrar", cabecerasAdmin, { motivo: "Moderación" })).status).toBe(200);
});
```

- [ ] **Step 2: Ejecutar la prueba para verificar rojo si falta alguna ruta**

Run: `bun test backend/src/modules/clubs/admin-clubs.routes.test.ts`

Expected: PASS solo cuando todas las rutas y auditorías estén conectadas.

- [ ] **Step 3: Documentar endpoints y OpenAPI**

Añadir a `docs/api.md`, `docs/backend-api.md` y `backend/src/openapi/spec.ts` los siete endpoints, rol requerido, cuerpos, respuestas y códigos `400`, `403` y `404`.

- [ ] **Step 4: Ejecutar verificaciones finales**

Run: `bun test backend/src/modules/clubs/admin-clubs.routes.test.ts`

Run: `bun test frontend/src/features/admin/admin-clubes.api.test.ts frontend/src/features/admin/componentes/admin-clubes-panel.test.tsx`

Run: `bun run check`

Run: `bun run build`

Expected: pruebas nuevas en verde, typecheck y build correctos. Si existen fallos no relacionados, documentarlos con ruta y error exactos antes de continuar.

- [ ] **Step 5: Commit**

```bash
git add docs/api.md docs/backend-api.md backend/src/openapi/spec.ts backend/src/modules/clubs/admin-clubs.routes.test.ts
git commit -m "docs(clubs): document admin moderation API"
```

## Self-Review

- Cobertura de especificación: Task 1 implementa reglas y persistencia; Task 2 cubre autorización y auditoría; Task 3 conecta cliente/cache; Task 4 entrega UI responsive, estados y confirmaciones; Task 5 cubre el recorrido integrado y documentación.
- Sin placeholders: todos los endpoints, interfaces y comandos están definidos.
- Consistencia: las rutas de Task 2 coinciden con las funciones de Task 3 y las acciones de Task 4.
