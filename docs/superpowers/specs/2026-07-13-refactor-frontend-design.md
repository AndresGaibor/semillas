# Refactor Frontend — Spec

**Fecha:** 2026-07-13
**Tipo:** Refactor arquitectónico
**Alcance:** Frontend completo (`frontend/src/`)
**Stack:** React 19, TypeScript estricto, TanStack Router, TanStack Query, Dexie, Tailwind CSS v4, React Hook Form, Zod, shadcn/ui

---

## 1. Contexto y Motivación

El frontend de Semillas tiene ~500+ archivos. La arquitectura base (feature-based, offline-first, TanStack Query) es sólida, pero existe deuda técnica acumulada:

- **4 componentes monumentales** (>400 LOC) que mezclan lógica de negocio con presentación
- **Código duplicado** en 5 lugares: dualidad de sistemas UI (`boton` vs `button`), duplicación de hooks de PWA, `lib/utils.ts` vs `lib/utilidades.ts`, `components/admin/` vs `features/admin/componentes/`
- **Deuda de tipado**: `actividad: any` en ~12 archivos del módulo de actividades
- **Cobertura de tests al ~10%** vs el 80% requerido por AGENTS.md
- **Componentes comprimidos en 1 línea** (JSX inline en `admin-clubes-panel.tsx`, `admin.temas.$themeId.activities.tsx`) — ilegibles
- **Lógica de dominio en route files** (`admin.temas.$themeId.activities.tsx`, `admin.sendas.$sendaId.edit.tsx`)

El refactor no cambia la arquitectura. La mejora de forma incremental, módulo por módulo.

---

## 2. Objetivos

1. **Descomponer** los componentes que superan 300 LOC en unidades pequeñas y testeables
2. **Tipar** todo el módulo de actividades con Zod schemas, eliminando `any`
3. **Unificar** los sistemas duplicados de UI, utilidades y hooks
4. **Limpiar** código muerto y archivos no importados
5. **Tests** — llevar la cobertura al 80%+ en los módulos refactorizados

---

## 3. Reglas Fijas (No Negociables)

| Regla | Descripción |
|-------|-------------|
| **300 LOC max** por archivo `.tsx` | Se parte el archivo si crece de 300 líneas |
| **no-any** | `actividad: any` queda prohibido en todo el proyecto |
| **80%+ coverage** | Tests obligatorios para cada módulo refactorizado |
| **Barrel exports** | Cada feature tiene `index.ts` en `componentes/` |
| **Feature hooks en `hooks/`** | Todo hook de una feature vive en `feature/hooks/` |

---

## 4. Sistema de Tipos para Actividades

Se crea un schema Zod compartido que reemplaza todos los `any` del módulo actividades.

```typescript
// shared/schemas/actividad.schema.ts

const OpcionSchema = z.object({
  id: z.string(),
  texto: z.string(),
  esCorrecta: z.boolean(),
});

const ActividadBaseSchema = z.object({
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
});

type Actividad = z.infer<typeof ActividadBaseSchema>;
type TipoActividad = Actividad['tipo'];
```

Los schemas derivados se crean por tipo:
```typescript
const QuizActividadSchema = ActividadBaseSchema.extend({ tipo: z.literal('quiz') });
const FlashcardActividadSchema = ActividadBaseSchema.extend({ tipo: z.literal('flashcard') });
```

---

## 5. Arquitectura de Módulos

```
frontend/src/
├── components/         ← UNICO directorio de componentes base (shadcn + custom unificados)
│   └── ui/             ← Componentes primitivos (Boton, Card, Input, Badge...)
├── features/           ← 19 módulos de negocio (NO se reorganiza la estructura)
│   ├── actividades/
│   │   ├── componentes/
│   │   │   ├── Quiz.tsx
│   │   │   ├── Flashcards.tsx
│   │   │   ├── ActividadAudio.tsx        ← DESCOMPUESTO (ver Fase 1)
│   │   │   │   ├── ReproductorAudio.tsx
│   │   │   │   └── LetraSincronizada.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── use-quiz.ts
│   │   │   ├── use-flashcards.ts         ← movido aquí
│   │   │   └── use-rompecabezas.ts       ← movido aquí
│   │   └── fixtures/
│   │       └── actividades.fixture.ts    ← datos de prueba tipados
│   ├── admin/
│   │   └── componentes/
│   │       ├── dashboard/                 ← NUEVO (subdivisión)
│   │       ├── temas/
│   │       ├── usuarios/
│   │       ├── medios/
│   │       └── clubes-admin/
│   ├── clubes/
│   │   └── componentes/
│   │       ├── ClubSwitcher.tsx
│   │       ├── ClubHero.tsx
│   │       ├── ResumenClub.tsx
│   │       ├── RankingClub.tsx
│   │       ├── RetosClub.tsx
│   │       ├── MiembrosClub.tsx
│   │       ├── AjustesClub.tsx
│   │       ├── CrearClubModal.tsx
│   │       ├── CrearRetoModal.tsx
│   │       └── EmptyInline.tsx
│   └── ...
├── lib/
│   ├── utilidades.ts    ← ÚNICA utilidad CSS (unirClases)
│   └── utils.ts         ← ELIMINADO (cn → usar unirClases)
└── shared/
    ├── hooks/
    │   └── use-instalar-pwa.ts    ← ÚNICO (consolidado)
    └── ui/
        └── boton-retroceso.tsx    ← ELIMINADO (código muerto)
```

