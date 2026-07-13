# Auth con Correo Electrónico — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar registro e inicio de sesión con email+contraseña usando Supabase Auth directamente.

**Architecture:** Frontend llama `supabase.auth.signUp()` y `signInWithPassword()`. El backend (Hono) ya tiene middleware que acepta tokens Bearer y crea `usuario_app` + `perfil` automáticamente. No se requieren cambios en backend.

**Tech Stack:** React, TypeScript, Supabase JS, React Hook Form, Zod, TanStack Query, Tailwind

## Global Constraints

- Usar Bun, no npm/pnpm/yarn
- Comentarios en español, variables de dominio en español
- Términos técnicos en inglés (`middleware`, `token`, `payload`)
- Inmutabilidad: siempre crear nuevos objetos, nunca mutar

---

### Task 1: Helpers de Supabase Auth

**Files:**
- Modify: `frontend/src/shared/auth/supabase.helpers.ts`
- Modify: `frontend/src/shared/auth/supabase.ts`
- Test: `frontend/src/shared/auth/supabase.helpers.test.ts`
- Modify: `frontend/src/features/auth/auth.api.ts`
- Test: `frontend/src/features/auth/auth.api.test.ts`

**Interfaces:**
- Produces: `registrarConCorreo(email: string, password: string)` → `{ data, error }`
- Produces: `iniciarSesionConCorreo(email: string, password: string)` → `{ data, error }`
- Consumes: `ClienteSupabaseAuth` type with `auth.signUp`, `auth.signInWithPassword`

- [ ] **Step 1: Agregar `registrarConCorreo` e `iniciarSesionConCorreo` a supabase.helpers.ts**

```typescript
export async function registrarConCorreoConCliente(
  cliente: ClienteSupabaseAuth,
  email: string,
  password: string,
) {
  const { data, error } = await cliente.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

export async function iniciarSesionConCorreoConCliente(
  cliente: ClienteSupabaseAuth,
  email: string,
  password: string,
) {
  const { data, error } = await cliente.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}
```

- [ ] **Step 2: Actualizar `ClienteSupabaseAuth` type para incluir `signUp` y `signInWithPassword`**

```typescript
export type ClienteSupabaseAuth = {
  auth: {
    signInWithOAuth: ... // existing
    signUp: (args: { email: string; password: string }) => Promise<{
      data: { user: { id: string } | null; session: { access_token: string } | null };
      error: Error | null;
    }>;
    signInWithPassword: (args: { email: string; password: string }) => Promise<{
      data: { user: { id: string } | null; session: { access_token: string } | null };
      error: Error | null;
    }>;
    getSession: ... // existing
    onAuthStateChange: ... // existing
    signOut: ... // existing
  };
};
```

- [ ] **Step 3: Exportar funciones en `supabase.ts`**

```typescript
export async function registrarConCorreo(email: string, password: string) {
  return registrarConCorreoConCliente(supabase, email, password);
}

export async function iniciarSesionConCorreo(email: string, password: string) {
  return iniciarSesionConCorreoConCliente(supabase, email, password);
}
```

- [ ] **Step 4: Tests unitarios**

```typescript
// En supabase.helpers.test.ts
it("registra con correo usando signUp", async () => {
  const signUpMock = mock(async () => ({
    data: { user: { id: "user-1" }, session: { access_token: "token-abc" } },
    error: null,
  }));

  const cliente = {
    auth: {
      signInWithOAuth: mock(),
      signUp: signUpMock,
      signInWithPassword: mock(),
      getSession: mock(),
      onAuthStateChange: mock(),
      signOut: mock(),
    },
  } as never;

  const { data } = await registrarConCorreoConCliente(cliente, "test@ejemplo.com", "password123");

  expect(signUpMock).toHaveBeenCalledWith({
    email: "test@ejemplo.com",
    password: "password123",
  });
  expect(data?.user?.id).toBe("user-1");
});

it("inicia sesión con correo usando signInWithPassword", async () => {
  const signInMock = mock(async () => ({
    data: { user: { id: "user-1" }, session: { access_token: "token-abc" } },
    error: null,
  }));

  const cliente = {
    auth: {
      signInWithOAuth: mock(),
      signUp: mock(),
      signInWithPassword: signInMock,
      getSession: mock(),
      onAuthStateChange: mock(),
      signOut: mock(),
    },
  } as never;

  const { data } = await iniciarSesionConCorreoConCliente(cliente, "test@ejemplo.com", "password123");

  expect(signInMock).toHaveBeenCalledWith({
    email: "test@ejemplo.com",
    password: "password123",
  });
  expect(data?.session?.access_token).toBe("token-abc");
});

it("maneja error de registro", async () => {
  const signUpMock = mock(async () => ({
    data: { user: null, session: null },
    error: new Error("Email ya registrado"),
  }));

  const cliente = {
    auth: {
      signInWithOAuth: mock(),
      signUp: signUpMock,
      signInWithPassword: mock(),
      getSession: mock(),
      onAuthStateChange: mock(),
      signOut: mock(),
    },
  } as never;

  const { error } = await registrarConCorreoConCliente(cliente, "existente@ejemplo.com", "password123");
  expect(error).toBeTruthy();
});
```

