# Modularización frontend, Tailwind CSS y modo oscuro — Semillas

## Alcance aplicado

Este parche establece la base canónica para completar la migración del frontend a Tailwind CSS sin mantener lógica de tema duplicada en rutas o componentes.

### Cambios incluidos

- Se crea `frontend/src/shared/theme/` con módulos separados para tipos, persistencia, DOM y provider React.
- Se unifican las preferencias en `semillas-pref-tema` con valores `sistema`, `claro` y `oscuro`.
- Se elimina el contrato paralelo `app-theme/admin-theme` y los valores `app-dark/admin-dark` del botón de tema.
- Se aplica el tema antes de montar React para evitar flash de tema incorrecto.
- Se añade `ThemeProvider` a la aplicación y Storybook.
- Sonner recibe el tema resuelto real.
- `BotonTemaToggle` pasa de CSS local a clases Tailwind, incluye 44px mínimos, foco visible y `aria-pressed`.
- El formulario de preferencias consume el provider en vez de modificar el DOM por su cuenta.
- Se incorporan tokens semánticos claros/oscuros y variante `dark:` de Tailwind 4.
- Se restaura el foco visible global; el código anterior lo anulaba con `!important`.
- Se incorpora soporte global para `prefers-reduced-motion`.

## Importante sobre la migración de CSS

El proyecto auditado contiene 15 archivos CSS y varios miles de selectores. El parche no elimina a ciegas esos archivos porque hacerlo rompería pantallas que aún usan clases BEM. Deja una base estable para migrarlos componente por componente a Tailwind.

Los CSS de compatibilidad todavía pendientes son:

- `src/estilos.css`
- `src/landing.css`
- `src/routes/app.css`
- `src/routes/admin-content-studio.css`
- `src/routes/app-descargas.css`
- `src/routes/app-logros.css`
- `src/routes/app-perfil.css`
- `src/routes/app-temas.css`
- `src/routes/login.css`
- `src/routes/onboarding-customize.css`
- `src/routes/theme-detail.css`
- `src/features/clubes/componentes/clubes-page.css`
- `src/features/crecer/componentes/crecer-focus.css`
- `src/shared/layout/app-account-menu-mobile.css`
- `src/shared/layout/app-notifications.css`

`src/styles.css` debe permanecer como entrada de Tailwind 4, tokens y reglas base. “Sin CSS” debe interpretarse como **sin hojas CSS por componente/ruta**, no como eliminar la entrada requerida por Tailwind.

## Orden recomendado para terminar la migración

1. Primitivas UI y shells compartidos.
2. Login, onboarding y páginas públicas.
3. Shell `/app`, navegación y home.
4. Temas, detalle y CRECER.
5. Perfil, logros, descargas y clubes.
6. Administración.
7. Eliminar cada import CSS únicamente cuando sus selectores tengan reemplazo Tailwind y Storybook pase.

## Comandos de validación

```bash
cd frontend
bun install
bun run typecheck
bun run test
bun run build
bun run storybook:check
```

También se recomienda buscar contratos antiguos:

```bash
rg 'app-dark|admin-dark|app-theme|admin-theme|data-theme="app' src
rg 'import .*\.css' src --glob '*.tsx' --glob '*.ts'
```

## Criterios de aceptación de este parche

- Una sola fuente de verdad para el tema.
- La selección `sistema` responde a cambios del sistema operativo.
- La selección manual claro/oscuro no cambia al variar el sistema.
- No hay flash blanco al cargar una preferencia oscura persistida.
- Storybook puede renderizar componentes que usan `useTheme`.
- El botón de tema funciona en rutas públicas, app y admin sin claves separadas.
- El foco de teclado es visible.
- Reduced motion reduce animaciones y transiciones.
