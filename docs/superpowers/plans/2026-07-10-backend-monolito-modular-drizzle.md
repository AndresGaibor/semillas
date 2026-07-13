# Backend Modular con Drizzle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar gradualmente el backend de Semillas a un monolito modular con rutas Hono delgadas, casos de uso, repositorios Drizzle y conectividad segura desde Cloudflare Workers a Supabase PostgreSQL.

**Architecture:** La migracion conserva las rutas y el contrato HTTP actuales mientras mueve cada dominio hacia `routes -> casos de uso -> repositorios -> Drizzle`. Auth y Storage permanecen en Supabase JS; las reglas de autorizacion se aplican en Hono y en las consultas, porque Drizzle directo no propaga el JWT a RLS automaticamente.

**Tech Stack:** Bun, TypeScript estricto, Hono, Zod, Drizzle ORM, PostgreSQL de Supabase, Cloudflare Workers, Hyperdrive y Supabase Auth/Storage.

## Restricciones Globales

- Usar Bun; no usar npm, pnpm ni yarn.
- Conservar el contrato `{ exito, datos, meta? }` y `{ exito: false, error, codigo?, detalle? }`.
- Conservar las rutas publicas durante toda la migracion.
- No almacenar ni exponer secretos; las claves `service_role` detectadas deben rotarse fuera del repositorio antes de desplegar.
- Aplicar autenticacion, rol y propiedad en el backend y en el filtro SQL de toda consulta privada.
- La PWA debe mantener el protocolo de sincronizacion y la idempotencia por evento de cliente.
- Escribir pruebas antes de cada cambio de produccion y alcanzar al menos 80% de cobertura en el codigo nuevo.
- No sobrescribir cambios locales existentes, especialmente `backend/src/modules/admin/admin.routes.ts`, `bun.lock` y la documentacion sin seguimiento.

---

## Estado Inicial Auditado

- `backend/src/db/client.ts` crea un cliente `postgres-js` global sin recibir una URL o un binding de Workers. Esto produce conexiones rechazadas en las pruebas y no es una integracion segura para Workers.
- `backend/wrangler.toml` no declara Hyperdrive ni otro binding de base de datos.
- Drizzle esta instalado y ya se usa directamente en varios modulos, pero las rutas aun contienen consultas y reglas de negocio.
- `backend/src/db/schema.ts`, `semilla_base.sql` y las migraciones de `supabase/migrations/` divergen; la migracion Drizzle actual no representa una base inicial ejecutable.
- Las pruebas backend tienen nueve fallos conocidos porque mockean la Data API de Supabase mientras las rutas migradas consultan Drizzle.
- Admin y media tienen protecciones de autenticacion/autorizacion desactivadas. Actividades y sincronizacion aceptan datos sensibles controlados por cliente.

## Decisiones Bloqueantes

- [ ] Rotar las claves `service_role` expuestas en `backend/insert_game.ts` y `backend/query_db.ts`; eliminar los secretos de esos archivos y del historial accesible segun la politica del equipo. Esta accion requiere acceso administrativo a Supabase y no puede automatizarse desde codigo.
- [ ] Crear una configuracion Hyperdrive que apunte a la base Supabase de desarrollo con un usuario PostgreSQL de privilegios minimos.
- [ ] Obtener el identificador de Hyperdrive para cada entorno y declararlo como binding, sin escribir URLs o credenciales en `wrangler.toml`.
- [ ] Elegir una sola fuente de verdad para cambios de esquema. Recomendacion: conservar `supabase/migrations/` como historial SQL de produccion y usar Drizzle Kit para generar/verificar, pero no ejecutar cambios hasta crear un baseline revisado.
- [ ] Crear una base Supabase de desarrollo aislada y un backup verificable antes de aplicar cualquier migracion.

## Task 1: Conectividad de Base de Datos Compatible con Workers

**Files:**
- Modify: `backend/wrangler.toml`
- Modify: `backend/src/config/env.ts`
- Modify: `backend/src/db/client.ts`
- Modify: `backend/src/app.ts`
- Create: `backend/src/db/client.test.ts`
- Modify: `backend/src/app.test.ts`
- Modify: `backend/.env.example`