- [ ] **Step 5: Re-exportar en auth.api.ts**

```typescript
import { registrarConCorreo, iniciarSesionConCorreo } from "../../shared/auth/supabase";

export { registrarConCorreo, iniciarSesionConCorreo };
```

- [ ] **Step 6: Tests para auth.api.ts**

```typescript
it("registrarConCorreo llama al helper de supabase", async () => {
  const { registrarConCorreo } = await import("./auth.api");
  const result = await registrarConCorreo("test@ejemplo.com", "password123");
  // Verify it delegates correctly
});

it("iniciarSesionConCorreo llama al helper de supabase", async () => {
  const { iniciarSesionConCorreo } = await import("./auth.api");
  const result = await iniciarSesionConCorreo("test@ejemplo.com", "password123");
  // Verify it delegates correctly
});
```

- [ ] **Step 7: Commit**

---

### Task 2: EmailAuthForm Component

**Files:**
- Create: `frontend/src/features/auth/componentes/email-auth-form.tsx`
- Create: `frontend/src/features/auth/componentes/email-auth-form.test.tsx`

**Interfaces:**
- Consumes: `registrarConCorreo(email, password)`, `iniciarSesionConCorreo(email, password)`
- Produces: `<EmailAuthForm onSuccess: () => void />`

- [ ] **Step 1: Escribir el componente**

```tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrarConCorreo, iniciarSesionConCorreo } from "../auth.api";
import { Mail, Lock, Loader2 } from "lucide-react";

type Modo = "iniciar-sesion" | "registrarse";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const registerSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmarPassword: z.string(),
}).refine((data) => data.password === data.confirmarPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export interface EmailAuthFormProps {
  onSuccess: () => void;
}

export const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ onSuccess }) => {
  const [modo, setModo] = useState<Modo>("iniciar-sesion");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [cuentaCreada, setCuentaCreada] = useState(false);

  const isLogin = modo === "iniciar-sesion";
  const schema = isLogin ? loginSchema : registerSchema;
  type FormData = typeof schema extends z.ZodObject<infer _> ? LoginFormData : RegisterFormData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setError(null);
    setPending(true);

    try {
      if (isLogin) {
        const { error } = await iniciarSesionConCorreo(data.email, data.password);
        if (error) {
          setError(obtenerMensajeError(error.message));
          return;
        }
        onSuccess();
      } else {
        const registerData = data as RegisterFormData;
        const { error } = await registrarConCorreo(registerData.email, registerData.password);
        if (error) {
          setError(obtenerMensajeError(error.message));
          return;
        }
        setCuentaCreada(true);
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setPending(false);
    }
  };

  if (cuentaCreada) {
    return (
      <div className="text-center py-6">
        <div className="text-[#2e9e5b] text-lg font-bold mb-2">¡Cuenta creada!</div>
        <p className="text-sm text-gray-600 mb-4">
          Hemos enviado un correo de confirmación a tu dirección.
          Revisa tu bandeja de entrada y sigue las instrucciones.
        </p>
        <button
          onClick={() => { setCuentaCreada(false); setModo("iniciar-sesion"); }}
          className="text-[#2e9e5b] text-sm font-medium hover:underline"
        >
          Volver a inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="sr-only">Correo electrónico</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            {...register("email")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/30 focus:border-[#2e9e5b]"
          />
        </div>
        {errors.email && (
          <p className="text-[#ee6c4d] text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="sr-only">Contraseña</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            {...register("password")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/30 focus:border-[#2e9e5b]"
          />
        </div>
        {errors.password && (
          <p className="text-[#ee6c4d] text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {!isLogin && (
        <div>
          <label htmlFor="confirmarPassword" className="sr-only">Confirmar contraseña</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="confirmarPassword"
              type="password"
              placeholder="Confirmar contraseña"
              {...register("confirmarPassword")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/30 focus:border-[#2e9e5b]"
            />
          </div>
          {errors.confirmarPassword && (
            <p className="text-[#ee6c4d] text-xs mt-1">{errors.confirmarPassword.message}</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-[#ee6c4d] text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 rounded-xl bg-[#2e9e5b] text-white text-sm font-bold hover:bg-[#258a4d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        {isLogin ? "Iniciar sesión" : "Crear cuenta"}
      </button>

      <button
        type="button"
        onClick={() => { setModo(isLogin ? "registrarse" : "iniciar-sesion"); setError(null); }}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        {isLogin
          ? "¿No tienes cuenta? Regístrate"
          : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </form>
  );
};

function obtenerMensajeError(mensaje: string): string {
  if (mensaje.includes("already registered") || mensaje.includes("already exists")) {
    return "Este correo ya está registrado. Inicia sesión.";
  }
  if (mensaje.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (mensaje.includes("Email not confirmed")) {
    return "Por favor confirma tu correo antes de iniciar sesión.";
  }
  return mensaje;
}
```

- [ ] **Step 2: Escribir tests del componente**

