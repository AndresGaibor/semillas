# Recuperacion de sesion y pantallas de error Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolver conflictos OAuth sin bloquear al invitado y proporcionar pantallas globales profesionales para carga, acceso denegado, errores y rutas inexistentes.

**Architecture:** El bootstrap detecta el conflicto HTTP 409 y lo persiste como un evento efimero. `AppLayout` consume ese evento exclusivamente en `/app/*` y muestra un dialogo mediante portal a `document.body`, por encima de todo el shell. TanStack Router recibe componentes globales de 404 y error; las pantallas comparten un componente visual liviano y no exponen detalles tecnicos.

**Tech Stack:** React, TypeScript, TanStack Router, Tailwind CSS, Lucide React, Supabase Auth, Bun Test.

## Global Constraints

- No mostrar correos sin enmascarar; el backend debe seguir devolviendo el correo oculto.
- Reconocer el conflicto por estado HTTP `409`, no por coincidencias de texto.
- El dialogo se presenta solo para URLs cuyo pathname sea `/app` o comience por `/app/`.
- Al continuar como invitado se conserva la sesion invitada y se cierra solo la sesion OAuth.
- El dialogo no se cierra al pulsar backdrop ni permite interactuar con el layout de fondo.
- No modificar ni revertir cambios ajenos del worktree.

---

## File Structure

- Create: `frontend/src/shared/api/error-api.ts` — Error tipado que conserva estado HTTP y codigo API.
- Create: `frontend/src/shared/auth/conflicto-vinculacion.ts` — Evento efimero, funciones para publicar, consumir y descartar un conflicto OAuth.
- Create: `frontend/src/componentes/estados/pantalla-estado.tsx` — Base visual compartida para carga, 403, 404 y error.
- Create: `frontend/src/componentes/estados/pantalla-carga-sesion.tsx` — Estado profesional mientras se restaura Supabase.
- Create: `frontend/src/componentes/estados/pantalla-no-encontrado.tsx` — Pantalla 404 sensible a sesion.
- Create: `frontend/src/componentes/estados/pantalla-acceso-denegado.tsx` — Pantalla 403 con recuperacion segura.
- Create: `frontend/src/componentes/estados/pantalla-error-ruta.tsx` — Error boundary global de TanStack Router.
- Modify: `frontend/src/shared/api/api.ts` — Lanzar `ErrorApi` con `estado`, `codigo` y mensaje.
- Modify: `frontend/src/app/providers.tsx` — Publicar conflicto 409; usar `PantallaCargaSesion`; no renderizar el dialogo globalmente.
- Modify: `frontend/src/routes/app.tsx` — Consumir conflicto, montar dialogo via portal y ejecutar sus acciones.
- Modify: `frontend/src/componentes/ui/dialogo-conflicto-vinculacion.tsx` — Dialogo accesible, portal, foco, overlay opaco y acciones.
- Modify: `frontend/src/routes/__root.tsx` — Registrar 404 global.
- Modify: `frontend/src/router.tsx` — Registrar error boundary global.
- Modify: `frontend/src/routes/admin.tsx` — Redirigir falta de permisos a la pantalla 403 en vez de `/app`.

## Task 1: Error API tipado y evento de conflicto

**Files:**
- Create: `frontend/src/shared/api/error-api.ts`
- Create: `frontend/src/shared/auth/conflicto-vinculacion.ts`
- Modify: `frontend/src/shared/api/api.ts:1-38`
- Test: `frontend/src/shared/api/api.test.ts`
- Test: `frontend/src/shared/auth/conflicto-vinculacion.test.ts`

**Interfaces:**
- Produces `ErrorApi extends Error` con `estado: number` y `codigo: string | undefined`.
- Produces `publicarConflictoVinculacion(mensaje: string): void`, `consumirConflictoVinculacion(): string | null`, `descartarConflictoVinculacion(): void`.

- [ ] **Step 1: Escribir pruebas fallidas para preservar el 409 y consumir el evento una sola vez.**

```ts
expect(error).toBeInstanceOf(ErrorApi)
expect((error as ErrorApi).estado).toBe(409)
publicarConflictoVinculacion("El correo an***@gmail.com ya pertenece a otra cuenta")
expect(consumirConflictoVinculacion()).toContain("an***@gmail.com")
expect(consumirConflictoVinculacion()).toBeNull()
```

- [ ] **Step 2: Ejecutar las pruebas y confirmar que fallan.**

Run: `bun test frontend/src/shared/api/api.test.ts frontend/src/shared/auth/conflicto-vinculacion.test.ts`

Expected: FAIL porque `ErrorApi` y el evento no existen.

- [ ] **Step 3: Implementar el error tipado y el almacenamiento de un solo consumo.**

