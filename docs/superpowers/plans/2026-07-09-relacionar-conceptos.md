# Relacionar Conceptos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un componente profesional de actividad para relacionar conceptos bíblicos, mobile-first, con interacción por toque y drag/drop, tests y Storybook.

**Architecture:** La lógica de mezcla, validación y estado completado vivirá en `relacionar-conceptos.utils.ts` para poder testearla sin DOM. `RelacionarConceptos.tsx` consumirá esas utilidades y manejará estado visual, accesibilidad, feedback, reinicio y `onComplete`. Storybook documentará variantes móviles con datos bíblicos locales y sin depender de backend.

**Tech Stack:** React, TypeScript, Bun test, Storybook React Vite, Tailwind CSS, Lucide React.

## Global Constraints

- Usar Bun: `bun test ...` y `bun run --cwd frontend ...`; no usar npm, pnpm ni yarn.
- Mantener TypeScript estricto y evitar `any`.
- Componente en `frontend/src/componentes/actividades/RelacionarConceptos.tsx`.
- Utils en `frontend/src/componentes/actividades/relacionar-conceptos.utils.ts`.
- Stories en `frontend/src/componentes/actividades/RelacionarConceptos.stories.tsx`.
- No integrar backend, IndexedDB, sync offline ni XP real en esta versión.
- Soportar ambos modos: tocar pares y drag/drop.
- Mobile-first, accesible para niños, con tarjetas táctiles grandes.
- No tocar cambios preexistentes fuera de alcance en `frontend/src/shared/auth/supabase.ts` ni `frontend/src/shared/config/env.ts`.

---

## File Structure

- Create: `frontend/src/componentes/actividades/relacionar-conceptos.utils.ts`
  - Responsabilidad: tipos, mezcla de relaciones, normalización de pares, validación de intento, completado y reinicio.
- Create: `frontend/src/componentes/actividades/relacionar-conceptos.utils.test.ts`
  - Responsabilidad: tests de lógica pura con `bun:test`.
- Create: `frontend/src/componentes/actividades/RelacionarConceptos.tsx`
  - Responsabilidad: UI mobile-first, interacción por toque y drag/drop, feedback, accesibilidad, `onComplete`.
- Create: `frontend/src/componentes/actividades/RelacionarConceptos.test.tsx`
  - Responsabilidad: smoke test SSR del componente.
- Create: `frontend/src/componentes/actividades/RelacionarConceptos.stories.tsx`
  - Responsabilidad: documentación visual y variantes en Storybook.

---

### Task 1: Utils De Relacionar Conceptos

**Files:**
- Create: `frontend/src/componentes/actividades/relacionar-conceptos.utils.test.ts`
- Create: `frontend/src/componentes/actividades/relacionar-conceptos.utils.ts`

**Interfaces:**
- Produces: `ParConcepto`, `RelacionConcepto`, `ResultadoIntentoRelacion`.
- Produces: `mezclarRelacionesConceptos(pares: ParConcepto[], random?: () => number): RelacionConcepto[]`.
- Produces: `validarIntentoRelacion(conceptoId: string, relacionId: string): ResultadoIntentoRelacion`.
- Produces: `agregarRelacionCompletada(completadas: string[], conceptoId: string): string[]`.
- Produces: `relacionesCompletadas(pares: ParConcepto[], completadas: string[]): boolean`.

- [ ] **Step 1: Write failing tests**

Create `frontend/src/componentes/actividades/relacionar-conceptos.utils.test.ts`:

```ts
import { describe, expect, it } from "bun:test";

import {
  agregarRelacionCompletada,
  mezclarRelacionesConceptos,
  relacionesCompletadas,
  validarIntentoRelacion,
  type ParConcepto,
} from "./relacionar-conceptos.utils";

const pares: ParConcepto[] = [
  { id: "noe", concepto: "Noe", relacion: "Construyo el arca" },
  { id: "david", concepto: "David", relacion: "Vencio a Goliat" },
  { id: "moises", concepto: "Moises", relacion: "Cruzo el Mar Rojo" },
];

describe("relacionar conceptos utils", () => {
  it("mezcla relaciones sin mutar los pares originales", () => {
    const randomValores = [0.9, 0.1, 0.5];
    const relaciones = mezclarRelacionesConceptos(pares, () => randomValores.shift() ?? 0.5);

    expect(pares[0]?.relacion).toBe("Construyo el arca");
    expect(relaciones).toHaveLength(3);
    expect(relaciones.map((relacion) => relacion.id).sort()).toEqual(["david", "moises", "noe"]);
  });

  it("valida intento correcto e incorrecto", () => {
    expect(validarIntentoRelacion("noe", "noe")).toEqual({ correcto: true, conceptoId: "noe", relacionId: "noe" });
    expect(validarIntentoRelacion("noe", "david")).toEqual({ correcto: false, conceptoId: "noe", relacionId: "david" });
  });

  it("agrega completadas sin duplicar ni mutar", () => {
    const completadas = ["noe"];

    expect(agregarRelacionCompletada(completadas, "david")).toEqual(["noe", "david"]);
    expect(agregarRelacionCompletada(completadas, "noe")).toEqual(["noe"]);
    expect(completadas).toEqual(["noe"]);
  });

  it("detecta actividad completada", () => {
    expect(relacionesCompletadas(pares, ["noe", "david"])).toBe(false);
    expect(relacionesCompletadas(pares, ["noe", "david", "moises"])).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
bun test frontend/src/componentes/actividades/relacionar-conceptos.utils.test.ts
```