```tsx
import { describe, expect, it, mock } from "bun:test";

const registrarMock = mock(async () => ({ data: { user: null, session: null }, error: null }));
const iniciarSesionMock = mock(async () => ({ data: { user: null, session: null }, error: null }));

mock.module("../auth.api", () => ({
  registrarConCorreo: registrarMock,
  iniciarSesionConCorreo: iniciarSesionMock,
}));

describe("EmailAuthForm", () => {
  it("renderiza el formulario en modo iniciar sesión", async () => {
    const { EmailAuthForm } = await import("./email-auth-form");
    // render and verify login mode
  });

  it("cambia a modo registro al hacer clic en el link", async () => {
    // test mode toggle
  });

  it("muestra error de contraseñas no coinciden en registro", async () => {
    // test validation
  });
});
```

- [ ] **Step 3: Commit**

---

### Task 3: Integrar en LoginFormCard y login.tsx + eliminar modo desarrollo

**Files:**
- Modify: `frontend/src/features/auth/componentes/login-form-card.tsx`
- Modify: `frontend/src/routes/login.tsx`
- Modify: `frontend/src/routes/login.css`

**Interfaces:**
- Consumes: `EmailAuthForm`, `LoginFormCardProps` updated
- Produces: Updated login page with tabs and email auth

- [ ] **Step 1: Agregar tabs al LoginFormCard y eliminar botón dev admin**

```tsx
import { EmailAuthForm } from "./email-auth-form";

export interface LoginFormCardProps {
  onGoogleClick: () => void;
  onGuestClick: () => void;
  googlePending?: boolean;
  guestPending?: boolean;
  guestError?: boolean;
  onEmailSuccess: () => void;
  tabActivo: "social" | "email";
  onCambiarTab: (tab: "social" | "email") => void;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
  onGoogleClick,
  onGuestClick,
  googlePending,
  guestPending,
  guestError,
  onEmailSuccess,
  tabActivo,
  onCambiarTab,
}) => {
  return (
    <section className="login-panel login-panel--form" aria-label="Opciones de inicio de sesión">
      <div className="login-form-wrapper">
        <div className="login-welcome">
          <h1 className="login-welcome__title">Bienvenido a Semillas</h1>
          <p className="login-welcome__subtitle">Inicia sesión para continuar tu aventura de fe y aprendizaje.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => onCambiarTab("social")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tabActivo === "social"
                ? "text-[#2e9e5b] border-b-2 border-[#2e9e5b]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Redes sociales
          </button>
          <button
            onClick={() => onCambiarTab("email")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tabActivo === "email"
                ? "text-[#2e9e5b] border-b-2 border-[#2e9e5b]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Correo electrónico
          </button>
        </div>

        {tabActivo === "social" && (
          <div className="login-social" role="group" aria-label="Opciones de acceso">
            <SocialLoginButton
              tipo="google"
              logo={googleIcon}
              label="Continuar con Google"
              onClick={onGoogleClick}
              isPending={googlePending}
            />

            <div className="login-divider" role="separator" aria-hidden="true">
              <span className="login-divider__line"></span>
              <span className="login-divider__label">o explora sin cuenta</span>
              <span className="login-divider__line"></span>
            </div>

            <SocialLoginButton
              tipo="guest"
              logo={guestIcon}
              label="Jugar como invitado"
              guestNote="Explora sin cuenta. Tu progreso no se guardará."
              onClick={onGuestClick}
              isPending={guestPending}
            />
          </div>
        )}

        {tabActivo === "email" && (
          <EmailAuthForm onSuccess={onEmailSuccess} />
        )}

        {tabActivo === "social" && guestError && (
          <p className="text-[#ee6c4d] text-sm mt-4 text-center">No se pudo crear el invitado. Asegúrate de que el backend esté activo.</p>
        )}
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Actualizar login.tsx**

```tsx
function LoginPage() {
  const navigate = useNavigate();
  const [tabActivo, setTabActivo] = useState<"social" | "email">("social");

  // ...existing mutations...

  const emailSuccessRedirect = () => {
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="login-page">
      <header className="login-topbar">...</header>
      <main className="login-main" id="main-content" role="main">
        <LoginFormCard
          onGoogleClick={() => googleMutation.mutate()}
          onGuestClick={() => guestMutation.mutate({ apodo: "Semillero" })}
          googlePending={googleMutation.isPending}
          guestPending={guestMutation.isPending}
          guestError={guestMutation.isError}
          onEmailSuccess={emailSuccessRedirect}
          tabActivo={tabActivo}
          onCambiarTab={setTabActivo}
        />
        <LoginHeroPanel />
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

---

### Task 4: Verificación final

- [ ] **Step 1: Ejecutar tests**

Run: `bun run --cwd frontend test`
Expected: All tests pass

- [ ] **Step 2: Ejecutar typecheck**

Run: `bun run --cwd frontend typecheck`
Expected: No type errors

- [ ] **Step 3: Ejecutar build**

Run: `bun run --cwd frontend build`
Expected: Build succeeds

- [ ] **Step 4: Commit final**
