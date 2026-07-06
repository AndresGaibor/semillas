# Semillas API — Documentación Técnica

## Stack

```
Hono (Cloudflare Workers) → Supabase PostgreSQL
```

- **Runtime**: Cloudflare Workers (Wrangler)
- **Framework**: Hono v4
- **ORM/Client**: Supabase JS (`supabase-js`)
- **Validación**: Zod + `@hono/zod-validator`
- **Auth**: Supabase Auth + guest mode (`X-Guest-User-Id`)
- **Tipos**: Tipos TypeScript generados desde Supabase (`database.types.ts`)

---

## Arquitectura

```
Frontend React PWA
       ↓  HTTP JSON
Hono API (Cloudflare Workers)
       ↓  Supabase JS
Supabase PostgreSQL
```

### Middleware stack

1. `logger()` — logs HTTP requests
2. `cors()` — CORS configurado desde `CORS_ORIGIN`
3. `db` — inyecta `createSupabaseAdmin(env)` en cada request
4. `authMiddleware` — autenticación opcional (Bearer token o X-Guest-User-Id)
5. `requireRole(...roles)` — protección por rol
6. `errorHandler` — captura `HttpError` y responde JSON consistente

### Response format

```json
{
  "ok": true,
  "data": { ... }
}
```

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Tema no encontrado"
  }
}
```

---

## Endpoints

### Health

```
GET  /                     → { ok, name, version }
GET  /health               → { ok, status, env }
```

### Catálogo

```
GET  /catalog/age-groups    → Franjas: Semillas (5-8), Exploradores (9-12), Embajadores (13-17)
GET  /catalog/activity-types → Tipos: quiz, flashcards, completar, etc.
GET  /catalog/crecer-steps  → Pasos CRECER: Conectar, Relatar, Enseñar, Comprobar, Experimentar, Recompensar
```

### Auth

```
POST /auth/guest            → Crea usuario invitado + perfil
  Body: { nickname, ageGroupId?, avatarUrl? }
  Response: { user, profile, auth: { headerName, headerValue } }
```

### Perfil

```
GET  /me                    → Perfil del usuario autenticado
PATCH /me/profile           → Actualizar perfil
  Headers: X-Guest-User-Id | Authorization: Bearer <token>
```

### Sendas

```
GET  /sendas                → Sendas activas (Padre, Hijo, Espíritu Santo)
```

### Temas

```
GET  /themes                 → Temas publicados (usa vista v_theme_public)
GET  /themes?pathId=ID       → Temas filtrados por senda
GET  /themes/:id             → Detalle con path, cover, key_verse, bible_reference
GET  /themes/:id/steps       → Pasos CRECER del tema
GET  /themes/:id/steps?ageGroupId=ID  → Pasos filtrados por franja
GET  /themes/:id/activities  → Actividades del tema
GET  /themes/:id/activities?ageGroupId=ID  → Actividades filtradas
```

### Actividades

```
GET  /activities/:id         → Detalle de actividad con opciones
POST /activities/:id/answer  → Responder actividad (autenticado)
  Headers: X-Guest-User-Id
  Body: { clientEventId, selectedOptionId?, answerText? }
  Response: { result: { isCorrect, xpAwarded } }
```

### Progreso

```
GET  /progress/me            → Progreso del usuario (temas + actividades)
POST /progress/events        → Enviar evento de progreso
  Body: { clientEventId, eventType, themeId?, stepId?, activityId?, ... }
  - Idempotente: si clientEventId ya existe, devuelve { duplicated: true }
```

### Gamificación

```
GET  /gamification/me        → Nivel, XP total y logros del usuario
```

---

## Autenticación

### Modo invitado (desarrollo/testing)

```
POST /auth/guest  →  X-Guest-User-Id: <uuid>

GET /me
X-Guest-User-Id: <uuid>
```

### Modo Bearer (producción con Supabase Auth)

```
Authorization: Bearer <supabase_access_token>
```

El middleware `authMiddleware`:
1. Si hay `X-Guest-User-Id`, autentica como invitado
2. Si hay `Authorization: Bearer`, obtiene user de Supabase Auth
3. Si el usuario no existe localmente, lo crea automáticamente (auto-registro)

---

## Roles

| Rol     | Descripción              |
|---------|--------------------------|
| admin   | Administrador del CMS    |
| user    | Usuario registrado       |
| guest   | Usuario invitado         |
| parent  | Padre/madre de familia   |

Uso: `requireRole("admin")`, `requireRole("admin", "user")`, etc.

---

## Seed Data

El archivo `src/db/seed.sql` crea un tema de demostración:

- **Tema**: "El Buen Pastor" (Senda del Hijo, Juan 10:11-15)
- **Contenido para**: Semillas, Exploradores y Embajadores
- **6 pasos CRECER** con contenido por franja
- **3 quizzes** (uno por franja) con opciones correctas/incorrectas
- **Preguntas de reflexión** por franja
- **Logro/insignia** al completar el tema

Ejecutar:
```bash
bunx supabase db query --linked --file src/db/seed.sql
```

---

## TypeScript Types

```bash
# Generar tipos desde Supabase
SUPABASE_PROJECT_REF=xxxx bun run gen:types
```

Los tipos generados están en `src/db/database.types.ts`.

Los alias de tablas están en `src/db/schema.ts`:

```ts
export const table = {
  appUser: "app_user",
  path: "path",
  theme: "theme",
  activity: "activity",
  // ...
} as const;
```

---

## Variables de Entorno

| Variable                    | Descripción                          |
|-----------------------------|--------------------------------------|
| `APP_ENV`                   | `local` o `production`               |
| `CORS_ORIGIN`               | Origen permitido para CORS           |
| `SUPABASE_URL`              | URL del proyecto Supabase            |
| `SUPABASE_PUBLISHABLE_KEY`  | Anon key (pública)                   |
| `SUPABASE_SERVER_KEY`       | Service role key (secreta)           |
| `SUPABASE_PROJECT_REF`      | Referencia del proyecto              |

Desarrollo: `.dev.vars`
Producción: `bunx wrangler secret put <NAME>`

---

## Comandos Útiles

```bash
bun run dev           # Iniciar servidor local (Wrangler)
bun run typecheck     # Verificar tipos TypeScript
bun run deploy        # Desplegar a Cloudflare Workers
bun run gen:types     # Regenerar database.types.ts

# Seed
bunx supabase db query --linked --file src/db/seed.sql
```
