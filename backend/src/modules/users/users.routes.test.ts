import { describe, expect, it, afterEach } from "bun:test";
import app from "../../app";
import type { AppBindings } from "../../config/env";

const env: AppBindings["Bindings"] = {
  APP_ENV: "development",
  CORS_ORIGIN: "http://localhost:3000",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  SUPABASE_PROJECT_REF: "test-project-ref",
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockearSupabase(casos: Array<{ metodo: string; path: string; responder: (request: Request) => Promise<Response> | Response }>) {
  const pendientes = [...casos];

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(String(input), init);
    const url = new URL(request.url);
    const index = pendientes.findIndex((item) => item.metodo === request.method && url.pathname === item.path);
    const caso = index >= 0 ? pendientes.splice(index, 1)[0] : null;

    if (caso) {
      return caso.responder(request);
    }

    return new Response(JSON.stringify({ error: `Ruta no mockeada: ${request.method} ${url.pathname}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
}

describe("users.routes", () => {
  it("reclama una cuenta invitada para una sesión autenticada", async () => {
    let cuerpoActualizacion: Record<string, unknown> | null = null;

    mockearSupabase([
      {
        metodo: "GET",
        path: "/auth/v1/user",
        responder: () =>
          new Response(
            JSON.stringify({
              id: "auth-1",
              email: "semillero@ejemplo.com",
              app_metadata: { provider: "google" },
              user_metadata: { full_name: "Semillero" },
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
      },
      {
        metodo: "GET",
        path: "/rest/v1/usuario_app",
        responder: () =>
          new Response(
            JSON.stringify({
              id: "usuario-invitado",
              rol: "invitado",
              proveedor: "invitado",
              nombre_visible: "Visitante",
              correo: null,
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
      },
      {
        metodo: "PATCH",
        path: "/rest/v1/usuario_app",
        responder: async (request) => {
          cuerpoActualizacion = JSON.parse(await request.clone().text()) as Record<string, unknown>;

          return new Response(
            JSON.stringify({
              id: "usuario-invitado",
              rol: "invitado",
              proveedor: "google",
              nombre_visible: "Visitante",
              correo: "semillero@ejemplo.com",
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          );
        },
      },
      {
        metodo: "GET",
        path: "/rest/v1/perfil",
        responder: () =>
          new Response(
            JSON.stringify({
              id: "perfil-1",
              usuario_id: "usuario-invitado",
              apodo: "Visitante",
              grupo_edad_id: null,
              url_avatar: null,
              clave_avatar: null,
              prefiere_audio: false,
              tamano_texto_preferido: "medium",
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
      },
    ]);

    const response = await app.fetch(
      new Request("http://localhost/perfil/vincular-cuenta", {
        method: "POST",
        headers: {
          Authorization: "Bearer token-auth",
          "x-guest-user-id": "usuario-invitado",
        },
      }),
      env,
    );

    const body = (await response.json()) as {
      exito: true;
      datos: {
        usuario: { id: string; proveedor: string; correo: string | null };
        perfil: { id: string };
        vinculada: boolean;
      };
    };

    expect(response.status).toBe(200);
    expect(body.datos.vinculada).toBe(true);
    expect(body.datos.usuario.id).toBe("usuario-invitado");
    expect(body.datos.usuario.proveedor).toBe("google");
    expect(body.datos.usuario.correo).toBe("semillero@ejemplo.com");
    expect(cuerpoActualizacion).toMatchObject({
      id_externo: "auth-1",
      proveedor: "google",
      correo: "semillero@ejemplo.com",
    });
  });
});
