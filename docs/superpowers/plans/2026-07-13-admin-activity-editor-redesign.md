# Admin Activity Editor Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unbounded theme selector with deferred editorial search and make the activity form the primary editor surface.

**Architecture:** The dialog owns a deferred search term and conditionally queries the existing paginated endpoint at twenty records per page. The activity route keeps its API mutations and builder intact, changing only the composition classes so an open form becomes the main column and its ordered activity sequence becomes a compact auxiliary panel.

**Tech Stack:** React 19, TanStack Query, TanStack Router, TypeScript, Bun Test, CSS.

## Global Constraints

- Do not change API contracts or save/mutation logic.
- Do not modify unrelated catalogue or media changes.
- Do not introduce `any`.
- Use explicit classes in `frontend/src/routes/admin-content-studio.css`.
- Preserve dialog semantics, Escape, backdrop close, and focus restoration.
- Validate with `bun run typecheck`, focused tests, and `bun run build`.

---

### Task 1: Searchable theme picker

**Files:**
- Modify: `frontend/src/features/admin/componentes/nueva-actividad-dialog.tsx`
- Test: `frontend/src/features/admin/componentes/nueva-actividad-dialog.test.tsx`

**Interfaces:**
- Consumes: `obtenerTemasAdminPaginados({ q, limit, offset })` from `../admin.api`.
- Produces: Deferred, paginated theme selection without native `<select>` or `useQueries`.

- [ ] Add a focused assertion that the content renders the initial prompt without a search result list.
- [ ] Add a pure exported query-enablement predicate and test that one character disables it while two characters enables it.
- [ ] Replace the three status queries with one `useQuery`, keyed by deferred search text and page offset, with `enabled` set by the predicate and `limit: 20`.
- [ ] Render focusable result buttons with title, status, optional senda, `aria-selected`, and an accessible list label.
- [ ] Add previous/next page controls and selected-theme summary; preserve the existing close and navigation behavior.
- [ ] Run `bun test src/features/admin/componentes/nueva-actividad-dialog.test.tsx`.

### Task 2: Editor-primary layout

**Files:**
- Modify: `frontend/src/routes/admin.temas.$themeId.activities.tsx`
- Modify: `frontend/src/routes/admin-content-studio.css`

**Interfaces:**
- Consumes: Existing `ActivityBuilder`, activity list callbacks, and unchanged mutations.
- Produces: `admin-activity-editor-layout`, primary editor, compact sequence panel, and inline age context classes.

- [ ] Keep the compact theme header and existing route/search behavior.
- [ ] In open-form mode, render the editor before an auxiliary `aside`; move the age selector into the editor context header.
- [ ] Render the activity sequence in a compact `details` panel when a form is open; retain the normal sequence section when no form is open.
- [ ] Replace the large empty canvas with a compact side-card CTA in open-form mode.
- [ ] Add explicit desktop and mobile CSS classes so the editor is centered and wide, the sequence panel is compact/sticky on desktop, and stacks below the editor on mobile.

### Task 3: Verification

**Files:**
- Test: `frontend/src/features/admin/componentes/nueva-actividad-dialog.test.tsx`
- Verify: `frontend/src/routes/admin.temas.$themeId.activities.tsx`
- Verify: `frontend/src/routes/admin-content-studio.css`

- [ ] Run the focused dialog test.
- [ ] Run `bun run typecheck` from `frontend`.
- [ ] Run `bun run build` from `frontend`.
- [ ] Inspect the working tree and report only the requested paths plus the unavoidable generated build artifact if it changes.
