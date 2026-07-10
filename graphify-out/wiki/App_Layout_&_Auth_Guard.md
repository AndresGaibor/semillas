# App Layout & Auth Guard

> 12 nodes

## Key Concepts

- **app.tsx** (18 connections) — `frontend/src/routes/app.tsx`
- **session.ts** (9 connections) — `frontend/src/shared/api/session.ts`
- **sessionStorageApi** (9 connections) — `frontend/src/shared/api/session.ts`
- **app-mobile-nav.tsx** (5 connections) — `frontend/src/shared/layout/app-mobile-nav.tsx`
- **auth-guard.ts** (4 connections) — `frontend/src/shared/api/auth-guard.ts`
- **obtenerNavegacionMovil()** (4 connections) — `frontend/src/shared/layout/app-mobile-nav.tsx`
- **obtenerNavMovilActivo()** (4 connections) — `frontend/src/shared/layout/app-mobile-nav.tsx`
- **Route** (3 connections) — `frontend/src/routes/app.tsx`
- **AppLayout()** (3 connections) — `frontend/src/routes/app.tsx`
- **app-mobile-nav.test.ts** (3 connections) — `frontend/src/shared/layout/app-mobile-nav.test.ts`
- **hasSession()** (2 connections) — `frontend/src/shared/api/auth-guard.ts`
- **MobileNavItem** (1 connections) — `frontend/src/shared/layout/app-mobile-nav.tsx`

## Relationships

- [Clubs & Media API](Clubs_%26_Media_API.md) (4 shared connections)
- [Supabase Auth Client](Supabase_Auth_Client.md) (3 shared connections)
- [Admin Layout & Access](Admin_Layout_%26_Access.md) (3 shared connections)
- [Bottom Navigation](Bottom_Navigation.md) (2 shared connections)
- [Admin Route Tree](Admin_Route_Tree.md) (2 shared connections)
- [Sidebar Navigation](Sidebar_Navigation.md) (2 shared connections)
- [App Topbar](App_Topbar.md) (2 shared connections)
- [App Providers & Auth](App_Providers_%26_Auth.md) (2 shared connections)
- [Guest Login & Google](Guest_Login_%26_Google.md) (2 shared connections)
- [Admin Revision Page](Admin_Revision_Page.md) (1 shared connections)

## Source Files

- `frontend/src/routes/app.tsx`
- `frontend/src/shared/api/auth-guard.ts`
- `frontend/src/shared/api/session.ts`
- `frontend/src/shared/layout/app-mobile-nav.test.ts`
- `frontend/src/shared/layout/app-mobile-nav.tsx`

## Audit Trail

- EXTRACTED: 63 (97%)
- INFERRED: 2 (3%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*