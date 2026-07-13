# Editor CRECER MDX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans task-by-task.

**Goal:** Sustituir el textarea CRECER por MDXEditor y corregir el guardado de Markdown.

**Architecture:** `EditorMarkdown` encapsula MDXEditor y sincroniza documentos externos con `setMarkdown`. El hook CRECER mantiene el Markdown y valida con los mismos límites del backend; las imágenes reutilizan Medios autenticados.

**Tech Stack:** Bun, React, TypeScript, MDXEditor, TanStack Query, Zod, Supabase Storage.

## Global Constraints

- Usar Bun y `bun add @mdxeditor/editor`.
- Persistir Markdown en `contenido_paso_tema.cuerpo`.
- Reutilizar `subirArchivo` y `obtenerUrlFirmadaRecurso`; no añadir R2.
- No modificar el flujo offline de `/app`.

### Task 1: Validación y editor Markdown

**Files:**
- Create: `frontend/src/features/admin/componentes/editor-markdown.tsx`
- Create: `frontend/src/features/admin/componentes/editor-markdown.test.tsx`
- Modify: `frontend/src/features/admin/componentes/crecer-content-editor.tsx`
- Modify: `frontend/src/features/admin/hooks/use-theme-crecer-page.ts`

- [ ] Escribir pruebas rojas para título de menos de 2 caracteres, cuerpo de menos de 5, y reemplazo de Markdown al cambiar contenido.
- [ ] Ejecutar `bun test src/features/admin/componentes/editor-markdown.test.tsx` y confirmar fallo.
- [ ] Instalar `@mdxeditor/editor` con `bun add @mdxeditor/editor` desde `frontend`.
- [ ] Implementar `EditorMarkdown` con `headingsPlugin`, `listsPlugin`, `linkPlugin`, `linkDialogPlugin`, `imagePlugin`, `tablePlugin`, `markdownShortcutPlugin` y toolbar con UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, ListsToggle, CreateLink, InsertImage e InsertTable.
- [ ] Exponer `markdown`, `onChange`, `onSubirImagen`; usar `MDXEditorMethods.setMarkdown(markdown)` al cambiar el prop.
- [ ] En `use-theme-crecer-page.ts`, validar `titulo.trim().length >= 2`, `titulo.trim().length <= 120` y `body.trim().length >= 5` antes de `guardarParlante`.
- [ ] Ejecutar pruebas focalizadas y typecheck frontend.

### Task 2: Imágenes firmadas y verificación de guardado

**Files:**
- Modify: `frontend/src/features/admin/componentes/crecer-content-editor.tsx`
- Modify: `frontend/src/features/admin/hooks/use-theme-crecer-page.ts`
- Test: `frontend/src/features/admin/hooks/use-theme-crecer-page.test.ts`

- [ ] Escribir prueba roja que suba una imagen, obtenga URL firmada e inserte Markdown; otra que propague error de subida sin modificar el cuerpo.
- [ ] Ejecutar la prueba y confirmar fallo.
- [ ] Implementar handler: `subirArchivo(file, "imagen")`, después `obtenerUrlFirmadaRecurso(recurso.id)`, y retornar la URL firmada a MDXEditor.
- [ ] Mantener `datos_extra: { formato: "markdown", actualizado_desde: "admin" }` en payload.
- [ ] Ejecutar pruebas focalizadas, `bun run typecheck` y `bun run build`; documentar fallos existentes ajenos con ruta exacta.

## Self-Review

- La Task 1 cubre edición visual, sincronización y validación de guardado.
- La Task 2 cubre imágenes privadas y el payload compatible.
- No se agregan storage, schemas ni formatos alternativos.
