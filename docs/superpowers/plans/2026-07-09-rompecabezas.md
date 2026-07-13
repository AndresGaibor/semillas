# Rompecabezas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un componente profesional de rompecabezas mobile-first para Semillas, con interacción por toque y drag/drop, usando assets locales y documentación completa en Storybook.

**Architecture:** La lógica pura de piezas vivirá separada del componente para poder testear mezcla, intercambio y completado sin DOM interactivo. `Rompecabezas.tsx` será un componente React autocontenido, independiente de backend/offline/progreso, con `onComplete` para integración futura. Storybook documentará variantes de dificultad y uso con imágenes reales de `frontend/src/assets/images/Ilustraciones`.

**Tech Stack:** React, TypeScript, Bun test, Storybook React Vite, Tailwind CSS, Lucide React.

## Global Constraints

- Usar Bun: `bun run --cwd frontend ...`; no usar npm, pnpm ni yarn.
- Mantener TypeScript estricto y evitar `any`.
- Componente en `frontend/src/componentes/actividades/Rompecabezas.tsx`.
- Stories en `frontend/src/componentes/actividades/Rompecabezas.stories.tsx`.
- Assets importados desde `frontend/src/assets/images/Ilustraciones`.
- No integrar backend, IndexedDB, sync offline ni XP real en esta versión.
- Soportar ambos modos: tocar/intercambiar y drag/drop.
- Mobile-first, accesible para niños, con botones/piezas táctiles grandes.

---

## File Structure

- Create: `frontend/src/componentes/actividades/rompecabezas.utils.ts`
  - Responsabilidad: crear piezas, mezclar posiciones, intercambiar piezas, detectar completado y calcular `background-position`.
- Create: `frontend/src/componentes/actividades/rompecabezas.utils.test.ts`
  - Responsabilidad: validar lógica pura con `bun:test` y `renderToStaticMarkup` no requerido.
- Create: `frontend/src/componentes/actividades/Rompecabezas.tsx`
  - Responsabilidad: UI mobile-first, estado React, click/touch, drag/drop, accesibilidad, callback `onComplete`.
- Create: `frontend/src/componentes/actividades/Rompecabezas.stories.tsx`
  - Responsabilidad: documentación visual y variantes en Storybook.
- No modify expected: package files, router, backend, IndexedDB or API code.

---

### Task 1: Lógica Pura Del Rompecabezas

**Files:**
- Create: `frontend/src/componentes/actividades/rompecabezas.utils.test.ts`
- Create: `frontend/src/componentes/actividades/rompecabezas.utils.ts`

**Interfaces:**
- Produces: `type PiezaRompecabezas = { id: number; posicionCorrecta: number; posicionActual: number }`
- Produces: `crearPiezasRompecabezas(filas: number, columnas: number): PiezaRompecabezas[]`
- Produces: `mezclarPiezasRompecabezas(piezas: PiezaRompecabezas[], random?: () => number): PiezaRompecabezas[]`
- Produces: `intercambiarPiezas(piezas: PiezaRompecabezas[], primeraId: number, segundaId: number): PiezaRompecabezas[]`
- Produces: `rompecabezasCompletado(piezas: PiezaRompecabezas[]): boolean`
- Produces: `calcularFondoPieza(posicionCorrecta: number, filas: number, columnas: number): { fila: number; columna: number; backgroundSize: string; backgroundPosition: string }`

- [ ] **Step 1: Write the failing test**

Create `frontend/src/componentes/actividades/rompecabezas.utils.test.ts`:

