# Actividades Admin Dedicadas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert admin activities into fully dedicated create, edit, and preview screens with correct navigation and shared reusable form/preview pieces.

**Architecture:** Keep the list page as the entry point, but move create/edit/preview into separate dedicated routes. Reuse a shared activity form shell for create/edit and a shared preview shell for read-only rendering, so navigation is explicit and each screen has one responsibility.

**Tech Stack:** React, TypeScript, TanStack Router, TanStack Query, Hono backend API, Zod, Bun.

## Global Constraints

- TypeScript strict.
- Bun as package manager/runtime for scripts.
- React + Vite frontend.
- TanStack Router for routing.
- TanStack Query for server state.
- Zod for validation.
- Keep the app mobile-first and admin routes functional.
- No `any` in new code.
- Prefer small focused files over large route monoliths.

---

### Task 1: Create dedicated admin activity routes

**Files:**
- Create: `frontend/src/routes/admin.actividades.new.tsx`
- Create: `frontend/src/routes/admin.actividades.$activityId.edit.tsx`
- Create: `frontend/src/routes/admin.actividades.$activityId.preview.tsx`
- Modify: `frontend/src/routes/admin.actividades.tsx`
- Modify: `frontend/src/features/admin/componentes/admin-activities-header.tsx`
- Modify: `frontend/src/features/admin/componentes/admin-activities-table.tsx`

**Interfaces:**
- Consumes: `obtenerActividad`, `crearActividad`, `actualizarActividad`, `eliminarActividad`, `obtenerActividadesAdmin`
- Produces: dedicated route screens and stable navigation targets

- [ ] **Step 1: Write the failing route navigation assertions**

```ts
// Pseudo-test targets for route wiring
expect("/admin/actividades/new").toBeAValidRoute();
expect("/admin/actividades/123/edit").toBeAValidRoute();
expect("/admin/actividades/123/preview").toBeAValidRoute();
```

- [ ] **Step 2: Run route/type validation to confirm routes do not exist yet**

Run: `cd frontend && bun run typecheck`
Expected: route imports fail until files are created.

- [ ] **Step 3: Implement the route files with TanStack Router patterns**

```tsx
export const Route = createFileRoute("/admin/actividades/new")({ component: AdminActivityNewPage });
```

```tsx
export const Route = createFileRoute("/admin/actividades/$activityId/edit")({ component: AdminActivityEditPage });
```

```tsx
export const Route = createFileRoute("/admin/actividades/$activityId/preview")({ component: AdminActivityPreviewPage });
```

- [ ] **Step 4: Wire header/table navigation to the new routes**

```tsx
navigate({ to: "/admin/actividades/new" });
navigate({ to: "/admin/actividades/$activityId/edit", params: { activityId: act.id } });
navigate({ to: "/admin/actividades/$activityId/preview", params: { activityId: act.id } });
```

- [ ] **Step 5: Run typecheck and confirm route names resolve**

Run: `cd frontend && bun run typecheck`
Expected: pass.

### Task 2: Extract shared activity form shell

**Files:**
- Create: `frontend/src/features/admin/componentes/activity-form-shell.tsx`
- Create: `frontend/src/features/admin/hooks/use-activity-form.ts`
- Modify: `frontend/src/routes/admin.actividades.new.tsx`
- Modify: `frontend/src/routes/admin.actividades.$activityId.edit.tsx`

**Interfaces:**
- Consumes: theme/activity queries, catalog queries, admin create/update mutations
- Produces: reusable form shell with shared submit/reset behavior

- [ ] **Step 1: Write the failing unit-shaped state contract**

```ts
type ActivityFormMode = "create" | "edit";
type ActivityFormValues = {
  tema_id: string;
  paso_id: string | null;
  grupo_edad_id: string;
  tipo_actividad_id: string;
  titulo: string;
  consigna: string;
  retroalimentacion: string;
  xp_recompensa: number;
  dificultad: "facil" | "normal" | "dificil";
  obligatorio: boolean;
};
```

- [ ] **Step 2: Implement the shared shell and hook**

```tsx
<ActivityFormShell mode="edit" value={value} onSubmit={handleSubmit} />
```

- [ ] **Step 3: Reuse the shell in create and edit routes**

```tsx
<ActivityFormShell mode="create" ... />
<ActivityFormShell mode="edit" ... />
```

- [ ] **Step 4: Validate create/update flows**

Run: `cd frontend && bun run typecheck`
Expected: pass.

### Task 3: Extract shared activity preview shell

**Files:**
- Create: `frontend/src/features/admin/componentes/activity-preview-shell.tsx`
- Modify: `frontend/src/routes/admin.actividades.$activityId.preview.tsx`

**Interfaces:**
- Consumes: activity detail query
- Produces: read-only admin preview view

- [ ] **Step 1: Write the preview shape contract**

```ts
type ActivityPreviewProps = {
  actividadId: string;
  onBack: () => void;
};
```

- [ ] **Step 2: Implement preview shell with readonly sections**

```tsx
<ActivityPreviewShell actividad={actividad} />
```

- [ ] **Step 3: Verify public/admin preview separation**

Run: `cd frontend && bun run typecheck`
Expected: pass.

### Task 4: Polish admin list integration

**Files:**
- Modify: `frontend/src/features/admin/componentes/admin-activities-table.tsx`
- Modify: `frontend/src/features/admin/hooks/use-admin-activities.ts`
- Modify: `frontend/src/routes/admin.actividades.tsx`

**Interfaces:**
- Consumes: paginated admin activity list and delete mutation
- Produces: list page with correct entry points to dedicated screens

- [ ] **Step 1: Ensure list page links to dedicated routes only**

```tsx
navigate({ to: "/admin/actividades/new" });
```

- [ ] **Step 2: Keep delete action in list working against admin API**

```tsx
deleteMutation.mutate(activity.id);
```

- [ ] **Step 3: Validate build**

Run: `cd frontend && bun run build`
Expected: pass.