```ts
export class ErrorApi extends Error {
  constructor(message: string, public readonly estado: number, public readonly codigo?: string) {
    super(message)
    this.name = "ErrorApi"
  }
}

const CLAVE_CONFLICTO = "semillas_conflicto_vinculacion"

export function publicarConflictoVinculacion(mensaje: string) {
  sessionStorage.setItem(CLAVE_CONFLICTO, mensaje)
  window.dispatchEvent(new Event("semillas:conflicto-vinculacion"))
}
```

En `peticion`, sustituir `throw new Error(...)` por `throw new ErrorApi(resultado?.error ?? "Error de conexion", res.status, resultado?.codigo)`.

- [ ] **Step 4: Ejecutar las pruebas y confirmar que pasan.**

Run: `bun test frontend/src/shared/api/api.test.ts frontend/src/shared/auth/conflicto-vinculacion.test.ts`

Expected: PASS.

## Task 2: Bootstrap de sesion y acciones de recuperacion

**Files:**
- Modify: `frontend/src/app/providers.tsx:1-122`
- Create: `frontend/src/componentes/estados/pantalla-carga-sesion.tsx`
- Test: `frontend/src/app/providers.test.tsx`

**Interfaces:**
- Consumes `ErrorApi`, `publicarConflictoVinculacion` y `PantallaCargaSesion`.
- Produces: el bootstrap publica el conflicto solo cuando `error.estado === 409`, sin borrar la sesion invitada.

- [ ] **Step 1: Escribir la prueba fallida de un conflicto 409.**

```tsx
await esperarBootstrapConError(new ErrorApi("correo en uso", 409, "CONFLICTO"))
expect(publicarConflictoVinculacion).toHaveBeenCalledWith("correo en uso")
expect(sessionStorageApi.clearGuestSession).not.toHaveBeenCalled()
```

- [ ] **Step 2: Ejecutar la prueba y confirmar que falla.**

Run: `bun test frontend/src/app/providers.test.tsx`

Expected: FAIL porque el bootstrap decide por mensaje y renderiza el dialogo fuera de `/app`.

- [ ] **Step 3: Implementar la deteccion por estado y sustituir el placeholder de carga.**

```tsx
if (error instanceof ErrorApi && error.estado === 409) {
  publicarConflictoVinculacion(error.message)
  return
}

if (!listo) return <PantallaCargaSesion />
```

Eliminar todo estado y renderizado de `DialogoConflictoVinculacion` de `AuthBootstrap`.

- [ ] **Step 4: Ejecutar la prueba y confirmar que pasa.**

Run: `bun test frontend/src/app/providers.test.tsx`

Expected: PASS.

## Task 3: Dialogo bloqueante dentro de `/app/*`

**Files:**
- Modify: `frontend/src/componentes/ui/dialogo-conflicto-vinculacion.tsx:1-54`
- Modify: `frontend/src/routes/app.tsx:1-75`
- Test: `frontend/src/componentes/ui/dialogo-conflicto-vinculacion.test.tsx`
- Test: `frontend/src/routes/app.test.tsx`

**Interfaces:**
- Consumes `consumirConflictoVinculacion`, `descartarConflictoVinculacion`, `cerrarSesionAutenticada`, `sessionStorageApi`, `router`.
- Produces `DialogoConflictoVinculacion({ mensaje, onContinuarInvitado, onCambiarCuenta })`.

- [ ] **Step 1: Escribir las pruebas fallidas del dialogo y de sus salidas.**

```tsx
expect(screen.getByRole("dialog", { name: /cuenta ya esta vinculada/i })).toBeVisible()
await user.click(screen.getByRole("button", { name: /seguir como invitado/i }))
expect(onContinuarInvitado).toHaveBeenCalledTimes(1)
expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
```

```tsx
expect(screen.queryByRole("dialog")).toBeNull() // ruta /login
renderAppRoute("/app/perfil", "correo an***@gmail.com ya pertenece a otra cuenta")
expect(screen.getByRole("dialog")).toBeVisible()
```

- [ ] **Step 2: Ejecutar las pruebas y confirmar que fallan.**

Run: `bun test frontend/src/componentes/ui/dialogo-conflicto-vinculacion.test.tsx frontend/src/routes/app.test.tsx`

Expected: FAIL porque el dialogo no usa portal ni se consume desde el layout `/app`.

- [ ] **Step 3: Implementar el dialogo accesible y el consumo en `AppLayout`.**

```tsx
return createPortal(
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />
    <section aria-modal="true" aria-labelledby="conflicto-titulo" role="dialog" className="relative w-full max-w-sm ...">
      {/* contenido y botones */}
    </section>
  </div>,
  document.body,
)
```

En `AppLayout`, escuchar `semillas:conflicto-vinculacion`, consumir el mensaje inicial y manejar las dos acciones:

```ts
async function continuarComoInvitado() {
  descartarConflictoVinculacion()
  await cerrarSesionAutenticada()
  sessionStorageApi.clearAccessToken()
  await queryClient.invalidateQueries()
  setMensajeConflicto(null)
}

async function cambiarCuenta() {
  descartarConflictoVinculacion()
  sessionStorageApi.clearGuestSession()
  sessionStorageApi.clearAccessToken()
  await cerrarSesionAutenticada()
  await router.navigate({ to: "/login", search: { redirect: "/app" } })
}
```

Bloquear scroll con un `useEffect` que asigne `document.body.style.overflow = "hidden"` mientras exista mensaje y lo restaure al desmontar. No adjuntar `onClick` al backdrop.

- [ ] **Step 4: Ejecutar las pruebas y confirmar que pasan.**

Run: `bun test frontend/src/componentes/ui/dialogo-conflicto-vinculacion.test.tsx frontend/src/routes/app.test.tsx`

Expected: PASS; el dialogo solo existe en `/app/*` y bloquea el fondo.

## Task 4: Pantallas profesionales 404, 403, carga y error global

**Files:**
- Create: `frontend/src/componentes/estados/pantalla-estado.tsx`
- Create: `frontend/src/componentes/estados/pantalla-no-encontrado.tsx`
- Create: `frontend/src/componentes/estados/pantalla-acceso-denegado.tsx`
- Create: `frontend/src/componentes/estados/pantalla-error-ruta.tsx`
- Modify: `frontend/src/routes/__root.tsx:1-9`
- Modify: `frontend/src/router.tsx:1-12`
- Modify: `frontend/src/routes/admin.tsx:10-27`
- Test: `frontend/src/componentes/estados/pantallas-estado.test.tsx`

**Interfaces:**
- Produces `PantallaEstado({ icono, titulo, descripcion, acciones })` y los cuatro componentes de estado.
- `PantallaErrorRuta` recibe `{ error: unknown; reset: () => void }` desde TanStack Router.

- [ ] **Step 1: Escribir pruebas fallidas para cada pantalla y para router.**

```tsx
render(<PantallaNoEncontrado />)
expect(screen.getByRole("heading", { name: /pagina no encontrada/i })).toBeVisible()

render(<PantallaAccesoDenegado />)
expect(screen.getByRole("link", { name: /volver a mi inicio/i })).toHaveAttribute("href", "/app")
```

```tsx
renderRouterAt("/una-ruta-inexistente")
expect(await screen.findByText(/pagina no encontrada/i)).toBeVisible()
```

- [ ] **Step 2: Ejecutar las pruebas y confirmar que fallan.**

Run: `bun test frontend/src/componentes/estados/pantallas-estado.test.tsx`

Expected: FAIL porque los componentes y configuracion de router no existen.

- [ ] **Step 3: Implementar pantallas reutilizables y conectarlas al router.**

```tsx
export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: PantallaNoEncontrado,
})

export const router = createRouter({
  routeTree,
  defaultErrorComponent: PantallaErrorRuta,
})
```

En `admin.tsx`, reemplazar la redireccion no autorizada por `throw redirect({ to: "/acceso-denegado" })`; crear la ruta `frontend/src/routes/acceso-denegado.tsx` que renderice `PantallaAccesoDenegado`.

- [ ] **Step 4: Ejecutar las pruebas y confirmar que pasan.**

Run: `bun test frontend/src/componentes/estados/pantallas-estado.test.tsx`

Expected: PASS.

## Task 5: Verificacion integral

**Files:**
- Modify only if a test or typecheck revela un problema directo de las tareas 1-4.

- [ ] **Step 1: Ejecutar typecheck frontend.**

Run: `bun run --cwd frontend typecheck`

Expected: PASS excepto el error preexistente documentado de `src/lib/offline/offline-package.test.ts` si sigue sin implementacion.

- [ ] **Step 2: Ejecutar pruebas afectadas.**

Run: `bun test frontend/src/app/providers.test.tsx frontend/src/componentes/ui/dialogo-conflicto-vinculacion.test.tsx frontend/src/componentes/estados/pantallas-estado.test.tsx`

Expected: PASS.

- [ ] **Step 3: Ejecutar build.**

Run: `bun run build:frontend`

Expected: PASS.

- [ ] **Step 4: Revisar manualmente estos flujos.**

1. En `/app/perfil`, simular un 409 de Google y confirmar que sidebar y header quedan visualmente bloqueados.
2. Pulsar `Seguir como invitado`; confirmar que el modal no reaparece y el progreso local de invitado sigue accesible.
3. Repetir con Facebook y confirmar el mismo comportamiento.
4. Pulsar `Iniciar sesion con otra cuenta`; confirmar cierre OAuth, limpieza de invitado y llegada a `/login`.
5. Visitar una URL inexistente, `/acceso-denegado` y provocar un error de ruta para verificar 404, 403 y error global.