**Interfaces:**
- Produce `crearDb(env: Env): Database` usando `env.HYPERDRIVE.connectionString`.
- Produce un tipo Hono que exponga la base por solicitud, sin cliente PostgreSQL global.
- Produce `GET /health` con estado de aplicacion y una variante de verificacion de base segura para entornos internos.

- [ ] Escribir pruebas RED para que `crearDb` use la cadena de Hyperdrive recibida y para que la respuesta de error no revele la cadena de conexion.
- [ ] Ejecutar `bun test src/db/client.test.ts src/app.test.ts` y registrar el fallo esperado.
- [ ] Configurar el binding `HYPERDRIVE` por entorno en Wrangler, usando solo IDs de configuracion.
- [ ] Implementar `crearDb(env)` mediante el driver PostgreSQL compatible con Hyperdrive y crear la instancia dentro de la peticion o de una factoria segura.
- [ ] Inyectar la instancia de Drizzle en el contexto de Hono y eliminar el acceso de runtime a `process.env` en el Worker.
- [ ] Ejecutar de nuevo las pruebas focalizadas y confirmar GREEN.
- [ ] Ejecutar `bun run --cwd backend typecheck` y `bun run --cwd backend build`.

## Task 2: Fundaciones HTTP, Errores y Contexto

**Files:**
- Create: `backend/src/shared/errores/error-aplicacion.ts`
- Create: `backend/src/shared/errores/error-conflicto.ts`
- Create: `backend/src/shared/errores/error-no-encontrado.ts`
- Create: `backend/src/shared/errores/error-no-autorizado.ts`
- Create: `backend/src/shared/http/manejador-errores.ts`
- Create: `backend/src/shared/http/respuesta.ts`
- Create: `backend/src/shared/middleware/request-id.middleware.ts`
- Modify: `backend/src/app.ts`
- Create: `backend/src/shared/http/manejador-errores.test.ts`
- Create: `backend/src/shared/middleware/request-id.middleware.test.ts`

**Interfaces:**
- Produce errores de aplicacion independientes de Hono, con codigo, estado HTTP y detalle opcional.
- Produce respuestas compatibles con el contrato actual del proyecto.
- Produce `requestId` disponible para logs y respuestas de error.

- [ ] Escribir pruebas RED para serializar errores de dominio, errores desconocidos y request IDs entrantes/generados.
- [ ] Implementar la jerarquia minima de errores, el manejador central y el middleware.
- [ ] Registrar el middleware y `app.onError` sin cambiar paths ni formatos de rutas exitosas.
- [ ] Ejecutar las pruebas focalizadas, `bun run --cwd backend typecheck` y corregir incompatibilidades de tipos.

## Task 3: Autenticacion y Autorizacion Seguras

**Files:**
- Modify: `backend/src/shared/middleware/auth.middleware.ts`
- Modify: `backend/src/shared/middleware/role.middleware.ts`
- Modify: `backend/src/modules/admin/admin.routes.ts`
- Modify: `backend/src/modules/media/media.routes.ts`
- Create: `backend/src/shared/middleware/auth.middleware.test.ts`
- Create: `backend/src/shared/middleware/role.middleware.test.ts`

**Interfaces:**
- Produce `user` autenticado en el contexto para JWT valido o invitado permitido.
- Produce `requireRole("administrador")` que rechace antes de ejecutar handlers administrativos.
- Auth y Storage siguen usando Supabase JS; los modulos de dominio no dependen del cliente Supabase Admin.

- [ ] Escribir pruebas RED para token invalido, invitado, rol insuficiente y acceso administrativo autorizado.
- [ ] Definir la verificacion JWKS de Supabase o conservar temporalmente `auth.getUser()` solo si es compatible con Workers y esta cubierto por pruebas.
- [ ] Reactivar autenticacion y autorizacion en admin y media antes de migrar sus operaciones de escritura.
- [ ] Eliminar lecturas de `c.get("user")` en rutas sin middleware que lo garantice.
- [ ] Ejecutar las pruebas focalizadas y `bun run --cwd backend test` para distinguir fallos heredados de regresiones nuevas.

## Task 4: Reconciliacion del Esquema y Baseline de Migraciones

