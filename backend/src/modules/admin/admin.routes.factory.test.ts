import { describe, expect, it } from "bun:test";
import app from "../../app";
import type { AppBindings } from "../../config/env";

describe("admin.routes factory", () => {
  it("responde el resumen con counts desde Supabase", async () => {
    const fetchOriginal = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/rest/v1/usuario_app" && url.searchParams.get("select") === "id") {
        return new Response(JSON.stringify([{ id: "usuario-1" }, { id: "usuario-2" }, { id: "usuario-3" }, { id: "usuario-4" }, { id: "usuario-5" }]), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (request.method === "GET" && url.pathname === "/rest/v1/usuario_app") {
        return new Response(JSON.stringify({ id: "usuario-admin", rol: "administrador", proveedor: "invitado", nombre_visible: "Admin", correo: null }), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (request.method === "GET" && url.pathname === "/rest/v1/tema") {
        return new Response(JSON.stringify([{ id: "tema-1" }, { id: "tema-2" }, { id: "tema-3" }, { id: "tema-4" }, { id: "tema-5" }, { id: "tema-6" }, { id: "tema-7" }, { id: "tema-8" }, { id: "tema-9" }, { id: "tema-10" }, { id: "tema-11" }, { id: "tema-12" }]), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (request.method === "GET" && url.pathname === "/rest/v1/actividad") {
        return new Response(JSON.stringify([{ id: "act-1" }, { id: "act-2" }, { id: "act-3" }, { id: "act-4" }, { id: "act-5" }, { id: "act-6" }, { id: "act-7" }, { id: "act-8" }, { id: "act-9" }]), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ error: `Ruta no mockeada: ${request.method} ${url.pathname}` }), {
        status: 500,
        headers: { "content-type": "application/json" }
      });
    }) as typeof fetch;

    const response = await app.fetch(
      new Request("http://localhost/administracion/resumen", {
        headers: { "x-guest-user-id": "usuario-admin" }
      }),
      {
        APP_ENV: "development",
        CORS_ORIGIN: "http://localhost:3000",
        SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_ANON_KEY: "test-anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
        SUPABASE_PROJECT_REF: "test-project-ref"
      } as AppBindings["Bindings"]
    );

    globalThis.fetch = fetchOriginal;

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      exito: boolean;
      datos: { temas: number; publicados: number; usuarios: number; actividades: number };
    };

    expect(body.datos).toEqual({ temas: 12, publicados: 12, usuarios: 5, actividades: 9 });
  });
});