### Lo que NO cambia:
- La estructura de `routes/` (file-based routing con TanStack Router)
- El motor offline en `lib/offline/` (ya está bien diseñado)
- El cliente API en `shared/api/`
- Los schemas Zod en `shared/api/schemas/`

---

## 6. Fases de Implementación

### Fase 1: `actividades/` — Tipado + Descomposición

**Archivos afectados:** ~47 componentes en `componentes/actividades/`

**Pasos:**

1. Crear `shared/schemas/actividad.schema.ts` con todos los tipos de actividad
2. Tipar cada componente de actividad — de `actividad: any` a `actividad: Actividad`
3. Descomponer `ActividadAudio.tsx` (311 LOC):
   - `ReproductorAudio.tsx` — reproductor con controles, manejo de `Audio`
   - `LetraSincronizada.tsx` — parseo LRC (`parseLrc()` extraído a `lib/lrc-parser.ts`)
   - `ActividadAudio.tsx` — composición de ambos
4. Reorganizar hooks: `use-flashcards.ts` y `use-rompecabezas.ts` van a `componentes/actividades/hooks/`
5. Crear `componentes/actividades/fixtures/actividades.fixture.ts` con datos de prueba tipados
6. Escribir tests — mínimo 1 por tipo de actividad, 80%+ coverage

**Criterio de done:** Ningún archivo en `componentes/actividades/` tiene `any`. Coverage ≥ 80%.

---

### Fase 2: `admin/` — Subdivisión + Limpieza

**Archivos afectados:** `features/admin/componentes/` (114 archivos), `routes/admin.*.tsx`

**Pasos:**

1. Subdividir `features/admin/componentes/` en subcarpetas:
   ```
   componentes/
   ├── dashboard/     → PanelAdministracion, stats-grid, charts, tablas
   ├── temas/         → editor de temas, paso-crecer, paso-actividades
   ├── usuarios/      → gestión de usuarios
   ├── medios/        → galería de medios
   └── clubes-admin/  → panel de clubes admin
   ```
2. Descomponer `admin-clubes-panel.tsx` (257 LOC):
   - 7 componentes internos comprimidos en 1 línea pasan a archivos propios
   - `AdminClubesPanelVista` se mantiene como presentational component
3. Descomponer `admin.temas.$themeId.activities.tsx` (283 LOC):
   - `ActivityDraft` y `OptionDraft` se mueven a `features/admin/types.ts`
   - Lógica de `saveMutation` se extrae a `features/admin/hooks/use-theme-activities.ts`
4. Descomponer `admin.sendas.$sendaId.edit.tsx` (285 LOC):
   - Reemplazar `useState` por campo + validación manual → React Hook Form + Zod schema
5. Eliminar `components/admin/` — actualizar imports en `routes/admin.index.tsx`
6. Escribir tests con coverage 80%+

**Criterio de done:** `features/admin/componentes/` subdividido en subcarpetas. Ningún archivo > 300 LOC. Coverage ≥ 80%.

---

### Fase 3: `clubes/` — Descomposición + Cache Moderno

**Archivos afectados:** `features/clubes/componentes/clubes-page.tsx` (645 LOC), `features/clubes/clubes.api.ts`

**Pasos:**