```ts
import { describe, expect, it } from "bun:test";

import {
  calcularFondoPieza,
  crearPiezasRompecabezas,
  intercambiarPiezas,
  mezclarPiezasRompecabezas,
  rompecabezasCompletado,
} from "./rompecabezas.utils";

describe("rompecabezas utils", () => {
  it("crea piezas con posiciones correctas y actuales ordenadas", () => {
    const piezas = crearPiezasRompecabezas(2, 3);

    expect(piezas).toEqual([
      { id: 0, posicionCorrecta: 0, posicionActual: 0 },
      { id: 1, posicionCorrecta: 1, posicionActual: 1 },
      { id: 2, posicionCorrecta: 2, posicionActual: 2 },
      { id: 3, posicionCorrecta: 3, posicionActual: 3 },
      { id: 4, posicionCorrecta: 4, posicionActual: 4 },
      { id: 5, posicionCorrecta: 5, posicionActual: 5 },
    ]);
  });

  it("mezcla posiciones sin mutar las piezas originales", () => {
    const piezas = crearPiezasRompecabezas(2, 2);
    const randomValores = [0.9, 0.1, 0.8, 0.2];
    const mezcladas = mezclarPiezasRompecabezas(piezas, () => randomValores.shift() ?? 0.5);

    expect(piezas.map((pieza) => pieza.posicionActual)).toEqual([0, 1, 2, 3]);
    expect(mezcladas).not.toBe(piezas);
    expect(mezcladas.map((pieza) => pieza.posicionActual).sort()).toEqual([0, 1, 2, 3]);
    expect(rompecabezasCompletado(mezcladas)).toBe(false);
  });

  it("intercambia dos piezas sin mutar el arreglo original", () => {
    const piezas = crearPiezasRompecabezas(2, 2);
    const intercambiadas = intercambiarPiezas(piezas, 0, 3);

    expect(piezas[0]?.posicionActual).toBe(0);
    expect(piezas[3]?.posicionActual).toBe(3);
    expect(intercambiadas.find((pieza) => pieza.id === 0)?.posicionActual).toBe(3);
    expect(intercambiadas.find((pieza) => pieza.id === 3)?.posicionActual).toBe(0);
  });

  it("detecta cuando el rompecabezas esta completado", () => {
    const piezas = crearPiezasRompecabezas(2, 2);

    expect(rompecabezasCompletado(piezas)).toBe(true);
    expect(rompecabezasCompletado(intercambiarPiezas(piezas, 0, 1))).toBe(false);
  });

  it("calcula fondo correcto para piezas de una grilla 3x3", () => {
    expect(calcularFondoPieza(4, 3, 3)).toEqual({
      fila: 1,
      columna: 1,
      backgroundSize: "300% 300%",
      backgroundPosition: "50% 50%",
    });
  });

  it("calcula fondo correcto para grillas de una sola fila o columna", () => {
    expect(calcularFondoPieza(1, 1, 3).backgroundPosition).toBe("50% 0%");
    expect(calcularFondoPieza(1, 3, 1).backgroundPosition).toBe("0% 50%");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
bun test frontend/src/componentes/actividades/rompecabezas.utils.test.ts
```

Expected: FAIL because `./rompecabezas.utils` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create `frontend/src/componentes/actividades/rompecabezas.utils.ts`:

```ts
export type PiezaRompecabezas = {
  id: number;
  posicionCorrecta: number;
  posicionActual: number;
};

export function crearPiezasRompecabezas(filas: number, columnas: number): PiezaRompecabezas[] {
  const totalPiezas = filas * columnas;

  return Array.from({ length: totalPiezas }, (_, indice) => ({
    id: indice,
    posicionCorrecta: indice,
    posicionActual: indice,
  }));
}

export function mezclarPiezasRompecabezas(
  piezas: PiezaRompecabezas[],
  random: () => number = Math.random,
): PiezaRompecabezas[] {
  const posicionesMezcladas = piezas
    .map((pieza) => pieza.posicionActual)
    .map((posicion) => ({ posicion, orden: random() }))
    .sort((a, b) => a.orden - b.orden)
    .map(({ posicion }) => posicion);

  return piezas.map((pieza, indice) => ({
    ...pieza,
    posicionActual: posicionesMezcladas[indice] ?? pieza.posicionActual,
  }));
}

export function intercambiarPiezas(
  piezas: PiezaRompecabezas[],
  primeraId: number,
  segundaId: number,
): PiezaRompecabezas[] {
  const primeraPieza = piezas.find((pieza) => pieza.id === primeraId);
  const segundaPieza = piezas.find((pieza) => pieza.id === segundaId);

  if (!primeraPieza || !segundaPieza || primeraId === segundaId) {
    return piezas;
  }

  return piezas.map((pieza) => {
    if (pieza.id === primeraId) {
      return { ...pieza, posicionActual: segundaPieza.posicionActual };
    }

    if (pieza.id === segundaId) {
      return { ...pieza, posicionActual: primeraPieza.posicionActual };
    }

    return pieza;
  });
}

export function rompecabezasCompletado(piezas: PiezaRompecabezas[]): boolean {
  return piezas.every((pieza) => pieza.posicionActual === pieza.posicionCorrecta);
}

function calcularPorcentaje(indice: number, total: number): number {
  if (total <= 1) {
    return 0;
  }

  return (indice / (total - 1)) * 100;
}

export function calcularFondoPieza(posicionCorrecta: number, filas: number, columnas: number) {
  const fila = Math.floor(posicionCorrecta / columnas);
  const columna = posicionCorrecta % columnas;

  return {
    fila,
    columna,
    backgroundSize: `${columnas * 100}% ${filas * 100}%`,
    backgroundPosition: `${calcularPorcentaje(columna, columnas)}% ${calcularPorcentaje(fila, filas)}%`,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
bun test frontend/src/componentes/actividades/rompecabezas.utils.test.ts
```