**Files:**
- Move: `backend/src/db/schema.ts` to `backend/src/db/schema/index.ts`
- Create: `backend/src/db/schema/usuarios.ts`
- Create: `backend/src/db/schema/contenido.ts`
- Create: `backend/src/db/schema/actividades.ts`
- Create: `backend/src/db/schema/progreso.ts`
- Create: `backend/src/db/schema/gamificacion.ts`
- Create: `backend/src/db/schema/clubes.ts`
- Create: `backend/src/db/schema/media.ts`
- Create: `backend/src/db/schema/auditoria.ts`
- Create: `backend/src/db/relaciones.ts`
- Modify: `backend/drizzle.config.ts`
- Create or modify: `supabase/migrations/<fecha>_baseline_drizzle.sql`
- Create: `backend/src/db/schema.test.ts`

**Interfaces:**
- Produce exports de tablas por dominio desde `backend/src/db/schema/index.ts`.
- Mantiene las tablas fisicas existentes; la correccion `enda` a `senda` solo cambia el nombre TypeScript exportado.
- Produce la unicidad de evento como `(usuario_id, id_evento_cliente)` y sus consultas de conflicto coherentes.

- [ ] Comparar cada tabla, columna, indice y constraint de Drizzle contra `semilla_base.sql` y las migraciones Supabase antes de editar.
- [ ] Escribir pruebas o verificaciones de esquema para `imagen_url`, fechas con zona horaria y la clave de idempotencia compuesta.
- [ ] Dividir el schema sin cambiar nombres fisicos ni lanzar migraciones destructivas.
- [ ] Crear un baseline que no intente recrear tablas existentes y probarlo exclusivamente contra la base aislada.
- [ ] Ejecutar `bun run --cwd backend db:check`, `bun run --cwd backend typecheck` y la verificacion de migracion aprobada por el equipo.

## Task 5: Composicion Modular y Migracion Piloto

**Files:**
- Modify: `backend/src/app.ts`
- Modify: `backend/src/modules/users/users.routes.ts`
- Create: `backend/src/modules/users/usuario.repository.ts`
- Create: `backend/src/modules/users/usuario.schemas.ts`
- Create: `backend/src/modules/users/casos-uso/obtener-perfil.ts`
- Create: `backend/src/modules/users/casos-uso/actualizar-perfil.ts`
- Create: `backend/src/modules/users/index.ts`
- Modify: `backend/src/modules/catalog/*`
- Modify: `backend/src/modules/sendas/*`
- Create: `backend/src/modules/users/*.test.ts`

**Interfaces:**
- Cada modulo expone una factoria `crearModulo<Nombre>(dependencias)`.
- Las rutas validan entrada y forman respuesta; no importan tablas Drizzle.
- Los repositorios reciben `Database` y filtran por `usuarioId` en la consulta.

- [ ] Escribir pruebas RED para obtener/actualizar perfil y rechazar acceso a perfiles de terceros.
- [ ] Extraer las consultas de usuarios a repositorio y las reglas a casos de uso pequenos.
- [ ] Montar el modulo mediante `app.route()` conservando las rutas actuales.
- [ ] Aplicar el mismo patron a catalogo y sendas, sin crear abstracciones compartidas que solo usen un modulo.
- [ ] Actualizar los tests que mockean la Data API para inyectar un repositorio o base simulada.
- [ ] Ejecutar pruebas de usuarios, catalogo y sendas, luego `bun run --cwd backend test`.

## Task 6: Contenido, Actividades, CMS y Media

**Files:**
- Modify: `backend/src/modules/themes/*`
- Modify: `backend/src/modules/activities/*`
- Modify: `backend/src/modules/admin/*`
- Modify: `backend/src/modules/media/*`
- Create: repositorios, schemas y casos de uso bajo cada modulo cuando falten.
- Create: pruebas de publicacion CRECER, evaluacion de actividad y autorizacion CMS.

- [ ] Escribir pruebas RED para las reglas de publicacion CRECER: titulo, senda, cita, franja disponible, seis momentos, actividad y respuestas configuradas.
- [ ] Mover lectura/publicacion de temas y evaluacion de respuestas a casos de uso y repositorios.
- [ ] No devolver respuestas correctas de quiz en endpoints de lectura publica.
- [ ] Calcular XP y puntaje en el servidor; no aceptar `xp_otorgada` como fuente de verdad del cliente.
- [ ] Mantener Supabase Storage encapsulado en el modulo media y registrar auditoria de escritura administrativa en la misma transaccion cuando corresponda.
- [ ] Ejecutar las pruebas del dominio y la suite backend completa.

