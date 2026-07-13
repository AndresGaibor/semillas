# Plan de implementación: rediseño editorial de actividades

> **Para agentes:** usar `subagent-driven-development` o `executing-plans` y completar los pasos por tarea.

**Objetivo:** convertir la biblioteca y el editor de actividades del CMS en interfaces editoriales, responsivas y accesibles sin cambiar APIs.

**Arquitectura:** se conservan rutas, hooks y contratos de `activity-configuration.ts`. Los constructores de configuración se extraen a un componente pequeño que recibe y devuelve objetos inmutables; la ruta mantiene fetch, mutaciones y navegación.

**Tecnologías:** React 19, TypeScript estricto, TanStack Router/Query, Bun Test, Tailwind y CSS del CMS.

## Restricciones globales

- No cambiar backend ni contratos HTTP.
- No introducir `any`.
- No modificar cambios ajenos de clubes o temas ni hacer commits.
- Mantener los contratos de `normalizarConfiguracionActividad` y `validarActividadParaGuardar`.

### Tarea 1: Constructores visuales de configuración

**Archivos:**
- Crear: `frontend/src/features/admin/componentes/activity-type-config-builder.tsx`
- Crear: `frontend/src/features/admin/componentes/activity-type-config-builder.test.tsx`
- Modificar: `frontend/src/routes/admin.temas.$themeId.activities.tsx`

- [ ] Escribir pruebas de render para filas de afirmaciones, pares, secuencias, manualidad, flashcards y canción.
- [ ] Implementar constructores que emitan `afirmaciones`, `pares`, `items`/`orden_correcto`, `materiales`/`pasos`, tarjetas `{ id, texto }`, y `letra`/`acciones`.
- [ ] Sustituir editores separados por `|`; dejar video, audio, completar versículo, sopa, rompecabezas y aventura guiados.
- [ ] Ejecutar `bun test src/features/admin/componentes/activity-type-config-builder.test.tsx`.

### Tarea 2: Estudio de actividades y accesibilidad

**Archivos:**
- Modificar: `frontend/src/routes/admin.temas.$themeId.activities.tsx`
- Modificar: `frontend/src/routes/admin-content-studio.css`

- [ ] Dividir el formulario en contexto, contenido, experiencia y configuración de tipo.
- [ ] Mover JSON a `<details>` para expertos y sincronizarlo con el estado visual al guardar.
- [ ] Convertir el panel lateral en sticky real de escritorio y añadir una barra de guardado fija segura en móvil.
- [ ] Añadir etiquetas ARIA para volver, cerrar, subir, bajar, editar, duplicar y eliminar.

### Tarea 3: Biblioteca y diálogo de creación

**Archivos:**
- Modificar: `frontend/src/features/admin/componentes/admin-activities-header.tsx`
- Modificar: `frontend/src/features/admin/componentes/admin-activities-filters.tsx`
- Modificar: `frontend/src/features/admin/componentes/admin-activities-table.tsx`
- Modificar: `frontend/src/features/admin/componentes/activity-table-row.tsx`
- Modificar: `frontend/src/features/admin/componentes/nueva-actividad-dialog.tsx`
- Crear: `frontend/src/features/admin/componentes/nueva-actividad-dialog.test.tsx`

- [ ] Eliminar el selector de orden que no cambia resultados y presentar tabla como tarjetas legibles en móvil.
- [ ] Actualizar cabecera, filtros y CTA sin cambiar la navegación.
- [ ] Consultar temas en estados `borrador`, `revision` y `publicado` con la firma actual de API.
- [ ] Implementar diálogo semántico, Escape, backdrop y devolución razonable de foco.
- [ ] Ejecutar las pruebas focales del diálogo y del constructor.

### Tarea 4: Verificación

**Archivos:** los anteriores.

- [ ] Ejecutar `bun test src/features/admin/componentes/activity-configuration.test.ts src/features/admin/componentes/activity-type-config-builder.test.tsx src/features/admin/componentes/nueva-actividad-dialog.test.tsx`.
- [ ] Ejecutar `bun run typecheck` en `frontend`.
- [ ] Ejecutar `bun run build` en `frontend`.
