# Refactor Frontend — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactorizar el frontend completo en 4 fases: tipar y descomponer actividades, subdividir admin, descomponer clubes, y unificar shared-ui.

**Architecture:** Refactor incremental por módulo. Cada fase es independiente y termina con tests al 80%+ coverage. La arquitectura base no cambia — solo se limpian los módulos con deuda técnica.

**Tech Stack:** React 19, TypeScript estricto, TanStack Router, TanStack Query, Dexie, Tailwind CSS v4, React Hook Form, Zod, shadcn/ui, Bun test

---

## Global Constraints

| Restricción | Valor exacto |
|-------------|-------------|
| LOC max por `.tsx` | 300 líneas |
| Prohibido | `actividad: any` |
| Coverage mínimo por módulo | 80% |
| Bun como package manager | Solo `bun install`, `bun run`, `bun test` |
| Path alias base | `@/` → `./src/` |
| shadcn/ui base color | `neutral` |

---

## Estructura de Archivos del Plan

```
docs/superpowers/plans/
├── 2026-07-13-refactor-frontend-plan.md   ← ESTE ARCHIVO
└── tareas/
    ├── fase-1-actividades.md              ← Tasks detalladas de Fase 1
    ├── fase-2-admin.md                    ← Tasks detalladas de Fase 2
    ├── fase-3-clubes.md                   ← Tasks detalladas de Fase 3
    └── fase-4-shared-ui.md                ← Tasks detalladas de Fase 4
```

---

## Fase 1: `actividades/` — Tipado + Descomposición

### Archivos afectados (~47 en `componentes/actividades/`)

### Tarea 1.1: Crear schema Zod compartido

**Files:**
- Create: `frontend/src/shared/schemas/actividad.schema.ts`

**Goal:** Crear el schema Zod que reemplaza todos los `any`

```typescript
// frontend/src/shared/schemas/actividad.schema.ts
import { z } from 'zod';

export const OpcionSchema = z.object({
  id: z.string(),
  texto: z.string(),
  esCorrecta: z.boolean(),
});

export const ActividadBaseSchema = z.object({
  id: z.string(),
  tipo: z.enum([
    'quiz',
    'flashcard',
    'completar-versiculo',
    'relacionar-conceptos',
    'rompecabezas',
    'arrastrar-soltar',
    'verdadero-falso',
    'audio',
    'cancion',
  ]),
  enunciado: z.string(),
  opciones: z.array(OpcionSchema).optional(),
  imagen: z.string().optional(),
  audio: z.string().optional(),
  letra: z.string().optional(),
  instrucciones: z.string().optional(),
  dificultad: z.enum(['facil', 'medio', 'dificil']).optional(),
  tiempoEstimado: z.number().optional(),
});

export type Actividad = z.infer<typeof ActividadBaseSchema>;
export type Opcion = z.infer<typeof OpcionSchema>;
export type TipoActividad = Actividad['tipo'];

// Schemas por tipo
export const QuizActividadSchema = ActividadBaseSchema.extend({
  tipo: z.literal('quiz'),
});
export const FlashcardActividadSchema = ActividadBaseSchema.extend({
  tipo: z.literal('flashcard'),
});
export const CompletarVersiculoSchema = ActividadBaseSchema.extend({
  tipo: z.literal('completar-versiculo'),
  versoCompletar: z.string(),
  opciones: z.array(OpcionSchema),
});
export const RelacionarConceptosSchema = ActividadBaseSchema.extend({
  tipo: z.literal('relacionar-conceptos'),
  pares: z.array(z.object({ concepto: z.string(), definicion: z.string() })),
});
export const AudioActividadSchema = ActividadBaseSchema.extend({
  tipo: z.literal('audio'),
  audio: z.string(),
  letra: z.string().optional(),
  quizOpciones: z.array(OpcionSchema).optional(),
});
export const CancionActividadSchema = ActividadBaseSchema.extend({
  tipo: z.literal('cancion'),
  audio: z.string(),
  letra: z.string(),
});
```

### Tarea 1.2: Crear parser LRC compartido

**Files:**
- Create: `frontend/src/lib/lrc-parser.ts`

