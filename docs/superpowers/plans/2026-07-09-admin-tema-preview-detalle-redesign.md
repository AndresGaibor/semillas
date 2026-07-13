# Admin Tema Preview/Detalle Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar `preview` y `detalle` del admin de temas para que se vean editoriales, claros y menos genéricos.

**Architecture:** Mantener las rutas existentes como pantallas de composición y usar solo helpers livianos cuando haya lógica repetida de formato o estado. El objetivo es mejorar jerarquía visual, densidad informativa y lectura rápida sin tocar backend.

**Tech Stack:** React, TypeScript, TanStack Router, TanStack Query, Tailwind CSS, Lucide React, Bun.

## Global Constraints

- Usar Bun como package manager y runtime de scripts.
- Usar React + TypeScript + Vite + Tailwind CSS.
- No introducir librerías nuevas para esta mejora visual.
- Mantener compatibilidad con Cloudflare Workers/Pages existente.
- Respetar la paleta y los patrones visuales ya usados en admin.

---

### Task 1: Shared theme-view helpers

**Files:**
- Create: `frontend/src/features/admin/componentes/theme-view.utils.ts`

**Interfaces:**
- Consumes: `Tema` from `frontend/src/shared/api/api.ts`
- Produces: `formatearFechaTema(fecha: string | null | undefined): string`, `obtenerEstadoTema(est: string): { etiqueta: string; tono: string }`, `obtenerResumenTema(tema: Tema): { ... }`

- [ ] **Step 1: Write the helper signatures**

```ts
export function formatearFechaTema(fecha?: string | null): string;
export function obtenerEstadoTema(estado: string): { etiqueta: string; tono: string };
```

- [ ] **Step 2: Implement formatting helpers**

```ts
export function formatearFechaTema(fecha?: string | null) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
```

- [ ] **Step 3: Verify the file typechecks in isolation**

Run: `bun run --cwd frontend typecheck`

Expected: PASS

---

### Task 2: Preview page redesign

**Files:**
- Modify: `frontend/src/routes/admin.temas.$themeId.preview.tsx`

**Interfaces:**
- Consumes: `obtenerTemaAdmin`, `obtenerPasosAdmin`, `obtenerActividades`, and helpers from `theme-view.utils.ts`
- Produces: a richer preview layout with hero, stats, CRECER timeline, activity cards, and right-rail summary

- [ ] **Step 1: Rework the page shell**

```tsx
<div className="min-h-screen bg-gradient-to-b from-[#f7f4ec] via-white to-[#eefcf4]">
  <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
```

- [ ] **Step 2: Add a premium hero block**

```tsx
<section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_20px_80px_rgba(18,59,44,0.08)]">
  {/* portada + overlay + estado + metadatos */}
</section>
```

- [ ] **Step 3: Present CRECER as a visual timeline**

```tsx
stepsQuery.data?.map((step) => (
  <article key={step.id} className="rounded-[1.75rem] border border-slate-100 bg-white p-5">
    {/* encabezado de paso + contenidos anidados */}
  </article>
));
```

- [ ] **Step 4: Render activities as editorial cards instead of plain list items**

```tsx
activitiesQuery.data?.map((activity) => (
  <article key={activity.id} className="rounded-[1.5rem] border border-slate-100 bg-[#fffdf7] p-4">
    {/* título, tipo, XP, consigna y opciones */}
  </article>
));
```

- [ ] **Step 5: Verify the route compiles and looks balanced on mobile/desktop**

Run: `bun run --cwd frontend typecheck`

Expected: PASS

---

### Task 3: Detail page redesign

**Files:**
- Modify: `frontend/src/routes/admin.temas.$themeId.detalle.tsx`

**Interfaces:**
- Consumes: `obtenerTemaAdmin`, `obtenerPasosAdmin`, `obtenerActividades`, `obtenerUrlPortadaTema`, and helpers from `theme-view.utils.ts`
- Produces: a polished admin detail page with strong summary, metrics, verse block, content sections, and action rail

- [ ] **Step 1: Rebuild the summary area as a top hero**

```tsx
<section className="grid gap-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_20px_80px_rgba(18,59,44,0.08)] lg:grid-cols-[1.3fr_.7fr]">
  {/* portada, título, resumen, estado, badges */}
</section>
```

- [ ] **Step 2: Surface real theme metadata prominently**

```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
  {/* XP, duración, senda, versión, grupos de edad */}
</div>
```

- [ ] **Step 3: Add a separate verse and publication panel**

```tsx
{theme?.versiculo_clave ? (
  <section className="rounded-[1.75rem] border border-[#f4b740]/20 bg-[#fff8e7] p-5">
    {/* texto y referencia del versículo */}
  </section>
) : null}
```

- [ ] **Step 4: Convert the actions column into a sticky rail**

```tsx
<aside className="lg:sticky lg:top-6 space-y-4">
  {/* acciones + metadatos + estado */}
</aside>
```

- [ ] **Step 5: Verify detail view compilation and route interaction**

Run: `bun run --cwd frontend typecheck`

Expected: PASS

---

### Task 4: Visual verification

**Files:**
- Verify only

**Interfaces:**
- Consumes: updated preview/detail routes
- Produces: confirmed compile pass and UI sanity on both routes

- [ ] **Step 1: Run frontend typecheck**

Run: `bun run --cwd frontend typecheck`

Expected: PASS

- [ ] **Step 2: Run frontend build**

Run: `bun run --cwd frontend build`

Expected: PASS

- [ ] **Step 3: Smoke-check the two routes in the browser**

Open:
- `http://localhost:5173/admin/temas/d94347af-a8e5-4b59-aa3c-5c97840a990b/preview`
- `http://localhost:5173/admin/temas/d94347af-a8e5-4b59-aa3c-5c97840a990b/detalle`

Expected: both views look intentional, balanced, and readable on mobile and desktop.
