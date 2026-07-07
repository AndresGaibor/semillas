import { afterEach, describe, expect, it } from "bun:test";
import app from "../../app";
import type { AppBindings } from "../../config/env";

const env: AppBindings["Bindings"] = {
  APP_ENV: "development",
  CORS_ORIGIN: "http://localhost:3000",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  SUPABASE_PROJECT_REF: "test-project-ref"
};

const usuarioInvitado = {
  id: "550e8400-e29b-41d4-a716-446655440010",
  rol: "invitado",
  proveedor: "invitado",
  nombre_visible: "Semillero",
  correo: null
};

const actividadId = "550e8400-e29b-41d4-a716-446655440020";
const opcionId = "550e8400-e29b-41d4-a716-446655440030";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("activities.routes", () => {
  it("restaura el upsert de progreso_tema_usuario al responder correctamente", async () => {
    const solicitudes: Array<{ metodo: string; ruta: string }> = [];

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      const url = new URL(request.url);

      solicitudes.push({ metodo: request.method.toUpperCase(), ruta: url.pathname });

      if (url.pathname.includes("/rest/v1/usuario_app")) {
        return new Response(JSON.stringify(usuarioInvitado), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (url.pathname.includes("/rest/v1/actividad") && request.method === "GET") {
        return new Response(
          JSON.stringify({
            id: actividadId,
            tema_id: "550e8400-e29b-41d4-a716-446655440040",
            xp_recompensa: 10
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" }
          }
        );
      }

      if (url.pathname.includes("/rest/v1/opcion_actividad")) {
        return new Response(
          JSON.stringify({
            id: opcionId,
            correcta: true
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" }
          }
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }) as typeof fetch;

    const response = await app.fetch(
      new Request(`http://localhost/actividades/${actividadId}/responder`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-guest-user-id": usuarioInvitado.id
        },
        body: JSON.stringify({
          evento_id_cliente: "550e8400-e29b-41d4-a716-446655440000",
          opcion_id_seleccionada: opcionId
        })
      }),
      env
    );

    expect(response.status).toBe(201);
    expect(solicitudes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruta: "/rest/v1/progreso_actividad_usuario", metodo: "POST" }),
        expect.objectContaining({ ruta: "/rest/v1/progreso_tema_usuario", metodo: "POST" })
      ])
    );
  });
});