Expected: PASS for all `rompecabezas utils` tests.

- [ ] **Step 5: Commit**

Skip commit unless the user explicitly requests it. If committing is requested later, use:

```bash
git add frontend/src/componentes/actividades/rompecabezas.utils.ts frontend/src/componentes/actividades/rompecabezas.utils.test.ts
git commit -m "feat: add puzzle activity logic"
```

---

### Task 2: Componente React Mobile-First

**Files:**
- Create: `frontend/src/componentes/actividades/Rompecabezas.tsx`
- Modify: `frontend/src/componentes/actividades/rompecabezas.utils.ts` only if TypeScript needs an explicit return type for `calcularFondoPieza`.

**Interfaces:**
- Consumes: `crearPiezasRompecabezas`, `mezclarPiezasRompecabezas`, `intercambiarPiezas`, `rompecabezasCompletado`, `calcularFondoPieza` from Task 1.
- Produces: `type RompecabezasProps` and `function Rompecabezas(props: RompecabezasProps): JSX.Element`.

- [ ] **Step 1: Add render smoke test before implementation**

Create `frontend/src/componentes/actividades/Rompecabezas.test.tsx`:

```tsx
import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Rompecabezas } from "./Rompecabezas";

describe("Rompecabezas", () => {
  it("renderiza titulo, ayuda, tablero y piezas accesibles", () => {
    const html = renderToStaticMarkup(
      <Rompecabezas
        imagen="/demo/tema.png"
        titulo="Arca de Noe"
        descripcion="Ordena la imagen para completar la actividad."
        filas={2}
        columnas={2}
        xp={20}
      />,
    );

    expect(html).toContain("Arca de Noe");
    expect(html).toContain("Ordena la imagen para completar la actividad.");
    expect(html).toContain("20 XP");
    expect(html).toContain("Toca o arrastra dos piezas para intercambiarlas.");
    expect(html).toContain('aria-label="Pieza 1 de 4"');
    expect(html).toContain("background-size:200% 200%");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
bun test frontend/src/componentes/actividades/Rompecabezas.test.tsx
```

Expected: FAIL because `./Rompecabezas` does not exist.

- [ ] **Step 3: Implement component**

Create `frontend/src/componentes/actividades/Rompecabezas.tsx`:

