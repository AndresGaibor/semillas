# Estado UI/UX de Semillas — 2026-07-12

## Fuente de verdad

Este documento registra la línea base de `SEMILLAS_UI_UX_IMPLEMENTATION_SPEC.md` y
`semillas-uiux-verification-manifest.json`. La aplicación actual mantiene sus rutas
existentes y usa adaptadores temporales cuando una migración de nombres podría romper
enlaces o imports guardados.

## Métricas de línea base

- 656 archivos TS/TSX en `src`.
- 125 historias Storybook.
- 309 componentes visuales detectados; 289 cubiertos en la auditoría inicial.
- 20 componentes sin historia en la línea base.
- 2.200 ocurrencias de colores hex y 470 valores hex únicos.
- `frontend/src/routes/app.css`: 2.645 líneas en la auditoría inicial.
- Archivo TSX mayor: `frontend/src/features/clubes/componentes/clubes-page.tsx`.

## Decisiones F0

- `Boton`, `Card`, `FormField` e `Input` son las primitivas canónicas.
- `button.tsx`, `card-shadcn.tsx` y `campo-formulario.tsx` quedan como adaptadores
  `@deprecated`; no se crea una tercera implementación.
- Los tokens semánticos `--sem-*` viven en `frontend/src/estilos.css`.
- `frontend/src/styles.css` continúa siendo la entrada Tailwind y consume los tokens.
- Se conserva el fondo blanco global actual por compatibilidad visual solicitada;
  `--sem-surface-page` sigue disponible para nuevas superficies semánticas.

## Pendientes

- Dividir las pantallas grandes de sincronización y clubes.
- Completar las historias Storybook restantes.
- Migrar gradualmente colores/radios de hojas de ruta sin romper clases existentes.
- Ejecutar la matriz completa de rutas en los viewports definidos por la especificación.
