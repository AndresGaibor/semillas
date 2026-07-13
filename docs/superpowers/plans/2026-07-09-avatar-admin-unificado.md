# Avatar y shell admin unificados Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer funcional el avatar del topbar y unificar el layout de admin con el mismo header y sidebar de la app.

**Architecture:** `AppTopbar` resolverá nombre, correo y avatar desde `meQuery` sin valores hardcodeados. `AppSidebar` tendrá un modo `app` y un modo `admin` para reutilizar el mismo shell visual con enlaces adicionales de administración.

**Tech Stack:** React, TypeScript, TanStack Query, TanStack Router, Bun tests.

## Global Constraints

- Responder siempre en español.
- Usar Bun como package manager/runtime.
- No usar npm, pnpm ni yarn.
- Mantener la estructura modular existente.
- Evitar `any` y no introducir abstracciones innecesarias.

---

### Task 1: Avatar dinámico en `AppTopbar`

**Files:**
- Modify: `frontend/src/shared/layout/app-topbar.tsx`
- Test: `frontend/src/shared/layout/app-topbar.test.ts`

**Interfaces:**
- Consumes: `obtenerMiPerfil()` y los tipos `Usuario` / `Perfil` de `frontend/src/shared/api/api.ts`
- Produces: `obtenerDatosCuentaTopbar(perfil, usuario)` para resolver nombre, correo y avatar

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "bun:test";
import { obtenerDatosCuentaTopbar } from "./app-topbar";

describe("obtenerDatosCuentaTopbar", () => {
  it("muestra Invitado cuando el usuario es invitado", () => {
    const cuenta = obtenerDatosCuentaTopbar(
      { apodo: "Semillero", url_avatar: null } as never,
      { proveedor: "invitado", correo: null, nombre_visible: "Semillero" } as never,
    );

    expect(cuenta.nombre).toBe("Invitado");
    expect(cuenta.correo).toBe("Invitado");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test frontend/src/shared/layout/app-topbar.test.ts -v`
Expected: FAIL because `obtenerDatosCuentaTopbar` does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export function obtenerDatosCuentaTopbar(perfil?: Perfil, usuario?: Usuario) {
  const esInvitado = usuario?.proveedor === "invitado";
  const nombre = esInvitado ? "Invitado" : perfil?.apodo || usuario?.nombre_visible || "Semillero";
  const correo = esInvitado ? "Invitado" : usuario?.correo || "admin@semillas.org";
  const avatarUrl = MAPA_AVATARES[perfil?.url_avatar || "1"] || MAPA_AVATARES["1"] || "";

  return { nombre, correo, avatarUrl };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test frontend/src/shared/layout/app-topbar.test.ts -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/shared/layout/app-topbar.tsx frontend/src/shared/layout/app-topbar.test.ts
git commit -m "feat: avatar dinamico en topbar"
```

### Task 2: Sidebar único con modo admin

**Files:**
- Modify: `frontend/src/shared/layout/app-sidebar.tsx`
- Modify: `frontend/src/shared/layout/app-sidebar.stories.tsx`
- Test: `frontend/src/shared/layout/app-sidebar.test.ts`

**Interfaces:**
- Consumes: `variant: "app" | "admin"`
- Produces: `obtenerSeccionesSidebar(variant)` para compartir navegación base y navegación administrativa

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "bun:test";
import { obtenerSeccionesSidebar } from "./app-sidebar";

describe("obtenerSeccionesSidebar", () => {
  it("agrega navegación de administración en modo admin", () => {
    const secciones = obtenerSeccionesSidebar("admin");
    expect(secciones.length).toBe(2);
    expect(secciones[1].titulo).toBe("Administración");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test frontend/src/shared/layout/app-sidebar.test.ts -v`
Expected: FAIL because `obtenerSeccionesSidebar` does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export function obtenerSeccionesSidebar(variant: "app" | "admin") {
  return variant === "admin"
    ? [{ items: itemsApp }, { titulo: "Administración", items: itemsAdmin }]
    : [{ items: itemsApp }];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test frontend/src/shared/layout/app-sidebar.test.ts -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/shared/layout/app-sidebar.tsx frontend/src/shared/layout/app-sidebar.stories.tsx frontend/src/shared/layout/app-sidebar.test.ts
git commit -m "feat: sidebar compartido para app y admin"
```

### Task 3: Ruta admin con shell compartido y limpieza

**Files:**
- Modify: `frontend/src/routes/admin.tsx`
- Modify: `frontend/src/components/admin/PanelAdministracion.tsx`
- Delete: `frontend/src/shared/layout/admin-sidebar.tsx`
- Delete: `frontend/src/shared/layout/admin-sidebar.stories.tsx`
- Delete: `frontend/src/components/admin/panel/encabezado-admin.tsx`

**Interfaces:**
- Consumes: `AppSidebar` y `AppTopbar`
- Produces: `/admin` usa el mismo layout visual que `/app`, solo con navegación administrativa adicional

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

describe("admin layout", () => {
  it("ya no importa AdminSidebar", () => {
    const source = readFileSync("frontend/src/routes/admin.tsx", "utf8");
    expect(source).not.toContain("AdminSidebar");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test frontend/src/routes/admin.layout.test.ts -v`
Expected: FAIL until the route is migrated.

- [ ] **Step 3: Write minimal implementation**

```ts
import { AppSidebar } from "../shared/layout/app-sidebar";
...
<AppSidebar variant="admin" ... />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run --cwd frontend typecheck && bun run --cwd frontend build`
Expected: both commands complete without errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/routes/admin.tsx frontend/src/components/admin/PanelAdministracion.tsx frontend/src/shared/layout/admin-sidebar.tsx frontend/src/shared/layout/admin-sidebar.stories.tsx frontend/src/components/admin/panel/encabezado-admin.tsx
git commit -m "refactor: shell admin compartido"
```
