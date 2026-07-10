# App Providers & Auth

> 12 nodes

## Key Concepts

- **providers.tsx** (21 connections) — `frontend/src/app/providers.tsx`
- **post-login.ts** (7 connections) — `frontend/src/shared/auth/post-login.ts`
- **reclamarCuentaInvitada()** (5 connections) — `frontend/src/features/profile/profile.api.ts`
- **obtenerRutaPostLogin()** (5 connections) — `frontend/src/shared/auth/post-login.ts`
- **sincronizarSesionAutenticada()** (5 connections) — `frontend/src/shared/auth/supabase.ts`
- **AuthBootstrap()** (4 connections) — `frontend/src/app/providers.tsx`
- **escucharCambiosAutenticacion()** (4 connections) — `frontend/src/shared/auth/supabase.ts`
- **redirigirSegunOnboarding()** (3 connections) — `frontend/src/app/providers.tsx`
- **vincularCuentaPendiente()** (2 connections) — `frontend/src/app/providers.tsx`
- **AppProviders()** (2 connections) — `frontend/src/app/providers.tsx`
- **main.tsx** (2 connections) — `frontend/src/main.tsx`
- **post-login.test.ts** (2 connections) — `frontend/src/shared/auth/post-login.test.ts`

## Relationships

- [Supabase Auth Client](Supabase_Auth_Client.md) (5 shared connections)
- [Profile Dashboard API](Profile_Dashboard_API.md) (4 shared connections)
- [Guest Login & Google](Guest_Login_%26_Google.md) (4 shared connections)
- [Onboarding Components](Onboarding_Components.md) (3 shared connections)
- [Activity API Client](Activity_API_Client.md) (2 shared connections)
- [Progress API](Progress_API.md) (2 shared connections)
- [Router Config](Router_Config.md) (2 shared connections)
- [App Layout & Auth Guard](App_Layout_%26_Auth_Guard.md) (2 shared connections)
- [Clubs & Media API](Clubs_%26_Media_API.md) (2 shared connections)

## Source Files

- `frontend/src/app/providers.tsx`
- `frontend/src/features/profile/profile.api.ts`
- `frontend/src/main.tsx`
- `frontend/src/shared/auth/post-login.test.ts`
- `frontend/src/shared/auth/post-login.ts`
- `frontend/src/shared/auth/supabase.ts`

## Audit Trail

- EXTRACTED: 62 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*