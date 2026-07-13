# API 100% en Español Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alinear toda la superficie pública de la API con `semilla_base.sql` como contrato canónico exacto, sin alias legacy ni nombres públicos en inglés.

**Architecture:** El backend emitirá un contrato JSON y rutas 100% en español desde un pequeño conjunto de helpers de serialización y un envelope de respuesta común. El frontend consumirá ese contrato con adaptadores tipados, sin mapas híbridos. Docs, ejemplos HTTP y pruebas actuarán como guardrails para evitar regresiones.

**Tech Stack:** Bun, TypeScript, Hono, Zod, OpenAPI/Scalar, React, TanStack Query, TanStack Router, bun:test.

## Global Constraints

- `semilla_base.sql` es la fuente de verdad y el contrato canónico exacto.
- No habrá aliases legacy.
- No habrá nombres públicos híbridos.
- Las respuestas deben usar claves en español.
- OpenAPI/Scalar en español.
- Ejemplos HTTP y documentación en español.
- Tests que confirmen que no existen rutas legacy.
- No renombrar tablas físicas de la base.
- No introducir compatibilidad temporal con el contrato viejo.

---

### Task 1: Contrato backend exacto en español

**Files:**
- Create: `backend/src/shared/http/respuesta.ts`
- Create: `backend/src/shared/http/respuesta.test.ts`
- Create: `backend/src/shared/serializers/usuario.serializer.ts`
- Create: `backend/src/shared/serializers/perfil.serializer.ts`
- Create: `backend/src/shared/serializers/tema.serializer.ts`
- Create: `backend/src/shared/serializers/actividad.serializer.ts`
- Create: `backend/src/shared/serializers/progreso.serializer.ts`
- Create: `backend/src/shared/serializers/serializers.test.ts`
- Modify: `backend/src/modules/auth/auth.routes.ts`
- Modify: `backend/src/modules/auth/auth.schemas.ts`
- Modify: `backend/src/modules/users/users.routes.ts`
- Modify: `backend/src/modules/users/users.schemas.ts`
- Modify: `backend/src/modules/catalog/catalog.routes.ts`
- Modify: `backend/src/modules/themes/themes.routes.ts`
- Modify: `backend/src/modules/activities/activities.routes.ts`
- Modify: `backend/src/modules/activities/activities.schemas.ts`
- Modify: `backend/src/modules/progress/progress.routes.ts`
- Modify: `backend/src/modules/progress/progress.schemas.ts`
- Modify: `backend/src/modules/admin/admin.routes.ts`
- Modify: `backend/src/modules/admin/admin.schemas.ts`
- Modify: `backend/src/modules/gamification/gamification.routes.ts`
- Modify: `backend/src/shared/middleware/error-handler.ts`
- Modify: `backend/src/app.ts`
- Modify: `backend/src/openapi/spec.ts`
- Modify: `backend/src/app.test.ts`

**Interfaces:**
- Consumes: filas de `usuario_app`, `perfil`, `tema`, `paso_tema`, `actividad`, `evento_progreso`, `v_nivel_usuario`, `logro_usuario`.
- Produces: helpers `responderExito<T>(datos, status?)`, `responderError(error, codigo?, status?)`, `serializarUsuario(fila)`, `serializarPerfil(fila)`, `serializarTema(fila)`, `serializarActividad(fila)`, `serializarProgresoTema(fila)`, `serializarProgresoActividad(fila)`, `serializarNivelUsuario(fila)`.
- Public response shape: `{ exito: true, datos: T }` and `{ exito: false, error: string, codigo?: string }`.

- [ ] **Step 1: Write the failing tests**

Create `backend/src/shared/http/respuesta.test.ts` asserting that `responderExito({ id: "1" })` serializa `{ exito: true, datos: { id: "1" } }` and that `responderError("No encontrado", "NO_ENCONTRADO")` serializa `{ exito: false, error: "No encontrado", codigo: "NO_ENCONTRADO" }`.