1. Descomponer `clubes-page.tsx` en archivos propios por componente
2. Extraer utilidades a `clubes/utils.ts`: `formatMonth`, `daysRemaining`, `metricDescription`, `roleName`, `toDateInput`
3. Centralizar cache en Dexie — crear tabla `clubsCache` siguiendo el patrón de `themes.api.ts`
4. Reemplazar todos los `window.confirm()` por `ConfirmDialog` compartido
5. Hardcoded strings (`"es-EC"`, `"miembro"`, `"lider"`, `"propietario"`, métricas) → constantes en `clubes/constants.ts`
6. Escribir tests — mínimo 1 por componente nuevo

**Criterio de done:** `clubes-page.tsx` no existe más. Sus componentes viven en archivos propios. Cache en Dexie. Coverage ≥ 80%.

---

### Fase 4: `shared-ui/` — Unificación

**Archivos afectados:** `lib/`, `shared/hooks/`, `shared/ui/`, `components/`

**Pasos:**

1. **Utilidades CSS:**
   - `lib/utils.ts` se elimina — los 3 archivos que importan `cn` se actualizan a `unirClases`
   - `lib/utilidades.ts` permanece como única implementación

2. **Sistema de botones:**
   - `componentes/ui/button.tsx` (shadcn) se deprecia — sus ~3 imports migran a `componentes/ui/boton.tsx`
   - Si `boton.tsx` no tiene alguna variante que `button.tsx` tiene, se añade primero

3. **Sistema de cards:**
   - `componentes/ui/card-shadcn.tsx` se deprecia — migrar a `componentes/ui/card-base.tsx`
   - Consolidar en una sola implementación de Card

4. **Hooks de PWA:**
   - `features/instalacion/hooks/use-instalar-pwa.ts` se mueve a `shared/hooks/use-instalar-pwa.ts`
   - `shared/hooks/use-instalar-pwa.ts` original se elimina

5. **Código muerto:**
   - `shared/ui/boton-retroceso.tsx` → eliminar
   - `paginas/` → evaluar: si son showroom para storybook, mover a `storybook/`. Si no se importan desde ningún lado, eliminar.

**Criterio de done:** Un solo sistema de UI base. Un solo hook de PWA. Código muerto eliminado.

---

## 7. Reglas Post-Refactor

| Regla | enforcement |
|-------|-------------|
| 300 LOC max por `.tsx` | Biome lint rule (`no.max-lines`) |
| `no-any` para actividades | ESLint rule + Zod schema validation |
| 80%+ coverage por módulo | CI gate en `bun run test --coverage` |
| Hooks en `feature/hooks/` | ESLint rule (`no-restricted-paths`) |
| Barrel `index.ts` por feature | Convención documentada |

---

## 8. Timeline Sugerido

| Fase | Duración estimada | Entregable |
|------|-----------------|------------|
| Fase 1: actividades/ | 2-3 sprints | Módulo actividades 100% tipado, 80%+ coverage |
| Fase 2: admin/ | 3-4 sprints | Admin subdividido, ningún archivo > 300 LOC |
| Fase 3: clubes/ | 1-2 sprints | Clubes-page descompuesto, cache en Dexie |
| Fase 4: shared-ui/ | 1 sprint | Unificación, limpieza, código muerto eliminado |

**Total estimado:** 7-10 sprints (14-20 semanas en un equipo de 1-2 personas)

---

## 9. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Romper funcionalidad existente durante el refactor | Alta | Tests primero (TDD en cada fase), CI con coverage gate |
| Componentes muy acoplados dificultan extracción | Media | Empezar por los más simples (pagina-botones.tsx) para probar el proceso |
| Duplicación de lógica durante la transición | Media | Definir claramente qué va a hook, qué a utils, qué a componente antes de partir |
| Cobertura de tests toma más tiempo del esperado | Alta | Priorizar coverage en módulos críticos (actividades, admin); herramientas de cobertura automáticas |
| Resistenciadel equipo al cambio | Baja | Comunicar el plan, mostrar resultados por fase |

---

## 10. Scope del Refactor

### Incluido ✅
- Módulo `actividades/` completo
- Módulo `admin/` completo
- Módulo `clubes/` completo
- Consolidación `shared-ui/`
- Eliminación de código duplicado
- Cobertura de tests al 80%+ en módulos refactorizados

### Excluido ❌
- Arquitectura de routing (se mantiene TanStack Router como está)
- Motor offline de `lib/offline/` (ya está bien diseñado)
- Cliente API de `shared/api/`
- Storybook (se mantiene pero no se refactoriza)
- Landing page (`routes/index.tsx`, `features/landing/`)
- Onboarding (`features/onboarding/`)
