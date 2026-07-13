# Admin Shell Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer que `/admin` comparta el mismo shell visual que `/app` en fondo, spacing y colores, sin tocar el contenido interno de las pantallas.

**Architecture:** Reutilizar los mismos tokens visuales y el mismo ritmo de layout del route shell de `/app` para `/admin`. El cambio debe quedar concentrado en el layout de ruta para que las páginas admin sigan funcionando igual, pero se perciban dentro del mismo sistema visual.

**Tech Stack:** React, TypeScript, TanStack Router, Tailwind CSS.

## Global Constraints

- Responder siempre en español.
- Usar Bun para scripts y verificaciones.
- No usar npm, pnpm ni yarn.
- Mantener el cambio limitado al shell: sidebar, topbar, spacing y colores.
- No reescribir el contenido interno de las pantallas de admin.

---

### Task 1: Normalizar el layout de `/admin`

**Files:**
- Modify: `frontend/src/routes/admin.tsx`

**Interfaces:**
- Consumes: `AppSidebar`, `AppTopbar`, `sessionStorageApi`, `useLocation`, `useNavigate`
- Produces: `AdminLayout` con el mismo fondo y spacing base que `/app`

- [ ] **Step 1: Actualizar el contenedor raíz**

```tsx
<div className="flex h-screen w-screen overflow-hidden bg-slate-50">
```

- [ ] **Step 2: Igualar el `main` al shell de `/app`**

```tsx
<main className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8 lg:p-10">
```

- [ ] **Step 3: Mantener el `Outlet` y la navegación existentes**

```tsx
<div className="flex flex-col gap-6 md:gap-8">
  <Outlet />
</div>
```

- [ ] **Step 4: Verificar que `/admin` siga renderizando el sidebar admin y el topbar compartido**

Run: `bun run --cwd frontend build`
Expected: build exitoso sin errores de TypeScript.

### Task 2: Validación visual rápida

**Files:**
- No code changes expected

**Interfaces:**
- Consumes: el layout actualizado de `/admin`
- Produces: confirmación de que `/admin/` y `/app/` comparten shell visual base

- [ ] **Step 1: Comparar `/app` y `/admin` en el navegador**
- [ ] **Step 2: Confirmar que el fondo, padding y ritmo de separación coinciden**
- [ ] **Step 3: Confirmar que la diferencia visible queda solo en el contenido interno y en los items de navegación**

Run: `bun run --cwd frontend dev`
Expected: ambas rutas se ven como variaciones del mismo sistema visual.