Create `backend/src/shared/serializers/serializers.test.ts` asserting that the serializers emit exact Spanish keys:
- `serializarUsuario({ id, rol, proveedor, nombre_visible, correo })` -> `{ id, rol, proveedor, nombre_visible, correo }`
- `serializarPerfil({ id, usuario_id, apodo, grupo_edad_id, url_avatar, clave_avatar, prefiere_audio, tamano_texto_preferido })` -> same keys
- `serializarTema(...)` -> `{ id, senda_id, titulo, slug, objetivo, resumen, portada_recurso_id, estado, version_biblica_id, xp_recompensa, minutos_estimados, version_contenido, publicado_en }`
- `serializarActividad(...)` -> `{ id, tema_id, paso_id, grupo_edad_id, tipo_actividad_id, titulo, consigna, orden, xp_recompensa, dificultad, limite_tiempo_seg, obligatorio, retroalimentacion, configuracion, creado_en, actualizado_en }`
- `serializarProgresoTema(...)` and `serializarProgresoActividad(...)` -> Spanish keys only.

Expand `backend/src/app.test.ts` so the canonical routes (`/autenticacion/invitado`, `/catalogo/grupos-etarios`, `/perfil`, `/temas`, `/actividades`, `/progreso/mi`, `/administracion/resumen`, `/gamificacion/mi`) still answer successfully once the serializers are in place.

- [ ] **Step 2: Run the tests to confirm RED**

Run:
`bun test src/shared/http/respuesta.test.ts src/shared/serializers/serializers.test.ts src/app.test.ts`

Expected: the new tests fail because the helpers/exports do not exist yet or because the current payload keys are still mixed.

- [ ] **Step 3: Implement the backend contract helpers and route rewrites**

Implement the helpers in `backend/src/shared/http/respuesta.ts` and the serializers in `backend/src/shared/serializers/*.ts`.

Update the route files to use the new helpers and Spanish names exactly:
- `auth.routes.ts`: request `apodo`, `grupo_edad_id`, `url_avatar`; response `usuario`, `perfil`, `autenticacion`.
- `users.routes.ts`: response `usuario` and `perfil` with Spanish keys.
- `catalog.routes.ts`: response keys `codigo`, `nombre`, `edad_minima`, `edad_maxima`, `descripcion`, `orden`, `dominio_publico`, `es_juego`.
- `themes.routes.ts`: param `tema_id`, query `senda_id` and `grupo_edad_id`, response keys from `tema` / `paso_tema` / `actividad` in Spanish.
- `activities.routes.ts`: param `actividad_id`, response `resultado`, `duplicado`, `correcta`, `xp_otorgada`.
- `progress.routes.ts`: response `datos` with `progresos_tema` / `progresos_actividad`, event body in Spanish (`evento_id_cliente`, `tipo_evento`, `tema_id`, `paso_id`, `actividad_id`, `correcta`, `puntaje`, `xp_otorgada`, `datos`, `ocurrido_en_cliente`, `dispositivo_id`).
- `admin.routes.ts`: admin/public CMS payloads in Spanish.
- `gamification.routes.ts`: response `nivel` and `logros`.
- `openapi/spec.ts`: rewrite all schemas and examples to Spanish exact names, including `exito`, `datos`, `usuario`, `perfil`, `autenticacion`, `grupo_edad_id`, `senda_id`, `tema_id`, `paso_id`, `actividad_id`, `evento_id_cliente`.

- [ ] **Step 4: Run the tests again and verify GREEN**

Run:
`bun test src/shared/http/respuesta.test.ts src/shared/serializers/serializers.test.ts src/app.test.ts`

Expected: all tests pass, and `bun run typecheck` in `backend` stays green.

- [ ] **Step 5: Commit**

```bash
git add backend/src/shared/http/respuesta.ts backend/src/shared/http/respuesta.test.ts backend/src/shared/serializers backend/src/modules/auth/auth.routes.ts backend/src/modules/auth/auth.schemas.ts backend/src/modules/users/users.routes.ts backend/src/modules/users/users.schemas.ts backend/src/modules/catalog/catalog.routes.ts backend/src/modules/themes/themes.routes.ts backend/src/modules/activities/activities.routes.ts backend/src/modules/activities/activities.schemas.ts backend/src/modules/progress/progress.routes.ts backend/src/modules/progress/progress.schemas.ts backend/src/modules/admin/admin.routes.ts backend/src/modules/admin/admin.schemas.ts backend/src/modules/gamification/gamification.routes.ts backend/src/openapi/spec.ts backend/src/app.test.ts
git commit -m "feat: contrato backend en español"
```