```tsx
import { CheckCircle2, Eye, Grip, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Boton } from "@/componentes/ui/boton";
import { playSound } from "@/lib/audio";

import {
  calcularFondoPieza,
  crearPiezasRompecabezas,
  intercambiarPiezas,
  mezclarPiezasRompecabezas,
  rompecabezasCompletado,
  type PiezaRompecabezas,
} from "./rompecabezas.utils";

export type RompecabezasProps = {
  imagen: string;
  titulo?: string;
  descripcion?: string;
  filas?: number;
  columnas?: number;
  xp?: number;
  mostrarVistaReferencia?: boolean;
  onComplete?: () => void;
};

function ordenarPorPosicionActual(piezas: PiezaRompecabezas[]): PiezaRompecabezas[] {
  return [...piezas].sort((a, b) => a.posicionActual - b.posicionActual);
}

export function Rompecabezas({
  imagen,
  titulo = "Arma el rompecabezas",
  descripcion = "Toca o arrastra dos piezas para intercambiarlas.",
  filas = 3,
  columnas = 3,
  xp,
  mostrarVistaReferencia = true,
  onComplete,
}: RompecabezasProps) {
  const piezasBase = useMemo(() => crearPiezasRompecabezas(filas, columnas), [filas, columnas]);
  const [piezas, setPiezas] = useState(() => mezclarPiezasRompecabezas(piezasBase));
  const [piezaSeleccionadaId, setPiezaSeleccionadaId] = useState<number | null>(null);
  const [piezaArrastradaId, setPiezaArrastradaId] = useState<number | null>(null);
  const completoNotificado = useRef(false);

  const totalPiezas = filas * columnas;
  const estaCompletado = rompecabezasCompletado(piezas);

  useEffect(() => {
    setPiezas(mezclarPiezasRompecabezas(piezasBase));
    setPiezaSeleccionadaId(null);
    completoNotificado.current = false;
  }, [piezasBase]);

  useEffect(() => {
    if (!estaCompletado || completoNotificado.current) {
      return;
    }

    completoNotificado.current = true;
    playSound("acertado");
    onComplete?.();
  }, [estaCompletado, onComplete]);

  function mezclarOtraVez() {
    setPiezas((piezasActuales) => mezclarPiezasRompecabezas(piezasActuales));
    setPiezaSeleccionadaId(null);
    completoNotificado.current = false;
  }

  function intercambiarPorId(primeraId: number, segundaId: number) {
    setPiezas((piezasActuales) => intercambiarPiezas(piezasActuales, primeraId, segundaId));
  }

  function seleccionarPieza(id: number) {
    if (piezaSeleccionadaId === null) {
      setPiezaSeleccionadaId(id);
      return;
    }

    if (piezaSeleccionadaId === id) {
      setPiezaSeleccionadaId(null);
      return;
    }

    intercambiarPorId(piezaSeleccionadaId, id);
    setPiezaSeleccionadaId(null);
  }

  function iniciarArrastre(id: number) {
    setPiezaArrastradaId(id);
  }

  function soltarSobrePieza(id: number) {
    if (piezaArrastradaId !== null && piezaArrastradaId !== id) {
      intercambiarPorId(piezaArrastradaId, id);
    }

    setPiezaArrastradaId(null);
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-[2rem] bg-[#F7F4EC] p-4 text-[#123B2C] shadow-[0_18px_50px_rgba(18,59,44,0.12)] sm:p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#2E9E5B]">
            <Sparkles className="size-3" aria-hidden="true" /> Actividad
          </p>
          <h2 className="text-2xl font-black leading-tight text-[#123B2C]">{titulo}</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#49695D]">{descripcion}</p>
        </div>

        {typeof xp === "number" && (
          <span className="shrink-0 rounded-2xl bg-[#F4B740] px-3 py-2 text-sm font-black text-[#123B2C] shadow-sm">
            {xp} XP
          </span>
        )}
      </header>

      {mostrarVistaReferencia && (
        <div className="flex items-center gap-3 rounded-3xl border border-[#E5DEC9] bg-white/80 p-3">
          <img src={imagen} alt="Vista de referencia del rompecabezas" className="size-16 rounded-2xl object-cover" />
          <div>
            <p className="flex items-center gap-1 text-sm font-black text-[#123B2C]">
              <Eye className="size-4" aria-hidden="true" /> Mira la imagen completa
            </p>
            <p className="text-xs font-semibold leading-5 text-[#6E7F76]">Úsala como pista antes de ordenar las piezas.</p>
          </div>
        </div>
      )}

      <div
        className="grid aspect-square w-full overflow-hidden rounded-[1.75rem] border-4 border-white bg-white shadow-[inset_0_0_0_1px_rgba(18,59,44,0.08),0_14px_32px_rgba(18,59,44,0.16)]"
        style={{ gridTemplateColumns: `repeat(${columnas}, 1fr)`, gridTemplateRows: `repeat(${filas}, 1fr)` }}
        aria-label={`Rompecabezas de ${filas} por ${columnas}`}
      >
        {ordenarPorPosicionActual(piezas).map((pieza) => {
          const fondo = calcularFondoPieza(pieza.posicionCorrecta, filas, columnas);
          const seleccionada = piezaSeleccionadaId === pieza.id;

          return (
            <button
              key={pieza.id}
              type="button"
              draggable
              onClick={() => seleccionarPieza(pieza.id)}
              onDragStart={() => iniciarArrastre(pieza.id)}
              onDragOver={(evento) => evento.preventDefault()}
              onDrop={() => soltarSobrePieza(pieza.id)}
              onDragEnd={() => setPiezaArrastradaId(null)}
              aria-label={`Pieza ${pieza.id + 1} de ${totalPiezas}`}
              aria-pressed={seleccionada}
              className={[
                "relative touch-manipulation border border-white bg-cover bg-no-repeat transition duration-200 ease-out",
                "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3D8BD4]",
                seleccionada ? "z-10 scale-95 ring-4 ring-[#3D8BD4]" : "hover:scale-[0.98] active:scale-95",
              ].join(" ")}
              style={{ backgroundImage: `url(${imagen})`, backgroundSize: fondo.backgroundSize, backgroundPosition: fondo.backgroundPosition }}
            >
              <span className="sr-only">Toca o arrastra esta pieza para intercambiarla</span>
              {seleccionada && <Grip className="absolute right-2 top-2 size-5 rounded-full bg-white/90 p-1 text-[#3D8BD4]" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {estaCompletado && (
        <div className="flex items-center gap-3 rounded-3xl bg-[#DCFCE7] px-4 py-3 text-[#166534]">
          <CheckCircle2 className="size-6 shrink-0" aria-hidden="true" />
          <p className="text-sm font-black">Excelente. Completaste el rompecabezas.</p>
        </div>
      )}

      <Boton variante="exito" tamano="grande" anchoCompleto iconoIzquierdo={<RotateCcw className="size-5" />} onClick={mezclarOtraVez}>
        Mezclar otra vez
      </Boton>
    </section>
  );
}
```

