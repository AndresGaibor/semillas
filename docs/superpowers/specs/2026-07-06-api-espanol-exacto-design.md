# API 100% en Español

## Objetivo
Alinear toda la superficie pública de la API con `semilla_base.sql` como contrato canónico exacto, sin alias legacy ni nombres públicos en inglés.

## Contexto
La base de datos ya define el lenguaje de dominio en español. El backend, los ejemplos HTTP, la OpenAPI y parte del frontend todavía mezclan nombres heredados en inglés o híbridos. Esa mezcla rompe la consistencia del contrato y complica el consumo de la API.

## Alcance
- Rutas públicas en español.
- Query params en español.
- Bodies de request en español.
- Respuestas JSON en español.
- Tipos públicos en español.
- OpenAPI/Scalar en español.
- Ejemplos HTTP y documentación en español.
- Tests que confirmen que no existen rutas legacy.

## Reglas del contrato
- No habrá aliases legacy.
- No habrá nombres públicos híbridos.
- Los nombres visibles deben coincidir con el lenguaje del seed.
- Las respuestas deben usar claves en español.
- Los nombres internos de la base ya se consideran correctos y no se traducen porque ya son el contrato canónico.

## Convenciones públicas
- `exito` para indicar resultado exitoso.
- `datos` para payload principal.
- `error` para mensaje legible.
- `codigo` para error máquina.
- `grupo_edad_id`, `senda_id`, `tema_id`, `paso_id`, `actividad_id`, `usuario_id`, `evento_id_cliente` para claves de dominio.
- `nombre_visible`, `apodo`, `url_avatar`, `tipo_evento`, `xp_otorgada`, `puntaje`, `correcta`, `estado`, `publicado_en` para datos de dominio.

## Forma esperada de respuestas
```json
{ "exito": true, "datos": {} }
{ "exito": false, "error": "Mensaje legible", "codigo": "VALIDACION" }
```

## Superficie a migrar
### Auth
- `POST /autenticacion/invitado`
- `POST /autenticacion/configuracion-dev`
- Respuesta con `usuario`, `perfil` y `autenticacion`.

### Catálogo
- `GET /catalogo/grupos-etarios`
- `GET /catalogo/tipos-actividad`
- `GET /catalogo/versiones-biblicas`
- `GET /catalogo/pasos-crecer`

### Perfil
- `GET /perfil`
- `PATCH /perfil/actualizar`

### Sendas y temas
- `GET /sendas`
- `GET /temas`
- `GET /temas/:tema_id`
- `GET /temas/:tema_id/pasos`
- `GET /temas/:tema_id/actividades`

### Actividades
- `GET /actividades/:actividad_id`
- `POST /actividades/:actividad_id/responder`

### Progreso
- `GET /progreso/mi`
- `POST /progreso/eventos`

### Administración
- `GET /administracion/resumen`
- `POST /administracion/temas`
- `PATCH /administracion/temas/:tema_id`
- `POST /administracion/temas/:tema_id/publicar`
- `POST /administracion/actividades`

### Gamificación
- `GET /gamificacion/mi`

## Nombres públicos canónicos
| Clave canónica       | Propósito                     |
|----------------------|-------------------------------|
| `nombre_visible`     | Nombre para mostrar           |
| `apodo`              | Apodo del usuario             |
| `proveedor`          | Proveedor de autenticación    |
| `rol`                | Rol del usuario               |
| `tema_id`            | Identificador de tema         |
| `paso_id`            | Identificador de paso CRECER  |
| `actividad_id`       | Identificador de actividad    |
| `grupo_edad_id`      | Identificador de franja etaria|
| `senda_id`           | Identificador de senda        |
| `autenticacion`      | Objeto de autenticación       |
| `evento_id_cliente`  | ID idempotente del evento     |
| `tipo_evento`        | Tipo de evento de progreso    |
| `xp_otorgada`        | XP ganada en una acción       |

## Criterios de aceptación
- Ningún endpoint legacy responde con contenido útil.
- Ningún JSON público expone claves en inglés cuando existe un nombre canónico en español.
- OpenAPI refleja exactamente el contrato en español.
- El frontend consume y muestra el contrato en español sin adaptaciones mixtas.
- `bun run typecheck` y pruebas relevantes pasan.

## Fuera de alcance
- Renombrar tablas físicas de la base.
- Introducir compatibilidad temporal con el contrato viejo.
- Agregar nuevas features de producto.