**Goal:** Extraer `parseLrc()` de `ActividadAudio.tsx`

```typescript
// frontend/src/lib/lrc-parser.ts
export interface LineaLRC {
  tiempo: number; // en milisegundos
  texto: string;
}

export function parseLrc(letra: string): LineaLRC[] {
  const lineas = letra.split('\n');
  const resultado: LineaLRC[] = [];
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

  for (const linea of lineas) {
    const match = linea.match(regex);
    if (match) {
      const minutos = parseInt(match[1], 10);
      const segundos = parseInt(match[2], 10);
      const centesimas = match[3].padEnd(3, '0');
      const milisegundos = minutos * 60000 + segundos * 1000 + parseInt(centesimas, 10);
      resultado.push({ tiempo: milisegundos, texto: match[4].trim() });
    }
  }

  return resultado.sort((a, b) => a.tiempo - b.tiempo);
}
```

### Tarea 1.3: Descomponer ActividadAudio.tsx

**Files:**
- Modify: `frontend/src/componentes/actividades/ActividadAudio.tsx` → partir en 3
- Create: `frontend/src/componentes/actividades/ReproductorAudio.tsx`
- Create: `frontend/src/componentes/actividades/LetraSincronizada.tsx`

**Goal:** Descomponer los 311 LOC en 3 archivos ≤ 300 LOC

```typescript
// frontend/src/componentes/actividades/ReproductorAudio.tsx
// Responsabilidad: reproductor con controles de audio
// Props: { src: string; onEnded?: () => void }
// Estados: isPlaying, progress, currentTime
// Importa: AudioActividadSchema de shared/schemas/actividad.schema.ts
```

```typescript
// frontend/src/componentes/actividades/LetraSincronizada.tsx
// Responsabilidad: renderizar lyrics sincronizados con parseLrc de lib/lrc-parser.ts
// Props: { letra: string; currentTime: number }
// Importa: parseLrc de lib/lrc-parser.ts
```

```typescript
// frontend/src/componentes/actividades/ActividadAudio.tsx (reducido a ~80 LOC)
// Composición de ReproductorAudio + LetraSincronizada
// Props tipadas con AudioActividadSchema
```

### Tarea 1.4: Tipar todos los componentes de actividad

**Files:**
- Modify: ~47 archivos en `componentes/actividades/`
- Create: `frontend/src/componentes/actividades/fixtures/actividades.fixture.ts`

**Goal:** Reemplazar `actividad: any` con tipos del schema

Por cada tipo de actividad:
1. Importar el schema correspondiente de `shared/schemas/actividad.schema.ts`
2. Crear fixture con datos de prueba tipados
3. Verificar que no haya `any`残余

### Tarea 1.5: Reorganizar hooks de actividades

**Files:**
- Create: `frontend/src/componentes/actividades/hooks/use-quiz.ts`
- Create: `frontend/src/componentes/actividades/hooks/use-flashcards.ts`
- Create: `frontend/src/componentes/actividades/hooks/use-rompecabezas.ts`
- Create: `frontend/src/componentes/actividades/hooks/use-relacionar-conceptos.ts`
- Create: `frontend/src/componentes/actividades/hooks/index.ts` (barrel export)

**Goal:** Los hooks viven en `componentes/actividades/hooks/`, no sueltos

### Tarea 1.6: Tests de cobertura

**Files:**
- Create: `frontend/src/componentes/actividades/ReproductorAudio.test.tsx`
- Create: `frontend/src/componentes/actividades/LetraSincronizada.test.tsx`
- Create: `frontend/src/componentes/actividades/hooks/use-quiz.test.ts`
- Create: `frontend/src/componentes/actividades/lib/lrc-parser.test.ts`
- Create: `frontend/src/componentes/actividades/activities.test.ts` (cobertura general)

**Coverage target:** ≥ 80% en `componentes/actividades/`

---

## Fase 2: `admin/` — Subdivisión + Limpieza

### Archivos afectados (`features/admin/componentes/` — 114 archivos)

### Tarea 2.1: Subdividir componentes/admin

**Files:**
- Modify: `features/admin/componentes/` → reorganizar en subcarpetas