- [ ] **Step 4: Run component test**

Run:

```bash
bun test frontend/src/componentes/actividades/Rompecabezas.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Run utils test again**

Run:

```bash
bun test frontend/src/componentes/actividades/rompecabezas.utils.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

Skip commit unless the user explicitly requests it. If committing is requested later, use:

```bash
git add frontend/src/componentes/actividades/Rompecabezas.tsx frontend/src/componentes/actividades/Rompecabezas.test.tsx
git commit -m "feat: add mobile puzzle component"
```

---

### Task 3: Storybook Completo

**Files:**
- Create: `frontend/src/componentes/actividades/Rompecabezas.stories.tsx`

**Interfaces:**
- Consumes: `Rompecabezas` and `RompecabezasProps` from Task 2.
- Produces: Storybook stories `Facil2x2Movil`, `Normal3x3`, `Dificil4x4`, `ConVistaReferencia`, `SinVistaReferencia`, `DocumentacionCompleta`.

- [ ] **Step 1: Create Storybook stories**

Create `frontend/src/componentes/actividades/Rompecabezas.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import conectar from "@/assets/images/Ilustraciones/Conectar.png";
import sendaPadre from "@/assets/images/Ilustraciones/Senda del Padre.png";
import tema1 from "@/assets/images/Ilustraciones/Tema1.png";
import tema2 from "@/assets/images/Ilustraciones/Tema2.png";

import { Rompecabezas, type RompecabezasProps } from "./Rompecabezas";

const meta = {
  title: "Actividades/Rompecabezas",
  component: Rompecabezas,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    imagen: { control: false, description: "URL o asset importado para dividir en piezas" },
    titulo: { control: "text" },
    descripcion: { control: "text" },
    filas: { control: { type: "number", min: 1, max: 4, step: 1 } },
    columnas: { control: { type: "number", min: 1, max: 4, step: 1 } },
    xp: { control: { type: "number", min: 0, max: 200, step: 5 } },
    mostrarVistaReferencia: { control: "boolean" },
  },
} satisfies Meta<typeof Rompecabezas>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs: RompecabezasProps = {
  imagen: tema1,
  titulo: "Arma la historia bíblica",
  descripcion: "Toca una pieza y luego otra, o arrastra para intercambiarlas.",
  filas: 3,
  columnas: 3,
  xp: 20,
  mostrarVistaReferencia: true,
};

export const Facil2x2Movil: Story = {
  name: "Fácil 2x2 móvil",
  args: {
    ...baseArgs,
    imagen: conectar,
    titulo: "Primer rompecabezas",
    filas: 2,
    columnas: 2,
    xp: 10,
  },
};

export const Normal3x3: Story = {
  args: baseArgs,
};

export const Dificil4x4: Story = {
  args: {
    ...baseArgs,
    imagen: tema2,
    titulo: "Reto de exploradores",
    filas: 4,
    columnas: 4,
    xp: 35,
  },
};

export const ConVistaReferencia: Story = {
  args: {
    ...baseArgs,
    imagen: sendaPadre,
    titulo: "Senda del Padre",
    mostrarVistaReferencia: true,
  },
};

export const SinVistaReferencia: Story = {
  args: {
    ...baseArgs,
    imagen: sendaPadre,
    titulo: "Reto sin pista",
    mostrarVistaReferencia: false,
  },
};

export const DocumentacionCompleta: Story = {
  name: "Documentación completa",
  parameters: { layout: "fullscreen" },
  render: () => (
    <main className="min-h-screen bg-[#F7F4EC] p-4 text-[#123B2C] sm:p-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,420px)]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2E9E5B]">Semillas UI</p>
          <h1 className="mt-2 text-4xl font-black leading-tight">Rompecabezas móvil</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#49695D]">
            Actividad de cuadrícula para niños. Divide una imagen con background-position y permite resolverla tocando o arrastrando piezas.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["2x2", "Semillas 5-8", "Primer contacto, pocas piezas y bajo esfuerzo."],
              ["3x3", "Exploradores", "Dificultad recomendada para actividades normales."],
              ["4x4", "Reto", "Más concentración para usuarios con práctica."],
            ].map(([nivel, titulo, descripcion]) => (
              <article key={nivel} className="rounded-3xl border border-[#E5DEC9] bg-[#F7F4EC] p-4">
                <p className="text-2xl font-black text-[#2E9E5B]">{nivel}</p>
                <h2 className="mt-2 font-black">{titulo}</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#6E7F76]">{descripcion}</p>
              </article>
            ))}
          </div>

          <pre className="mt-6 overflow-auto rounded-3xl bg-[#123B2C] p-5 text-sm font-semibold leading-6 text-[#F7F4EC]">
{`{
  tipo: "ROMPECABEZAS",
  titulo: "Arca de Noe",
  configuracion: {
    imagen: "/actividades/arca-noe.png",
    filas: 3,
    columnas: 3,
    xp: 20
  }
}`}
          </pre>
        </section>

        <Rompecabezas {...baseArgs} />
      </div>
    </main>
  ),
};
```

