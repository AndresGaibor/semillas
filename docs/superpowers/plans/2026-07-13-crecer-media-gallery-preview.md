# CRECER Media Gallery Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mejorar la selección y carga de recursos CRECER con previsualizaciones reproducibles, un visor de imágenes accesible y una interfaz responsive.

**Architecture:** `MediaGalleryDialog` conservará sus props públicas y añadirá estado local para el archivo seleccionado, el recurso previsualizado y el visor de imagen. `MediaSlot` seguirá siendo una unidad de presentación del editor CRECER, pero diferenciará visualmente el estado vacío sin truncar su contenido.

**Tech Stack:** React, TypeScript, Tailwind CSS, Bun Test, React DOM Server.

## Global Constraints

- No modificar `/app`.
- Conservar `titulo` y `texto_alternativo` actuales; no crear migraciones.
- Mantener `MediaGalleryDialogProps` y los contratos de subida existentes.
- Usar Bun para pruebas y typecheck.
- No crear commits.

---

### Task 1: Previews y visor en la galería

**Files:**
- Modify: `frontend/src/features/admin/componentes/media-gallery-dialog.tsx`
- Test: `frontend/src/features/admin/componentes/media-gallery-dialog.test.tsx`

**Interfaces:**
- Consumes: `RecursoMultimedia`, `onUpload(file, { titulo, textoAlternativo })`.
- Produces: previsualización local o remota según tipo y visor de imágenes cerrable con botón o `Escape`.

- [ ] **Step 1: Write the failing test**

```tsx
expect(html).toContain("Previsualización del archivo");
expect(html).toContain('controls=""');
expect(html).toContain("Ampliar imagen");
expect(html).toContain('z-[100]');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test frontend/src/features/admin/componentes/media-gallery-dialog.test.tsx`
Expected: FAIL because the current dialog has no preview area or image viewer.

- [ ] **Step 3: Write minimal implementation**

```tsx
const [resourcePreview, setResourcePreview] = useState<RecursoMultimedia | null>(null);
const [expandedImageUrl, setExpandedImageUrl] = useState<string | null>(null);
const localPreviewUrl = file ? URL.createObjectURL(file) : null;

{resourcePreview ? <MediaPreview resource={resourcePreview} onExpand={setExpandedImageUrl} /> : null}
{expandedImageUrl ? <ImageViewer url={expandedImageUrl} onClose={() => setExpandedImageUrl(null)} /> : null}
```

Render metadata fields and the upload action only when `file` exists; revoke the object URL when it changes or the dialog closes. Use `img` with a labelled enlarge button, and native `video`/`audio` `controls`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test frontend/src/features/admin/componentes/media-gallery-dialog.test.tsx`
Expected: PASS.

### Task 2: Layout responsive y estados vacíos CRECER

**Files:**
- Modify: `frontend/src/features/admin/componentes/crecer-content-editor.tsx`
- Modify: `frontend/src/features/admin/componentes/media-gallery-dialog.tsx`
- Test: `frontend/src/features/admin/componentes/media-gallery-dialog.test.tsx`

**Interfaces:**
- Consumes: `MediaSlot` props existentes.
- Produces: tarjetas vacías con título, descripción y acción legibles; tarjetas de galería sin truncamiento opaco.

- [ ] **Step 1: Write the failing test**

```tsx
expect(html).toContain("Selecciona una imagen o video");
expect(html).not.toContain("truncate");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test frontend/src/features/admin/componentes/media-gallery-dialog.test.tsx`
Expected: FAIL because the current markup truncates resource titles and always renders upload metadata.

- [ ] **Step 3: Write minimal implementation**

```tsx
<div className="admin-media-slot__content">
  <strong>{resource?.titulo ?? emptyText}</strong>
  <small>{resource ? metadata : emptyDescription}</small>
  <button type="button" onClick={onChoose}>Elegir recurso</button>
</div>
```

Use responsive single-column layout for the gallery upload panel below its resource browser on narrow screens. Permit titles to wrap and expose full title through `title` where a compact card needs line clamping.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test frontend/src/features/admin/componentes/media-gallery-dialog.test.tsx`
Expected: PASS.

### Task 3: Full verification

**Files:**
- Modify: only files changed in Tasks 1-2.

- [ ] **Step 1: Run focused tests**

Run: `bun test frontend/src/features/admin/componentes/media-gallery-dialog.test.tsx`
Expected: PASS.

- [ ] **Step 2: Run frontend typecheck**

Run: `bun run check`
Expected: exit code 0.

- [ ] **Step 3: Run frontend build**

Run: `bun run build`
Expected: exit code 0.
