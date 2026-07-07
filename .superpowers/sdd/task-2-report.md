## Resumen
Reemplacé el consumo frontend del backend para que use el contrato exacto en español: envelope `exito/datos`, auth invitado con `apodo`, perfil con `usuario/perfil`, catálogo y temas con claves canónicas, y rutas de app/admin leyendo esas propiedades.

## Pruebas
- `bun test src/shared/api/contrato.test.ts src/features/auth/auth.api.test.ts`
- `bun run typecheck`

## Resultados
- Tests de contrato: GREEN.
- Typecheck en `frontend`: GREEN.

## Commits
- `e6793f2` `test: add frontend contract español`
- `f0a5707` `fix: frontend consume API en español`

## Preocupaciones
- El worktree ya traía cambios ajenos preexistentes; no los toqué ni los incluí en el alcance de esta task.
- Quedan carpetas/archivos no relacionados sin trackear en el frontend que no forman parte de esta task.