```
componentes/
├── dashboard/           → PanelAdministracion, stats-grid, weekly-chart, tabla-temas-recientes
├── temas/              → paso-crecer, paso-actividades, editor-markdown, theme-cover
├── usuarios/           → gestión de usuarios
├── medios/            → galería de medios
├── clubes-admin/       → admin-clubes-panel, admin-clubes-panel-vista
└── shared-admin/       → components compartidos entre secciones admin
```

### Tarea 2.2: Descomponer admin-clubes-panel.tsx

**Files:**
- Create: `features/admin/componentes/clubes-admin/TarjetaClub.tsx`
- Create: `features/admin/componentes/clubes-admin/BotonEstadoClub.tsx`
- Create: `features/admin/componentes/clubes-admin/DetalleClub.tsx`
- Create: `features/admin/componentes/clubes-admin/FormularioCrearReto.tsx`
- Create: `features/admin/componentes/clubes-admin/DialogoConfirmacion.tsx`
- Modify: `features/admin/componentes/admin-clubes-panel.tsx` → reduce a ~150 LOC

### Tarea 2.3: Descomponer admin.temas.$themeId.activities.tsx

**Files:**
- Create: `features/admin/types.ts` → `ActivityDraft`, `OptionDraft`
- Create: `features/admin/hooks/use-theme-activities.ts` → lógica de `saveMutation`
- Modify: `routes/admin.temas.$themeId.activities.tsx` → usa types y hook

### Tarea 2.4: Migrar admin.sendas.$sendaId.edit.tsx a React Hook Form

**Files:**
- Create: `shared/schemas/senda.schema.ts` → Zod schema para validación
- Create: `features/admin/hooks/use-senda-edit.ts`
- Modify: `routes/admin.sendas.$sendaId.edit.tsx` → React Hook Form + Zod

### Tarea 2.5: Eliminar components/admin/ paralelo

**Files:**
- Delete: `components/admin/` (directorio completo)
- Modify: `routes/admin.index.tsx` → importar desde `features/admin/componentes/dashboard/`

### Tarea 2.6: Tests de cobertura admin

**Files:**
- Coverage: ≥ 80% en `features/admin/componentes/`

---

## Fase 3: `clubes/` — Descomposición + Cache Moderno

### Archivos afectados (`features/clubes/componentes/clubes-page.tsx` — 645 LOC)

### Tarea 3.1: Descomponer clubes-page.tsx

**Files:**
- Create: `features/clubes/componentes/ClubSwitcher.tsx`
- Create: `features/clubes/componentes/ClubHero.tsx`
- Create: `features/clubes/componentes/ResumenClub.tsx`
- Create: `features/clubes/componentes/RankingClub.tsx`
- Create: `features/clubes/componentes/RankingRow.tsx`
- Create: `features/clubes/componentes/RetosClub.tsx`
- Create: `features/clubes/componentes/ChallengeCard.tsx`
- Create: `features/clubes/componentes/MiembrosClub.tsx`
- Create: `features/clubes/componentes/AjustesClub.tsx`
- Create: `features/clubes/componentes/ClubInviteAside.tsx`
- Create: `features/clubes/componentes/CrearClubModal.tsx`
- Create: `features/clubes/componentes/CrearRetoModal.tsx`
- Create: `features/clubes/componentes/Modal.tsx`
- Create: `features/clubes/componentes/EmptyInline.tsx`
- Create: `features/clubes/componentes/ClubesSkeleton.tsx`
- Delete: `features/clubes/componentes/clubes-page.tsx`

### Tarea 3.2: Crear utilidades y constantes de clubes

**Files:**
- Create: `features/clubes/utils.ts` → `formatMonth`, `daysRemaining`, `metricDescription`, `roleName`, `toDateInput`
- Create: `features/clubes/constants.ts` → `"es-EC"`, `"miembro"`, `"lider"`, `"propietario"`, métricas

### Tarea 3.3: Centralizar cache en Dexie

**Files:**
- Modify: `lib/offline/db.ts` → agregar tabla `clubsCache`
- Modify: `features/clubes/clubes.api.ts` → reemplazar cache localStorage por Dexie

