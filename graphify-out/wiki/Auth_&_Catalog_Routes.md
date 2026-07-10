# Auth & Catalog Routes

> 23 nodes

## Key Concepts

- **users.routes.ts** (16 connections) — `backend/src/modules/users/users.routes.ts`
- **respuesta.ts** (16 connections) — `backend/src/shared/http/respuesta.ts`
- **auth.routes.ts** (14 connections) — `backend/src/modules/auth/auth.routes.ts`
- **responderExito()** (14 connections) — `backend/src/shared/http/respuesta.ts`
- **responderError()** (11 connections) — `backend/src/shared/http/respuesta.ts`
- **validate.middleware.ts** (7 connections) — `backend/src/shared/middleware/validate.middleware.ts`
- **catalog.routes.ts** (6 connections) — `backend/src/modules/catalog/catalog.routes.ts`
- **error-handler.ts** (6 connections) — `backend/src/shared/middleware/error-handler.ts`
- **perfil.serializer.ts** (5 connections) — `backend/src/shared/serializers/perfil.serializer.ts`
- **usuario.serializer.ts** (5 connections) — `backend/src/shared/serializers/usuario.serializer.ts`
- **serializarPerfil()** (4 connections) — `backend/src/shared/serializers/perfil.serializer.ts`
- **serializarUsuario()** (4 connections) — `backend/src/shared/serializers/usuario.serializer.ts`
- **respuesta.test.ts** (3 connections) — `backend/src/shared/http/respuesta.test.ts`
- **errorHandler()** (3 connections) — `backend/src/shared/middleware/error-handler.ts`
- **authRoutes** (2 connections) — `backend/src/modules/auth/auth.routes.ts`
- **auth.schemas.ts** (2 connections) — `backend/src/modules/auth/auth.schemas.ts`
- **createGuestSchema** (2 connections) — `backend/src/modules/auth/auth.schemas.ts`
- **catalogRoutes** (2 connections) — `backend/src/modules/catalog/catalog.routes.ts`
- **usersRoutes** (2 connections) — `backend/src/modules/users/users.routes.ts`
- **users.schemas.ts** (2 connections) — `backend/src/modules/users/users.schemas.ts`
- **updateProfileSchema** (2 connections) — `backend/src/modules/users/users.schemas.ts`
- **FilaPerfil** (1 connections) — `backend/src/shared/serializers/perfil.serializer.ts`
- **FilaUsuario** (1 connections) — `backend/src/shared/serializers/usuario.serializer.ts`

## Relationships

- [Backend Core (Hono)](Backend_Core_%28Hono%29.md) (19 shared connections)
- [Clubs & Auth Routes](Clubs_%26_Auth_Routes.md) (8 shared connections)
- [Progress Routes & Serializer](Progress_Routes_%26_Serializer.md) (7 shared connections)
- [Media Routes & Upload](Media_Routes_%26_Upload.md) (5 shared connections)
- [Admin Routes Handler](Admin_Routes_Handler.md) (4 shared connections)
- [TypeScript DB Types](TypeScript_DB_Types.md) (4 shared connections)
- [Activities Routes](Activities_Routes.md) (3 shared connections)

## Source Files

- `backend/src/modules/auth/auth.routes.ts`
- `backend/src/modules/auth/auth.schemas.ts`
- `backend/src/modules/catalog/catalog.routes.ts`
- `backend/src/modules/users/users.routes.ts`
- `backend/src/modules/users/users.schemas.ts`
- `backend/src/shared/http/respuesta.test.ts`
- `backend/src/shared/http/respuesta.ts`
- `backend/src/shared/middleware/error-handler.ts`
- `backend/src/shared/middleware/validate.middleware.ts`
- `backend/src/shared/serializers/perfil.serializer.ts`
- `backend/src/shared/serializers/usuario.serializer.ts`

## Audit Trail

- EXTRACTED: 130 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*