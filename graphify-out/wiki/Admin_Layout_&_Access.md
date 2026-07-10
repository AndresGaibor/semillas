# Admin Layout & Access

> 8 nodes

## Key Concepts

- **admin.tsx** (15 connections) — `frontend/src/routes/admin.tsx`
- **admin-access.ts** (6 connections) — `frontend/src/shared/auth/admin-access.ts`
- **cerrarSesionAutenticada()** (5 connections) — `frontend/src/shared/auth/supabase.ts`
- **Route** (3 connections) — `frontend/src/routes/admin.tsx`
- **resolverAccesoAdmin()** (3 connections) — `frontend/src/shared/auth/admin-access.ts`
- **AdminLayout()** (2 connections) — `frontend/src/routes/admin.tsx`
- **admin-access.test.ts** (2 connections) — `frontend/src/shared/auth/admin-access.test.ts`
- **AccesoAdmin** (1 connections) — `frontend/src/shared/auth/admin-access.ts`

## Relationships

- [App Layout & Auth Guard](App_Layout_%26_Auth_Guard.md) (3 shared connections)
- [Supabase Auth Client](Supabase_Auth_Client.md) (3 shared connections)
- [Profile Dashboard API](Profile_Dashboard_API.md) (2 shared connections)
- [Admin Route Tree](Admin_Route_Tree.md) (2 shared connections)
- [Sidebar Navigation](Sidebar_Navigation.md) (2 shared connections)
- [App Topbar](App_Topbar.md) (2 shared connections)
- [Progress API](Progress_API.md) (1 shared connections)
- [Admin Revision Page](Admin_Revision_Page.md) (1 shared connections)
- [Clubs & Media API](Clubs_%26_Media_API.md) (1 shared connections)

## Source Files

- `frontend/src/routes/admin.tsx`
- `frontend/src/shared/auth/admin-access.test.ts`
- `frontend/src/shared/auth/admin-access.ts`
- `frontend/src/shared/auth/supabase.ts`

## Audit Trail

- EXTRACTED: 35 (95%)
- INFERRED: 2 (5%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*