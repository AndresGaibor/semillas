# ThemeCard Reusable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear una card reutilizable para temas, documentada en Storybook, con un wrapper fino para mantener compatibilidad con `CardLeccion`.

**Architecture:** `ThemeCard` será el componente público reutilizable para el catálogo de temas. `CardLeccion` quedará como adaptador delgado para no romper consumidores existentes, mientras la pantalla `/app/temas` usará `ThemeCard` directamente para validar la reutilización real. Storybook documentará el componente nuevo y sus variantes visuales.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Storybook (`@storybook/react-vite`), Bun.

## Global Constraints

- Usar Bun como package manager y runtime de scripts.
- Usar TypeScript estricto.
- Evitar `any`.
- Responder y documentar en español.
- Mantener UI mobile-first y consistente con la paleta existente de Semillas.
- Verificar con `bun run --cwd frontend typecheck`, `bun run --cwd frontend build` y `bun run --cwd frontend build-storybook`.

---

### Task 1: Crear `ThemeCard` como componente público reutilizable

**Files:**
- Create: `frontend/src/componentes/ui/theme-card.tsx`
- Modify: `frontend/src/componentes/ui/card-base.tsx` solo si hace falta ajustar composición visual compartida

**Interfaces:**
- Consumes: `Card` de `frontend/src/componentes/ui/card-base.tsx`, `obtenerClasesSenda` de `frontend/src/features/themes/utils.ts`
- Produces: `ThemeCard`, `ThemeCardProps`, `ThemeCardVariant`, `ThemeCardState`

- [ ] **Step 1: Definir la API pública del componente**

```ts
export type ThemeCardVariant = "default" | "compact";

export type ThemeCardState =
  | "porDefecto"
  | "enProgreso"
  | "completada"
  | "descargada"
  | "bloqueada"
  | "error";

export interface ThemeCardProps {
  titulo: string;
  descripcion: string;
  senda: string;
  imagenUrl?: string;
  duracion?: string;
  xp?: number;
  progreso?: number;
  favorito?: boolean;
  estado?: ThemeCardState;
  variante?: ThemeCardVariant;
  onAccion?: () => void;
  onFavorito?: () => void;
  clase?: string;
}
```

- [ ] **Step 2: Implementar el layout base de la card**

```tsx
export function ThemeCard({
  titulo,
  descripcion,
  senda,
  imagenUrl,
  duracion,
  xp,
  progreso = 0,
  favorito = false,
  estado = "porDefecto",
  variante = "default",
  onAccion,
  onFavorito,
  clase,
}: ThemeCardProps) {
  return <Card>{/* imagen, senda, título, descripción, metadata, progreso, CTA */}</Card>;
}
```

- [ ] **Step 3: Ajustar la jerarquía visual por variante**
- `default`: imagen alta, sender badge, título, descripción, chips de duración/XP, progreso y CTA.
- `compact`: reduce padding, limita altura de texto y prioriza CTA/progreso para listados densos.
- `estado` controla el CTA: `Empezar tema`, `Continuar`, `Completado`, `Bloqueado`, `Error`, `Disponible sin conexión`.

- [ ] **Step 4: Validar accesibilidad básica**
- El favorito sigue siendo `button` real.
- El card mantiene `onClick` en el contenedor solo si no está bloqueada o en error.
- El texto principal conserva contraste suficiente y no depende solo del color de senda.

**Expected verification:** No tests yet; compilation of this file must pass when consumed by Task 2 and Task 3.

### Task 2: Convertir `CardLeccion` en adaptador fino y migrar la pantalla de temas

**Files:**
- Modify: `frontend/src/componentes/ui/card-leccion.tsx`
- Modify: `frontend/src/routes/app.temas.index.tsx`

**Interfaces:**
- Consumes: `ThemeCard` y `ThemeCardProps` de `frontend/src/componentes/ui/theme-card.tsx`
- Produces: `CardLeccion` como wrapper de compatibilidad y uso directo de `ThemeCard` en `/app/temas`

- [ ] **Step 1: Reemplazar la implementación interna de `CardLeccion` por un wrapper**