## Task 7: Progreso, Gamificacion y Sincronizacion Idempotente

**Files:**
- Modify: `backend/src/modules/progress/*`
- Modify: `backend/src/modules/gamification/*`
- Modify: `backend/src/modules/sync/*`
- Create: casos de uso transaccionales para completar actividad y procesar evento de progreso.
- Create: pruebas de repeticion de eventos, rollback y autorizacion por usuario.

- [ ] Escribir pruebas RED que envien dos veces el mismo `id_evento_cliente` para el mismo usuario y que usen el mismo ID para usuarios distintos.
- [ ] Implementar transaccion que registre resultado, actualice progreso, calcule XP, verifique desbloqueos e insignias y confirme todo junto.
- [ ] Usar el conflicto compuesto `(usuario_id, id_evento_cliente)` antes de otorgar recompensas.
- [ ] Mantener `POST /sync/push` y `GET /sync/pull` compatibles con la PWA offline existente.
- [ ] Ejecutar pruebas de concurrencia e idempotencia y revisar que no se confie en XP o permisos enviados por cliente.

## Task 8: Clubes, Rate Limit, Documentacion y Verificacion Final

**Files:**
- Modify: `backend/src/modules/clubs/*`
- Create or modify: `backend/src/shared/middleware/rate-limit.middleware.ts`
- Modify: `docs/arquitectura.md`
- Modify: `docs/api.md`
- Modify: `backend/README.md`
- Modify: `backend/.env.example`
- Create: `docs/testing/backend-monolito-modular-drizzle.tdd.md`

- [ ] Escribir pruebas RED para pertenencia a club y rechazo de operaciones ajenas.
- [ ] Migrar las reglas restantes de clubes al patron modular y filtrar pertenencia en SQL.
- [ ] Agregar rate limiting para rutas de autenticacion, progreso, sync, media y administracion conforme a los bindings o servicio que el equipo apruebe.
- [ ] Documentar Hyperdrive, variables requeridas, migraciones, responsabilidades de cada capa y limites de RLS con Drizzle directo.
- [ ] Ejecutar `bun run check`, `bun run build`, `bun run --cwd backend test` y la auditoria de secretos.
- [ ] Generar el informe TDD con evidencia RED/GREEN real, cobertura y brechas conocidas.

## Matriz de Riesgos

| Nivel | Riesgo | Mitigacion |
|---|---|---|
| Alto | Secretos `service_role` expuestos | Rotar, eliminar scripts con secretos y verificar el historial antes de desplegar. |
| Alto | Migracion destructiva sobre tablas existentes | Baseline, backup y ejecucion exclusiva en una base aislada antes de produccion. |
| Alto | RLS no se aplica automaticamente con Drizzle directo | JWT validado en Hono, rol/propiedad en caso de uso y filtro por usuario/club en SQL. |
| Alto | Conexiones PostgreSQL incompatibles con Workers | Hyperdrive y factoria de DB basada en bindings; nunca cliente global dependiente de `process.env`. |
| Medio | Contrato HTTP roto durante refactor | Pruebas de integracion por endpoint y conservacion de paths/respuestas. |
| Medio | Eventos duplicados otorgan recompensas repetidas | Constraint compuesto, `onConflict` correcto y transaccion. |
| Medio | Tests obsoletos por mocks de Supabase | Reemplazar por inyeccion de repositorios/Drizzle y mantener pruebas HTTP. |
| Bajo | Exceso de archivos por Clean Architecture | Crear capas solo cuando una regla o consulta lo justifique; un caso de uso por operacion significativa. |

## Criterios de Aceptacion

- El Worker obtiene su conexion de base desde un binding de Hyperdrive y no desde secretos o `process.env` de runtime.
- Ninguna ruta contiene consultas Drizzle directas tras migrar su modulo.
- Ningun repositorio depende de `Context` de Hono ni genera respuestas HTTP.
- Auth, roles y propiedad se prueban en todas las rutas privadas, administrativas y de clubes.
- El cliente no puede asignar XP, respuestas correctas ni privilegios.
- Los eventos de progreso son idempotentes por usuario e ID de evento de cliente.
- Las migraciones se verifican contra una base de desarrollo antes de tocar produccion.
- `bun run check`, `bun run build` y la suite backend pasan, con cobertura nueva de al menos 80%.
