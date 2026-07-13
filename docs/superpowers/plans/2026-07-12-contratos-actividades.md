# Contratos de actividades: plan de implementación

> **Para agentes:** ejecutar con pruebas focales antes y después de los cambios; no crear commits para esta tarea.

**Objetivo:** Corregir los contratos bloqueantes de normalización, validación y entrada JSON del editor de actividades.

**Arquitectura:** Centralizar la comprobación de permutaciones en la utilidad de contratos para que normalización y validación apliquen la misma regla. La ruta solo admite objetos planos ya parseados y restablece el borrador de forma inmutable al cambiar de tipo.

**Tecnologías:** TypeScript estricto, Bun Test, React.

## Restricciones globales

- No editar archivos de clubes ni temas ajenos.
- No introducir `any`.
- No crear commits.

### Tarea 1: Contratos de configuración

**Archivos:**
- Modificar: `frontend/src/features/admin/componentes/activity-configuration.test.ts`
- Modificar: `frontend/src/features/admin/componentes/activity-configuration.ts`

- [ ] Añadir RED para letra de canción no textual, acciones no textuales y eliminación de líneas vacías.
- [ ] Ejecutar `bun test src/features/admin/componentes/activity-configuration.test.ts` desde `frontend` y comprobar el fallo intencional.
- [ ] Implementar la comprobación de permutación y las validaciones solicitadas.
- [ ] Ejecutar de nuevo la prueba focal y comprobar que pasa.

### Tarea 2: Entrada y transición del editor

**Archivos:**
- Modificar: `frontend/src/routes/admin.temas.$themeId.activities.tsx`

- [ ] Rechazar JSON avanzado cuya raíz no sea un objeto plano.
- [ ] Al cambiar tipo, vaciar opciones fuera de `cuestionario` y conservar el conjunto por defecto para `cuestionario`.
- [ ] Ejecutar `bun run typecheck` desde `frontend`.