```tsx
import { ThemeCard, type ThemeCardProps } from "./theme-card";

export type PropiedadesCardLeccion = ThemeCardProps;

export function CardLeccion(props: PropiedadesCardLeccion) {
  return <ThemeCard {...props} variante="default" />;
}
```

- [ ] **Step 2: Migrar la ruta `/app/temas` a `ThemeCard` directamente**

```tsx
import { ThemeCard } from "@/componentes/ui/theme-card";

// ...

<ThemeCard
  key={tema.id}
  senda={tema.senda}
  titulo={tema.titulo}
  descripcion={tema.descripcion}
  duracion={tema.duracion}
  xp={tema.xp}
  progreso={tema.progreso}
  favorito={tema.favorito}
  imagenUrl={tema.imagenUrl ?? undefined}
  estado={tema.estado}
  onFavorito={() => {
    const slug = temasApi?.find((t) => t.id === tema.id)?.slug ?? tema.id;
    toggleFavorito(slug);
  }}
  onAccion={() => navigate({ to: "/app/temas/$themeId", params: { themeId: tema.id } })}
/>
```

- [ ] **Step 3: Mantener el comportamiento actual**
- `toggleFavorito` sigue funcionando igual.
- `navigate` sigue abriendo el detalle del tema.
- `progreso`, `duracion` y `xp` siguen saliendo de la misma fuente de datos.

**Expected verification:** La pantalla debe renderizar igual o mejor, pero ahora consumiendo el componente reutilizable.

### Task 3: Documentar `ThemeCard` en Storybook y retirar la historia legada

**Files:**
- Create: `frontend/src/componentes/ui/theme-card.stories.tsx`
- Delete: `frontend/src/componentes/ui/card-leccion.stories.tsx`

**Interfaces:**
- Consumes: `ThemeCard` y `ThemeCardProps`
- Produces: documentación visual de variantes reutilizables para temas

- [ ] **Step 1: Crear historias centradas en estados y densidad**

```tsx
export const Playground: Story = {
  args: {
    variante: "default",
    estado: "porDefecto",
    senda: "Senda del Padre",
    titulo: "La Creación del Mundo",
    descripcion: "Descubre cómo Dios creó los cielos y la tierra en seis días increíbles y descansó el séptimo.",
    duracion: "10 min",
    xp: 100,
    progreso: 0,
    favorito: false,
  },
};

export const Compacta: Story = {
  args: {
    ...Playground.args,
    variante: "compact",
  },
};

export const EnProgreso: Story = {
  args: {
    ...Playground.args,
    estado: "enProgreso",
    progreso: 60,
  },
};

export const Bloqueada: Story = {
  args: {
    ...Playground.args,
    estado: "bloqueada",
  },
};
```

- [ ] **Step 2: Documentar `argTypes` útiles**
- `variante` como `select`.
- `estado` como `select`.
- `progreso` como `range`.
- `favorito` como `boolean`.
- `titulo`, `descripcion`, `senda`, `duracion` y `xp` como controles de texto/número.

- [ ] **Step 3: Eliminar la historia vieja para evitar duplicidad**
- Borrar `card-leccion.stories.tsx` para que Storybook tenga una única fuente de documentación pública para la card.

**Expected verification:** `ThemeCard` debe aparecer en Storybook con las variantes principales y sin duplicar documentación.

### Task 4: Verificación final

**Files:**
- No new files

**Interfaces:**
- Consumes: `ThemeCard`, `CardLeccion`, `ThemeCard.stories.tsx`
- Produces: build verificado y documentación compilable

- [ ] **Step 1: Ejecutar typecheck**

Run: `bun run --cwd frontend typecheck`

Expected: PASS

- [ ] **Step 2: Ejecutar build de aplicación**

Run: `bun run --cwd frontend build`

Expected: PASS

- [ ] **Step 3: Ejecutar build de Storybook**

Run: `bun run --cwd frontend build-storybook`

Expected: PASS

- [ ] **Step 4: Revisar diff final**

Run: `git diff -- frontend/src/componentes/ui/theme-card.tsx frontend/src/componentes/ui/card-leccion.tsx frontend/src/routes/app.temas.index.tsx frontend/src/componentes/ui/theme-card.stories.tsx frontend/src/componentes/ui/card-leccion.stories.tsx`

Expected: solo los archivos de la card y su documentación.