- [ ] **Step 2: Build Storybook**

Run:

```bash
bun run --cwd frontend build-storybook
```

Expected: PASS and Storybook static output generated.

- [ ] **Step 3: Commit**

Skip commit unless the user explicitly requests it. If committing is requested later, use:

```bash
git add frontend/src/componentes/actividades/Rompecabezas.stories.tsx
git commit -m "docs: add puzzle activity stories"
```

---

### Task 4: Verificación Final Y Ajustes De Build

**Files:**
- Modify only files created in Tasks 1-3 if verification exposes TypeScript, Storybook or import issues.

**Interfaces:**
- Consumes: all files from Tasks 1-3.
- Produces: verified implementation ready for review.

- [ ] **Step 1: Run targeted tests**

Run:

```bash
bun test frontend/src/componentes/actividades/rompecabezas.utils.test.ts frontend/src/componentes/actividades/Rompecabezas.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run frontend build**

Run:

```bash
bun run --cwd frontend build
```

Expected: PASS. If TypeScript reports `JSX` namespace issues, change the component return type only if one was added manually; otherwise keep inferred return type.

- [ ] **Step 3: Run Storybook build**

Run:

```bash
bun run --cwd frontend build-storybook
```

Expected: PASS.

- [ ] **Step 4: Inspect changed files**

Run:

```bash
git diff -- frontend/src/componentes/actividades/Rompecabezas.tsx frontend/src/componentes/actividades/Rompecabezas.stories.tsx frontend/src/componentes/actividades/Rompecabezas.test.tsx frontend/src/componentes/actividades/rompecabezas.utils.ts frontend/src/componentes/actividades/rompecabezas.utils.test.ts docs/superpowers/specs/2026-07-09-rompecabezas-design.md docs/superpowers/plans/2026-07-09-rompecabezas.md
```

Expected: diff contains only puzzle component, tests, stories, spec and plan.

- [ ] **Step 5: Commit**

Skip commit unless the user explicitly requests it. If committing is requested later, use:

```bash
git add docs/superpowers/specs/2026-07-09-rompecabezas-design.md docs/superpowers/plans/2026-07-09-rompecabezas.md frontend/src/componentes/actividades/Rompecabezas.tsx frontend/src/componentes/actividades/Rompecabezas.stories.tsx frontend/src/componentes/actividades/Rompecabezas.test.tsx frontend/src/componentes/actividades/rompecabezas.utils.ts frontend/src/componentes/actividades/rompecabezas.utils.test.ts
git commit -m "feat: add puzzle activity component"
```

---

## Self-Review

**Spec coverage:** Covered grid via `background-position`, touch swap, drag/drop swap, mobile-first UI, Storybook variants, assets from `src/assets`, no backend/offline/XP integration, `onComplete` callback and verification commands.

**Placeholder scan:** No TBD/TODO/fill-in placeholders. Steps include exact files, code and commands.

**Type consistency:** `RompecabezasProps`, `PiezaRompecabezas` and utility function names are consistent across tasks.