Expected: FAIL because `./relacionar-conceptos.utils` does not exist.

- [ ] **Step 3: Implement utils**

Create `frontend/src/componentes/actividades/relacionar-conceptos.utils.ts`:

```ts
export type ParConcepto = {
  id: string;
  concepto: string;
  relacion: string;
  pista?: string;
};

export type RelacionConcepto = {
  id: string;
  texto: string;
};

export type ResultadoIntentoRelacion = {
  correcto: boolean;
  conceptoId: string;
  relacionId: string;
};

export function mezclarRelacionesConceptos(
  pares: ParConcepto[],
  random: () => number = Math.random,
): RelacionConcepto[] {
  return pares
    .map((par) => ({ id: par.id, texto: par.relacion, orden: random() }))
    .sort((a, b) => a.orden - b.orden)
    .map(({ id, texto }) => ({ id, texto }));
}

export function validarIntentoRelacion(conceptoId: string, relacionId: string): ResultadoIntentoRelacion {
  return {
    correcto: conceptoId === relacionId,
    conceptoId,
    relacionId,
  };
}

export function agregarRelacionCompletada(completadas: string[], conceptoId: string): string[] {
  if (completadas.includes(conceptoId)) {
    return [...completadas];
  }

  return [...completadas, conceptoId];
}

export function relacionesCompletadas(pares: ParConcepto[], completadas: string[]): boolean {
  if (pares.length === 0) {
    return false;
  }

  return pares.every((par) => completadas.includes(par.id));
}
```

- [ ] **Step 4: Run tests to verify pass**

Run:

```bash
bun test frontend/src/componentes/actividades/relacionar-conceptos.utils.test.ts
```

Expected: PASS.

---

### Task 2: Componente RelacionarConceptos

**Files:**
- Create: `frontend/src/componentes/actividades/RelacionarConceptos.test.tsx`
- Create: `frontend/src/componentes/actividades/RelacionarConceptos.tsx`

**Interfaces:**
- Consumes utils from Task 1.
- Produces: `RelacionarConceptos` and `RelacionarConceptosProps`.

- [ ] **Step 1: Write smoke test**

Create `frontend/src/componentes/actividades/RelacionarConceptos.test.tsx`:

```tsx
import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { RelacionarConceptos } from "./RelacionarConceptos";

describe("RelacionarConceptos", () => {
  it("renderiza encabezado, instrucciones, conceptos y relaciones accesibles", () => {
    const html = renderToStaticMarkup(
      <RelacionarConceptos
        titulo="Une cada personaje"
        descripcion="Relaciona cada personaje con su historia."
        xp={25}
        mostrarPistas
        pares={[
          { id: "noe", concepto: "Noe", relacion: "Construyo el arca", pista: "Hubo lluvia" },
          { id: "david", concepto: "David", relacion: "Vencio a Goliat", pista: "Uso una piedra" },
        ]}
      />,
    );

    expect(html).toContain("Une cada personaje");
    expect(html).toContain("Relaciona cada personaje con su historia.");
    expect(html).toContain("25 XP");
    expect(html).toContain("Toca o arrastra un concepto hacia su pareja.");
    expect(html).toContain('aria-label="Concepto Noe"');
    expect(html).toContain('aria-label="Relacion Construyo el arca"');
    expect(html).toContain("Hubo lluvia");
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
bun test frontend/src/componentes/actividades/RelacionarConceptos.test.tsx
```

Expected: FAIL because `./RelacionarConceptos` does not exist.

- [ ] **Step 3: Implement component**

Create `frontend/src/componentes/actividades/RelacionarConceptos.tsx` with these exact requirements:

```ts
export type RelacionarConceptosProps = {
  pares: ParConcepto[];
  titulo?: string;
  descripcion?: string;
  xp?: number;
  mostrarPistas?: boolean;
  onComplete?: () => void;
};
```

Implementation rules:

- Import `Boton` from `@/componentes/ui/boton`.
- Import `CheckCircle2`, `Grip`, `RefreshCcw`, `Sparkles`, `XCircle` from `lucide-react`.
- Use `useEffect`, `useMemo`, `useRef`, `useState`, `type JSX` from React.
- Use `mezclarRelacionesConceptos`, `validarIntentoRelacion`, `agregarRelacionCompletada`, `relacionesCompletadas`, `type ParConcepto`, `type RelacionConcepto` from utils.
- Keep `relaciones` shuffled in state and reset it with `mezclarRelacionesConceptos(pares)`.
- Track `conceptoSeleccionadoId: string | null`, `conceptoArrastradoId: string | null`, `completadas: string[]`, and `feedback` with correct/incorrect message.
- On correct match, add the id to completadas and clear selection.
- On incorrect match, clear selection and show error feedback.
- Completed concept/relation buttons must be disabled.
- On completion, dynamically import `@/lib/audio`, call `playSound("acertado")`, catch errors, and call `onComplete` once.
- Render a mobile-first section with Semillas colors matching `Rompecabezas`.
- Add instruction paragraph with `id="relacionar-conceptos-ayuda"`.
- Main board uses `role="group"`, `aria-describedby="relacionar-conceptos-ayuda"`.
- Concept buttons use `aria-label={`Concepto ${par.concepto}`}` and `aria-pressed`.
- Relation buttons use `aria-label={`Relacion ${relacion.texto}`}`.
- Include button text `Intentar otra vez`.