### Task 2: Frontend consumidor del contrato en español

**Files:**
- Create: `frontend/src/shared/api/contrato.ts`
- Create: `frontend/src/shared/api/contrato.test.ts`
- Modify: `frontend/src/shared/api/http.ts`
- Modify: `frontend/src/features/auth/auth.api.ts`
- Modify: `frontend/src/features/catalog/catalog.api.ts`
- Modify: `frontend/src/features/profile/profile.api.ts`
- Modify: `frontend/src/features/sendas/sendas.api.ts`
- Modify: `frontend/src/features/themes/themes.api.ts`
- Modify: `frontend/src/features/activities/activities.api.ts`
- Modify: `frontend/src/features/admin/admin.api.ts`
- Modify: `frontend/src/features/gamification/gamification.api.ts`
- Create: `frontend/src/features/auth/auth.api.test.ts`
- Modify: `frontend/src/routes/login.tsx`
- Modify: `frontend/src/routes/onboarding.tsx`
- Modify: `frontend/src/routes/app.index.tsx`
- Modify: `frontend/src/routes/app.perfil.tsx`
- Modify: `frontend/src/routes/app.temas.$themeId.tsx`
- Modify: `frontend/src/routes/app.actividades.$activityId.tsx`
- Modify: `frontend/src/routes/app.logros.tsx`
- Modify: `frontend/src/routes/admin.temas.$themeId.activities.tsx`
- Modify: `frontend/src/routes/admin.temas.$themeId.crecer.tsx`
- Modify: `frontend/src/routes/admin.temas.$themeId.preview.tsx`
- Modify: `frontend/src/routes/admin.temas.new.tsx`
- Modify: `frontend/src/routes/admin.temas.tsx`

**Interfaces:**
- Consumes: contrato backend `{ exito, datos, error, codigo }` y payloads en español (`apodo`, `grupo_edad_id`, `senda_id`, `tema_id`, `actividad_id`).
- Produces: adaptadores `desenvolverRespuesta<T>(respuesta)`, `construirAltaInvitado(input)`, `construirActualizacionPerfil(input)`, `normalizarUsuario(datos)`, `normalizarPerfil(datos)`.
- Public frontend API types: `RespuestaApi<T>`, `UsuarioApi`, `PerfilApi`, `TemaApi`, `ActividadApi`, `EventoProgresoApi` with Spanish field names only.

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/shared/api/contrato.test.ts` that checks:
- `desenvolverRespuesta({ exito: true, datos: { id: "1" } })` returns the payload.
- `construirAltaInvitado({ apodo: "Semillero", grupo_edad_id: "..." })` emits only Spanish keys.
- `normalizarUsuario({ id, rol, proveedor, nombre_visible, correo })` preserves Spanish keys.
- `normalizarPerfil({ id, usuario_id, apodo, grupo_edad_id, url_avatar, clave_avatar, prefiere_audio, tamano_texto_preferido })` preserves Spanish keys.

Also add `frontend/src/features/auth/auth.api.test.ts` asserting that the guest-auth request body uses `apodo` and that the response reads `usuario`, `perfil`, `autenticacion`.

- [ ] **Step 2: Run the tests to confirm RED**

Run:
`bun test src/shared/api/contrato.test.ts src/features/auth/auth.api.test.ts`

Expected: RED until the frontend contract helpers exist and the API clients stop expecting English keys.

- [ ] **Step 3: Implement the frontend contract adapters**

Implement `frontend/src/shared/api/contrato.ts` and update `http.ts` so the API layer consumes the Spanish envelope directly.

Rewrite the feature API clients to use Spanish keys end-to-end:
- auth uses `apodo`, `grupo_edad_id`, `url_avatar` and returns `usuario`, `perfil`, `autenticacion`.
- catalog returns `grupo_edad`, `tipo_actividad`, `version_biblica`, `tipo_paso_crecer`.
- profile returns `usuario`/`perfil`.
- themes and activities use `senda_id`, `tema_id`, `paso_id`, `actividad_id`, `grupo_edad_id`.
- admin forms and actions use the same Spanish field names.

Update route components so they read the new Spanish property names and stop depending on mixed keys such as `display_name`, `nickname`, `provider`, `role`, `theme_id`, `step_id`, `activity_id`, `pathId`, `ageGroupId`.

- [ ] **Step 4: Run the tests again and verify GREEN**

Run:
`bun test src/shared/api/contrato.test.ts src/features/auth/auth.api.test.ts`

Then run:
`bun run typecheck`

Expected: tests pass and TypeScript stays green.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/shared/api/contrato.ts frontend/src/shared/api/contrato.test.ts frontend/src/shared/api/http.ts frontend/src/features/auth/auth.api.ts frontend/src/features/catalog/catalog.api.ts frontend/src/features/profile/profile.api.ts frontend/src/features/sendas/sendas.api.ts frontend/src/features/themes/themes.api.ts frontend/src/features/activities/activities.api.ts frontend/src/features/admin/admin.api.ts frontend/src/features/gamification/gamification.api.ts frontend/src/routes/login.tsx frontend/src/routes/onboarding.tsx frontend/src/routes/app.index.tsx frontend/src/routes/app.perfil.tsx frontend/src/routes/app.temas.$themeId.tsx frontend/src/routes/app.actividades.$activityId.tsx frontend/src/routes/app.logros.tsx frontend/src/routes/admin.temas.$themeId.activities.tsx frontend/src/routes/admin.temas.$themeId.crecer.tsx frontend/src/routes/admin.temas.$themeId.preview.tsx frontend/src/routes/admin.temas.new.tsx frontend/src/routes/admin.temas.tsx
git commit -m "feat: frontend consume API en español"
```

