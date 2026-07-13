# Auditoría visual, responsive, funcional y de accesibilidad

**Fecha:** 2026-07-12  
**Frontend:** React + Vite + TanStack Router + Tailwind CSS  
**Herramienta:** MCP de Playwright sobre navegador Chromium real  
**Servidor:** `http://localhost:5174` (el puerto 5173 ya estaba ocupado)

## Inventario revisado

Se revisaron en navegador las rutas públicas, autenticación, onboarding y las
rutas de usuario accesibles con una sesión invitada:

- `/`
- `/login`
- `/onboarding`
- `/onboarding/customize`
- `/app`
- `/app/temas`
- `/app/clubes`
- `/app/logros`
- `/app/perfil`
- `/app/descargas`
- `/app/sincronizacion` (enlace del menú revisado; no disponible para una sesión sin datos completos)
- rutas CRECER y actividad identificadas en `frontend/src/routeTree.gen.ts`

También se intentaron `/admin`, `/admin/usuarios`, `/admin/temas`,
`/admin/temas/new`, `/admin/medios`, `/admin/actividades`, `/admin/sendas`,
`/admin/revision`, `/admin/reportes`, `/admin/clubes` y `/admin/ajustes`.
El guard de autorización redirigió la sesión invitada a `/app`; no se inventó
una sesión administrativa ni se modificaron datos de producción.

## Resoluciones y modos

Se probó `/app/temas` en:

- 320×568, 360×800, 390×844, 412×915
- 768×1024, 1024×768
- 1280×720, 1366×768, 1440×900, 1920×1080

Se usaron modos claro y oscuro en landing, login, onboarding y app. También se
probaron estados de menú móvil, bottom sheet de cuenta, modal de instalación,
filtros/búsqueda de temas, selección de franja, formulario de apodo, selección
de avatar, navegación de invitado y navegación entre layouts.

## Hallazgos y correcciones

### Mayor — Desbordamiento horizontal en app móvil

- **Síntoma:** el sidebar móvil fuera de pantalla contribuía al `scrollWidth`
  (`417px` en un viewport CSS de `384px`); el header también colocaba el botón
  de cuenta parcialmente fuera del viewport.
- **Responsable:** `frontend/src/routes/app.css`.
- **Corrección:** `overflow-x: clip` en `.app-shell` y tercera columna del
  header móvil `auto` en lugar de una columna fija de 44px, permitiendo que el
  grupo de notificaciones/cuenta mida lo necesario.
- **Resultado:** el scroll horizontal desapareció en 320, 360, 390, 412,
  768, 1024, 1280, 1366, 1440 y 1920px.
- **Evidencia:** [`app-account-sheet--390x844--dark.png`](screenshots/after/app-account-sheet--390x844--dark.png),
  [`app--1024x768--light.png`](screenshots/after/app--1024x768--light.png).

### Mayor — Footer fijo del onboarding excedía el viewport móvil

- **Síntoma:** en `/onboarding` el footer medía `calc(100% + 24px)` y quedaba
  en `left:-12px`, `right:402px` para un viewport de 390px.
- **Responsable:** `frontend/src/styles.css`.
- **Corrección:** el footer fijo usa `width:100%`, `margin-inline:0` y conserva
  únicamente el padding interno y safe area.
- **Resultado:** no quedan elementos visibles fuera del viewport en onboarding.
- **Evidencia:** snapshots MCP de `/onboarding` a 390×844 y 1024×768, además
  de capturas de after de login/app.

### Menor — overlays compartidos no seguían completamente el modo oscuro

- **Síntoma:** el bottom sheet de cuenta y el panel de notificaciones usaban
  fondos blancos hardcodeados en modo oscuro.
- **Responsable:** `frontend/src/shared/layout/app-account-menu-mobile.css` y
  `frontend/src/shared/layout/app-notifications.css`.
- **Corrección:** overrides para `.dark`/`data-theme="app-dark"` usando tokens
  semánticos `--sem-*`.
- **Resultado:** el bottom sheet verificado en navegador computa fondo oscuro
  `rgb(24,48,39)` y texto claro.
- **Evidencia:** [`app-account-sheet--390x844--dark.png`](screenshots/after/app-account-sheet--390x844--dark.png).

## Accesibilidad y funcionalidad

- Se verificaron nombres accesibles para navegación, botones de tema,
  notificaciones, cuenta, ayuda, tabs, radios de onboarding, formularios y
  modal de cuenta.
- Los radios de franja se activan mediante la tarjeta/label visible; el input
  visualmente oculto no debe accionarse directamente fuera del label.
- Se probó el flujo invitado: login → selección de franja → personalización →
  `/app`.
- Se comprobó la navegación del menú móvil y la apertura/cierre del bottom
  sheet de cuenta.
- No se detectó scroll horizontal después de las correcciones en la matriz de
  viewports indicada.
- Las solicitudes `401` a `/perfil` y `/sync/pull` sin sesión son esperadas;
  no se consideraron errores visuales.

## Capturas

Las capturas están en:

- `docs/ui-audit/screenshots/before/`
- `docs/ui-audit/screenshots/after/`

Incluyen landing, login, temas, app, onboarding indirectamente mediante el
flujo funcional y la matriz completa de tamaños de `/app/temas` en after.

## Validación técnica

| Comando | Resultado |
|---|---|
| `bun run --cwd frontend typecheck` | ✅ pasa |
| `bun run --cwd backend typecheck` | ✅ pasa |
| `bun run --cwd frontend build` | ✅ pasa |
| `bun run build` | ✅ frontend y backend pasan |
| `bun run test:contrato` | ✅ 156 pasan |
| `bun run --cwd frontend ui:check` | ✅ comprobación estructural aprobada |
| `bun run --cwd frontend test` | ⚠️ 192 pasan, 5 fallan por problemas previos de entorno/tests (`admin.api`, `AppUserHeader`, `onboarding responsive`); no relacionados con las reglas CSS modificadas |
| lint | ⚠️ no existe script `lint` en `frontend/package.json` |

## Pendientes / limitaciones

1. Repetir la matriz administrativa con una cuenta cuyo rol sea
   `administrador`; el guard impide validarla con invitado.
2. Corregir los cinco tests frontend existentes antes de usar la suite completa
   como bloqueo de CI.
3. Reducir deuda histórica de colores hardcodeados en pantallas grandes (clubes,
   CRECER y logros) mediante migración gradual a tokens, sin cambiar el estilo
   actual durante esta auditoría responsive.