- [ ] **Step 4: Run component and utils tests**

Run:

```bash
bun test frontend/src/componentes/actividades/relacionar-conceptos.utils.test.ts frontend/src/componentes/actividades/RelacionarConceptos.test.tsx
```

Expected: PASS.

---

### Task 3: Storybook Y Verificación

**Files:**
- Create: `frontend/src/componentes/actividades/RelacionarConceptos.stories.tsx`

**Interfaces:**
- Consumes `RelacionarConceptos`, `RelacionarConceptosProps` and `ParConcepto`.
- Produces stories `BasicoMovil`, `ConPistas`, `DificultadMedia`, `CompletadoDemo`, `DocumentacionCompleta`.

- [ ] **Step 1: Create stories**

Create `frontend/src/componentes/actividades/RelacionarConceptos.stories.tsx` with:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import { RelacionarConceptos, type RelacionarConceptosProps } from "./RelacionarConceptos";

const meta = {
  title: "Actividades/RelacionarConceptos",
  component: RelacionarConceptos,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RelacionarConceptos>;

export default meta;
type Story = StoryObj<typeof meta>;

const paresBasicos: RelacionarConceptosProps["pares"] = [
  { id: "noe", concepto: "Noe", relacion: "Construyo el arca", pista: "Dios lo cuido durante el diluvio." },
  { id: "david", concepto: "David", relacion: "Vencio a Goliat", pista: "Confio en Dios con una honda." },
  { id: "moises", concepto: "Moises", relacion: "Cruzo el Mar Rojo", pista: "Guio al pueblo de Israel." },
];

const paresMedios: RelacionarConceptosProps["pares"] = [
  ...paresBasicos,
  { id: "maria", concepto: "Maria", relacion: "Madre de Jesus", pista: "Recibio una visita del angel." },
  { id: "pablo", concepto: "Pablo", relacion: "Escribio cartas a las iglesias", pista: "Viajo anunciando el evangelio." },
];

const baseArgs: RelacionarConceptosProps = {
  pares: paresBasicos,
  titulo: "Relaciona cada personaje",
  descripcion: "Une cada personaje bíblico con lo que hizo.",
  xp: 25,
  mostrarPistas: false,
};

export const BasicoMovil: Story = { args: { ...baseArgs } };
export const ConPistas: Story = { args: { ...baseArgs, mostrarPistas: true } };
export const DificultadMedia: Story = { args: { ...baseArgs, pares: paresMedios, xp: 40 } };
export const CompletadoDemo: Story = { args: { ...baseArgs, titulo: "Completa todos los pares" } };
export const DocumentacionCompleta: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <main className="min-h-screen bg-[#F7F4EC] p-4 text-[#123B2C] sm:p-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,440px)]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2E9E5B]">Semillas UI</p>
          <h1 className="mt-2 text-4xl font-black leading-tight">Relacionar conceptos</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#49695D]">
            Actividad para unir personajes, ideas o eventos bíblicos con su significado mediante toque o drag/drop.
          </p>
          <pre className="mt-6 overflow-auto rounded-3xl bg-[#123B2C] p-5 text-sm font-semibold leading-6 text-[#F7F4EC]">
            {`{
  tipo: "RELACIONAR_CONCEPTOS",
  titulo: "Personajes y acciones",
  configuracion: {
    pares: [
      { id: "noe", concepto: "Noe", relacion: "Construyo el arca" }
    ],
    xp: 25
  }
}`}
          </pre>
        </section>
        <RelacionarConceptos {...baseArgs} mostrarPistas />
      </div>
    </main>
  ),
};
```

- [ ] **Step 2: Run verification**

Run:

```bash
bun test frontend/src/componentes/actividades/relacionar-conceptos.utils.test.ts frontend/src/componentes/actividades/RelacionarConceptos.test.tsx
bun run --cwd frontend build-storybook
```

Expected: tests PASS and Storybook build PASS. If `bun run --cwd frontend build` is run, it may fail for preexisting `frontend/src/shared/auth/supabase.ts`; report it as out of scope.

---

## Self-Review

**Spec coverage:** Covered API, touch pairs, drag/drop, feedback, completion, reset, Storybook, tests, mobile-first and no backend/offline integration.

**Placeholder scan:** No placeholders or deferred implementation markers.

**Type consistency:** `ParConcepto`, `RelacionConcepto`, `RelacionarConceptosProps` and utility names are consistent across tasks.
