# Consolidación de UI Compartida Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar reimplementaciones visuales y llevar las cards, botones, pills y paneles a primitivas compartidas consistentes.

**Architecture:** Primero normalizamos los componentes visuales de mayor impacto para que todas las features consuman las mismas bases (`Card`, botones, badges/pills y paneles). Después extraemos subcomponentes reutilizables de las vistas más grandes para reducir estilos divergentes y acoplamiento con el JSX. La meta es que cualquier nueva superficie visual se componga desde el sistema compartido en lugar de inventar su propio look.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, TanStack Router, TanStack Query, react-hook-form, Zod, Bun.

## Global Constraints

- Usar Bun como package manager y runtime de scripts.
- Usar React.
- Usar TypeScript.
- Usar Vite.
- Usar Tailwind CSS.
- Usar TanStack Router.
- Usar TanStack Query para estado servidor.
- Usar React Hook Form.
- Usar Zod.
- Usar shadcn/ui como base visual cuando aplique.
- No usar npm, pnpm ni yarn.
- Mantener una sola PWA responsive con estilos consistentes.
- Preferir componentes pequeños y compartidos antes que estilos locales duplicados.

---

### Task 1: Normalizar cards visibles de alto tráfico

**Files:**
- Modify: `frontend/src/features/clubes/componentes/tarjeta-club.tsx`
- Modify: `frontend/src/features/home/componentes/senda-card.tsx`
- Modify: `frontend/src/features/gamification/componentes/tarjetas-estadisticas.tsx`
- Modify: `frontend/src/features/admin/componentes/admin-media-detail-panel.tsx`
- Modify: `frontend/src/features/admin/componentes/tab-general.tsx`

**Interfaces:**
- Consumes: `frontend/src/componentes/ui/card-base.tsx`, `frontend/src/componentes/ui/empty-state.tsx`
- Produces: tarjetas y paneles que comparten la misma base visual (`Card`) y patrones de padding/sombra/borde

- [ ] **Step 1: Revisar cada superficie y marcar qué parte debe dejar de usar estilos propios**
- [ ] **Step 2: Migrar `tarjeta-club.tsx` y `senda-card.tsx` a `Card` con variantes compartidas**
- [ ] **Step 3: Extraer un subcomponente reutilizable para cada bloque de estadística en `tarjetas-estadisticas.tsx`**
- [ ] **Step 4: Reusar `Card` en `admin-media-detail-panel.tsx` y separar el estado vacío en un bloque compartido**
- [ ] **Step 5: Partir `tab-general.tsx` en tarjetas/sectores internos para evitar un formulario monolítico con estilos repetidos**
- [ ] **Step 6: Verificar `bun run typecheck` y `bun run build`**

### Task 2: Extraer primitives compartidas para botones y pills

**Files:**
- Create: `frontend/src/componentes/ui/icon-button.tsx`
- Create: `frontend/src/componentes/ui/pill.tsx`
- Modify: `frontend/src/componentes/ui/card-base.tsx`
- Modify: `frontend/src/features/admin/componentes/admin.helpers.tsx`
- Modify: `frontend/src/features/admin/componentes/admin-media-detail-panel.tsx`
- Modify: `frontend/src/features/admin/componentes/admin-themes-filters.tsx`
- Modify: `frontend/src/features/admin/componentes/admin-users-filters.tsx`

**Interfaces:**
- Consumes: patterns actuales de icon buttons y etiquetas pequeñas
- Produces: `IconButton`, `Pill` y/o `Badge` reutilizables para reemplazar botones redondos, chips y etiquetas de estado

- [ ] **Step 1: Identificar todos los botones pequeños con icono y comportamiento idéntico**
- [ ] **Step 2: Crear `IconButton` con variantes de tamaño, tono y estado activo**
- [ ] **Step 3: Crear `Pill` para chips de estado/etiquetas con variantes de color**
- [ ] **Step 4: Reemplazar usos locales en paneles y filtros de admin**
- [ ] **Step 5: Eliminar estilos inline o clases únicas que dupliquen lo mismo**
- [ ] **Step 6: Verificar `bun run typecheck` y `bun run build`**

### Task 3: Dividir el formulario grande de temas en secciones compuestas

**Files:**
- Modify: `frontend/src/features/admin/componentes/paso-informacion-general.tsx`
- Create: `frontend/src/features/admin/componentes/paso-informacion/tema-info-card.tsx`
- Create: `frontend/src/features/admin/componentes/paso-informacion/tema-preview-card.tsx`
- Create: `frontend/src/features/admin/componentes/paso-informacion/tema-clubs-card.tsx`

**Interfaces:**
- Consumes: `UseFormRegister<CrearTemaSolicitud>`, `sendas`, `gruposEdad`, `bibleVersions`
- Produces: bloques independientes para información básica, vista previa y opciones relacionadas a clubes

- [ ] **Step 1: Separar el JSX por secciones funcionales**
- [ ] **Step 2: Extraer la tarjeta de vista previa a un componente dedicado**
- [ ] **Step 3: Extraer la sección de información general a una tarjeta propia**
- [ ] **Step 4: Mantener el API de `PasoInformacionGeneral` estable para no romper rutas existentes**
- [ ] **Step 5: Verificar `bun run typecheck` y `bun run build`**

### Task 4: Consolidar paneles laterales y vacíos de admin

**Files:**
- Modify: `frontend/src/features/admin/componentes/admin-media-detail-panel.tsx`
- Modify: `frontend/src/features/admin/componentes/recent-activity-sidebar.tsx`
- Modify: `frontend/src/features/admin/componentes/recent-themes-table.tsx`
- Modify: `frontend/src/features/admin/componentes/admin-users-summary.tsx`
- Modify: `frontend/src/features/admin/componentes/admin-themes-summary.tsx`

**Interfaces:**
- Consumes: `Card`, `IconButton`, `Pill`, empty-state patterns
- Produces: sidebars y resúmenes con la misma jerarquía visual, borde, sombra y espaciado

- [ ] **Step 1: Unificar padding, borde y tipografía de todos los paneles laterales**
- [ ] **Step 2: Reusar bloques comunes para encabezados, métricas y vacíos**
- [ ] **Step 3: Extraer un layout común para summary cards de admin**
- [ ] **Step 4: Verificar `bun run typecheck` y `bun run build`**

### Task 5: Limpieza final y verificación visual

**Files:**
- Modify: componentes tocados en tasks anteriores
- Test: `frontend/src/**/*.stories.tsx` cuando aplique

**Interfaces:**
- Consumes: todos los nuevos primitives compartidos
- Produces: una superficie visual más uniforme y con menos duplicación

- [ ] **Step 1: Buscar superficies restantes con estilos únicos de card/button/pill/sidebar**
- [ ] **Step 2: Reemplazar solo las variantes que no aporten una diferencia funcional real**
- [ ] **Step 3: Ejecutar typecheck y build una última vez**
- [ ] **Step 4: Revisar la lista de archivos tocados para detectar regresiones de estilo**
