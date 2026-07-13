# Baseline de cierre G0: dev2

Fecha de ejecución: 2026-07-13

## Identidad reproducible

- Rama: `dev2` (seguimiento: `origin/dev2`).
- SHA base: `01ab28ebf4f017b1d07b84a4fe932f5767e8ec98`.
- Checkout: repositorio principal, no worktree enlazado.
- Bun: `1.3.10`.
- Supabase CLI: `2.109.1`.
- Wrangler: `4.110.0`.

## Estado del trabajo al inicio

El checkout no estaba limpio. Estos cambios se consideraron concurrentes y no se modificaron durante la captura:

| Estado | Archivo | Owner | Clasificación |
| --- | --- | --- | --- |
| Modificado | `backend/src/shared/errors/result-helpers.ts` | concurrente-dev2 | concurrente-dev2 |
| Modificado | `frontend/src/routeTree.gen.ts` | concurrente-dev2 | concurrente-dev2 |
| Modificado | `semilla_base.sql` | concurrente-dev2 | concurrente-dev2 |
| Sin rastrear | `backend/src/modules/admin/admin-governance.schemas.test.ts` | concurrente-dev2 | concurrente-dev2 |
| Sin rastrear | `supabase/migrations/20260712000006_logro_usuario_reclamado_en.sql` | concurrente-dev2 | concurrente-dev2 |
| Sin rastrear | `supabase/migrations/20260713000000_admin_governance.sql` | concurrente-dev2 | concurrente-dev2 |

Historial visible más reciente: `01ab28eb fix: surface remaining frontend errors`.

## Ejecución

Todos los comandos se ejecutaron sobre el SHA indicado, sin corregir features ni exponer variables de entorno o secretos.

| Comando | Resultado | Evidencia resumida |
| --- | --- | --- |
| `bun install --frozen-lockfile` | PASS | 826 instalaciones verificadas, sin cambios. |
| `bun run --cwd backend typecheck` | FAIL | Cuatro imports inexistentes desde el test concurrente de governance. |
| `bun run --cwd frontend typecheck` | PASS | `tsc --noEmit` finalizó correctamente. |
| `bun run test:backend` | FAIL | 140 tests pass; 1 fallo y 1 error por carga del test concurrente de governance. |
| `bun run test:frontend` | PASS | 554 tests pass; 0 fallos. |
| `bun run test:contrato` | PASS | 156 tests pass; 0 fallos. |
| `bun run test:e2e` | FAIL | El script ejecuta `bun test test --pass-with-no-tests`; 140 pass, 1 fallo y 1 error por governance. No apunta a un archivo E2E explícito. |
| `bun run build` | FAIL | Frontend construye y genera PWA; backend falla en los mismos cuatro imports del test concurrente. |

## Fallos y clasificación

| Comando afectado | Archivo afectado | Causa real | Owner | Clasificación |
| --- | --- | --- | --- | --- |
| `bun run --cwd backend typecheck` | `backend/src/modules/admin/admin-governance.schemas.test.ts` | Importa `createAdminUserSchema`, `reportsQuerySchema`, `reviewListQuerySchema` y `updatePlatformSettingsSchema`, que no son exports de `admin.schemas.ts`. | concurrente-dev2 | concurrente-dev2 |
| `bun run test:backend` | `backend/src/modules/admin/admin-governance.schemas.test.ts` | Bun no puede cargar el módulo por el export inexistente `updatePlatformSettingsSchema`; el conteo resultante es 140 pass, 1 fail y 1 error. | concurrente-dev2 | concurrente-dev2 |
| `bun run test:e2e` | `backend/src/modules/admin/admin-governance.schemas.test.ts` | El script actual recorre `backend/test` completo, por lo que reproduce el mismo error de carga; no ejecuta un archivo E2E dedicado. | concurrente-dev2 | concurrente-dev2 |
| `bun run build` | `backend/src/modules/admin/admin-governance.schemas.test.ts` | La fase backend `tsc --noEmit` reproduce los cuatro imports inexistentes. | concurrente-dev2 | concurrente-dev2 |

No se identificaron fallos `preexistente` ni `introducido-por-gate` durante esta captura. La clasificación se limita al estado observado de `dev2` y no atribuye autoría personal.

## Advertencias no bloqueantes

- Vite advierte que `frontend/src/routes/auth.callback.test.tsx` parece un archivo de ruta sin exportar `Route`.
- El build frontend advierte chunks mayores a 500 kB y genera una PWA con 240 entradas precacheadas (66882.75 KiB).

Estas advertencias no causaron fallo de los comandos que las emitieron.

## Restricción aplicada

La Task 0.1 original contempla un commit documental. No se ejecutó `git add` ni `git commit` porque la solicitud operativa exige expresamente no hacer commit.