### Task 3: Docs, ejemplos y guardrails del contrato

**Files:**
- Modify: `backend/api.http`
- Modify: `docs/backend-api.md`
- Modify: `docs/superpowers/specs/2026-07-06-api-espanol-exacto-design.md`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `GEMINI.md`
- Create: `tests/contrato-publico.test.ts`

**Interfaces:**
- Consumes: contrato final backend/frontend ya en español.
- Produces: documentación y ejemplos sin claves públicas en inglés, más un guardrail de repo que falla si reaparece una ruta o clave legacy en docs.

- [ ] **Step 1: Write the failing guardrail test**

Create `tests/contrato-publico.test.ts` that reads these files as text:
- `backend/api.http`
- `docs/backend-api.md`
- `docs/superpowers/specs/2026-07-06-api-espanol-exacto-design.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

The test should fail if any forbidden public tokens are present in those docs/examples, including:
- `display_name`
- `nickname`
- `provider`
- `role`
- `theme_id`
- `step_id`
- `activity_id`
- `pathId`
- `ageGroupId`
- `/auth/guest`
- `/me/profile`
- `/themes`
- `/activities`
- `/progress`
- `/gamification`

The test should also assert the canonical Spanish tokens exist in the docs, for example `apodo`, `grupo_edad_id`, `senda_id`, `tema_id`, `paso_id`, `actividad_id`, `usuario`, `perfil`, `autenticacion`, `progreso`, `gamificacion`.

- [ ] **Step 2: Run the guardrail test to confirm RED**

Run:
`bun test tests/contrato-publico.test.ts`

Expected: RED until the docs/examples are fully aligned.

- [ ] **Step 3: Rewrite docs and examples**

Update `backend/api.http` so every request uses the canonical Spanish route and field names.

Update `docs/backend-api.md` so the catalog, auth, profile, themes, activities, progress, admin, and gamification sections use the final Spanish contract, including Spanish JSON examples.

Update `docs/superpowers/specs/2026-07-06-api-espanol-exacto-design.md` so it reflects the final contract and no longer mentions transitional English keys as if they were public.

Update `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` so their API snippets match the canonical Spanish surface and no longer teach legacy route names.

- [ ] **Step 4: Run the guardrail test again and verify GREEN**

Run:
`bun test tests/contrato-publico.test.ts`

Then run:
`bun run typecheck` in `backend` and `frontend`, plus the repo-level verification command already used in this project.

Expected: docs guardrail passes, no forbidden legacy tokens remain in the checked docs, and typecheck stays green.

- [ ] **Step 5: Commit**

```bash
git add backend/api.http docs/backend-api.md docs/superpowers/specs/2026-07-06-api-espanol-exacto-design.md AGENTS.md CLAUDE.md GEMINI.md tests/contrato-publico.test.ts
git commit -m "docs: contrato api 100% en español"
```