### Tarea 3.4: Reemplazar window.confirm por ConfirmDialog

**Files:**
- Modify: todos los archivos en `features/clubes/componentes/` que usen `window.confirm()`

### Tarea 3.5: Tests de cobertura clubes

**Files:**
- Coverage: ≥ 80% en `features/clubes/componentes/`

---

## Fase 4: `shared-ui/` — Unificación

### Tarea 4.1: Unificar utilidades CSS

**Files:**
- Delete: `lib/utils.ts` (cn)
- Modify: `componentes/ui/card-shadcn.tsx`, `componentes/ui/button.tsx`, `campana-badge.tsx` → usar `unirClases`

### Tarea 4.2: Consolidar sistema de botones

**Files:**
- Modify: `componentes/ui/boton.tsx` → añadir variantes faltantes de `button.tsx`
- Modify: archivos que importan de `button.tsx` → migrar a `boton.tsx`
- Delete: `componentes/ui/button.tsx` (shadcn, deprecado)

### Tarea 4.3: Consolidar sistema de cards

**Files:**
- Modify: `componentes/ui/card-base.tsx` → añadir variantes de `card-shadcn.tsx`
- Modify: archivos que importan de `card-shadcn.tsx` → migrar a `card-base.tsx`
- Delete: `componentes/ui/card-shadcn.tsx` (shadcn, deprecado)

### Tarea 4.4: Consolidar hooks de PWA

**Files:**
- Delete: `shared/hooks/use-instalar-pwa.ts` (original)
- Move: `features/instalacion/hooks/use-instalar-pwa.ts` → `shared/hooks/use-instalar-pwa.ts`
- Modify: todos los imports de ambos hooks → solo `shared/hooks/use-instalar-pwa.ts`

### Tarea 4.5: Limpiar código muerto

**Files:**
- Delete: `shared/ui/boton-retroceso.tsx` (no se importa)
- Evaluate: `paginas/` → mover a `storybook/` si son showroom, o eliminar

---

## Reglas de Mantenimiento Post-Refactor

### Enforcement rules a configurar en Biome/ESLint

```json
// biome.json — agregar en rules
{
  "linter": {
    "rules": {
      "a11y": {},
      "complexity": {
        "noForEach": "off"
      },
      "style": {},
      "suspicious": {},
      "nursery": {
        "noExcessiveCognitiveComplexity": "warn",
        "noUnusedVariables": "warn"
      }
    }
  }
}
```

### ESLint: no-any

```typescript
// frontend/.eslintrc.cjs
rules: {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-non-null-assertion': 'warn',
}
```

### Coverage CI gate

```yaml
# .github/workflows/test.yml
- run: bun test --coverage
  env:
    CI: true
- run: bunx coverage-badge --threshold 80
```

---

## Orden de Implementación Sugerido

```
1. Fase 1 completa → actividades/ tipado y descomprimido, 80%+ coverage
   ↓
2. Fase 2 completa → admin/ subdividido, 80%+ coverage
   ↓
3. Fase 3 completa → clubes/ descomprimido, Dexie cache, 80%+ coverage
   ↓
4. Fase 4 completa → shared-ui unificado, código muerto eliminado
```

---

## Comandos de Verificación

```bash
# Verificar LOC antes de commit
bun run check-loc # (script a crear: wc -l por archivo, falla si > 300)

# Verificar no any en actividades
grep -r "actividad: any\|: any)" frontend/src/componentes/actividades/ --include="*.ts" --include="*.tsx"

# Coverage
bun test --coverage --reporter=verbose

# Typecheck
bun run typecheck

# Lint
bun run lint
```

---

## Self-Review Checklist

- [ ] Todos los archivos > 300 LOC tienen task de descomposición
- [ ] Ningún `any` en actividades después de Fase 1
- [ ] Coverage ≥ 80% antes de cerrar cada fase
- [ ] Imports actualizados después de cada refactor
- [ ] `components/admin/` eliminado después de Fase 2
- [ ] `lib/utils.ts` eliminado después de Fase 4
- [ ] Código muerto eliminado después de Fase 4
