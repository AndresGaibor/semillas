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

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function responderSupabase(casos: Array<{ metodo: string; path: string; responder: (request: Request) => Promise<Response> | Response }>) {
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
      headers: { "content-type": "application/json" }
    });
  }) as typeof fetch;
}

describe("admin.routes", () => {
  it("archiva un tema existente y conserva su identidad", async () => {
    let cuerpoActualizacion: Record<string, unknown> | null = null;

    responderSupabase([
      {
        metodo: "GET",
        path: "/rest/v1/usuario_app",
        responder: () =>
          new Response(
            JSON.stringify([
              {
                id: "usuario-admin",
                rol: "administrador",
                proveedor: "invitado",
                nombre_visible: "Admin",
                correo: null
              }
            ]),
            { status: 200, headers: { "content-type": "application/json" } }
          )
      },
      {
        metodo: "GET",
        path: "/rest/v1/tema",
        responder: () =>
          new Response(
            JSON.stringify({
              id: "tema-1",
              senda_id: "senda-1",
              titulo: "La creación",
              slug: "la-creacion",
              objetivo: "Aprender sobre la creación",
              resumen: "Dios creó todo",
              portada_recurso_id: null,
              estado: "archivado",
              version_biblica_id: "biblia-1",
              xp_recompensa: 100,
              minutos_estimados: 10,
              version_contenido: 3,
              publicado_en: "2026-01-01T00:00:00.000Z",
              creado_en: "2026-01-01T00:00:00.000Z",
              actualizado_en: "2026-01-02T00:00:00.000Z",
              creado_por: "usuario-admin",
              path: { id: "senda-1", codigo: "padre", nombre: "Padre", color_hex: "#3D8BD4" },
              created_by: { id: "usuario-admin", nombre_visible: "Admin" },
              portada_recurso: null,
              grupos_edad: []
            }),
            { status: 200, headers: { "content-type": "application/json" } }
          )
      },
      {
        metodo: "PATCH",
        path: "/rest/v1/tema",
        responder: async (request) => {
          cuerpoActualizacion = JSON.parse(await request.clone().text()) as Record<string, unknown>;

          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { "content-type": "application/json" }
          });
        }
      }
    ]);

    const response = await app.fetch(
      new Request("http://localhost/administracion/temas/tema-1/archivar", {
        method: "POST",
        headers: {
          "x-guest-user-id": "usuario-admin"
        }
      }),
      env
    );

    const body = (await response.json()) as {
      exito: true;
      datos: { estado: string; id: string };
    };

    expect(response.status).toBe(200);
    expect(body.datos.id).toBe("tema-1");
    expect(body.datos.estado).toBe("archivado");
    expect(cuerpoActualizacion).toMatchObject({ estado: "archivado" });
  });

  it("duplica un tema como borrador con slug nuevo y franjas copiadas", async () => {
    const inserciones: Array<{ path: string; body: Record<string, unknown> }> = [];

    responderSupabase([
      {
        metodo: "GET",
        path: "/rest/v1/usuario_app",
        responder: () =>
          new Response(
            JSON.stringify([
              {
                id: "usuario-admin",
                rol: "administrador",
                proveedor: "invitado",
                nombre_visible: "Admin",
                correo: null
              }
            ]),
            { status: 200, headers: { "content-type": "application/json" } }
          )
      },
      {
        metodo: "GET",
        path: "/rest/v1/tema",
        responder: () =>
          new Response(
            JSON.stringify({
              id: "tema-1",
              senda_id: "senda-1",
              titulo: "La creación",
              slug: "la-creacion",
              objetivo: "Aprender sobre la creación",
              resumen: "Dios creó todo",
              portada_recurso_id: "portada-1",
              estado: "publicado",
              version_biblica_id: "biblia-1",
              xp_recompensa: 100,
              minutos_estimados: 10,
              version_contenido: 3,
              publicado_en: "2026-01-01T00:00:00.000Z",
              creado_en: "2026-01-01T00:00:00.000Z",
              actualizado_en: "2026-01-02T00:00:00.000Z",
              creado_por: "usuario-admin",
              path: { id: "senda-1", codigo: "padre", nombre: "Padre", color_hex: "#3D8BD4" },
              created_by: { id: "usuario-admin", nombre_visible: "Admin" },
              portada_recurso: { id: "portada-1", url_publica: "https://cdn.test/portada.png", texto_alternativo: "Portada", titulo: "Portada" },
              grupos_edad: [
                { id: "grupo-1", codigo: "semillas", nombre: "Semillas" },
                { id: "grupo-2", codigo: "exploradores", nombre: "Exploradores" }
              ]
            }),
            { status: 200, headers: { "content-type": "application/json" } }
          )
      },
      {
        metodo: "GET",
        path: "/rest/v1/tema_grupo_edad",
        responder: () =>
          new Response(
            JSON.stringify([
              { tema_id: "tema-1", grupo_edad_id: "grupo-1", grupo_edad: { id: "grupo-1", codigo: "semillas", nombre: "Semillas" } },
              { tema_id: "tema-1", grupo_edad_id: "grupo-2", grupo_edad: { id: "grupo-2", codigo: "exploradores", nombre: "Exploradores" } }
            ]),
            { status: 200, headers: { "content-type": "application/json" } }
          )
      },
      {
        metodo: "POST",
        path: "/rest/v1/tema",
        responder: async (request) => {
          inserciones.push({ path: "/rest/v1/tema", body: JSON.parse(await request.clone().text()) as Record<string, unknown> });

          return new Response(
            JSON.stringify({
              id: "tema-duplicado",
              senda_id: "senda-1",
              titulo: "La creación (copia)",
              slug: "la-creacion-copia-12345678",
              objetivo: "Aprender sobre la creación",
              resumen: "Dios creó todo",
              portada_recurso_id: "portada-1",
              estado: "borrador",
              version_biblica_id: "biblia-1",
              xp_recompensa: 100,
              minutos_estimados: 10,
              version_contenido: 0,
              publicado_en: null,
              creado_en: "2026-01-03T00:00:00.000Z",
              actualizado_en: "2026-01-03T00:00:00.000Z",
              creado_por: "usuario-admin",
              path: { id: "senda-1", codigo: "padre", nombre: "Padre", color_hex: "#3D8BD4" },
              created_by: { id: "usuario-admin", nombre_visible: "Admin" },
              portada_recurso: { id: "portada-1", url_publica: "https://cdn.test/portada.png", texto_alternativo: "Portada", titulo: "Portada" },
              grupos_edad: [
                { id: "grupo-1", codigo: "semillas", nombre: "Semillas" },
                { id: "grupo-2", codigo: "exploradores", nombre: "Exploradores" }
              ]
            }),
            { status: 201, headers: { "content-type": "application/json" } }
          );
        }
      },
      {
        metodo: "POST",
        path: "/rest/v1/tema_grupo_edad",
        responder: async (request) => {
          inserciones.push({ path: "/rest/v1/tema_grupo_edad", body: JSON.parse(await request.clone().text()) as Record<string, unknown> });

          return new Response(JSON.stringify([{ tema_id: "tema-duplicado", grupo_edad_id: "grupo-1" }]), {
            status: 201,
            headers: { "content-type": "application/json" }
          });
        }
      }
    ]);

    const response = await app.fetch(
      new Request("http://localhost/administracion/temas/tema-1/duplicar", {
        method: "POST",
        headers: {
          "x-guest-user-id": "usuario-admin"
        }
      }),
      env
    );

    const body = (await response.json()) as {
      exito: true;
      datos: { id: string; slug: string; estado: string; grupos_edad: Array<{ id: string }> };
    };

    expect(response.status).toBe(201);
    expect(body.datos.id).toBe("tema-duplicado");
    expect(body.datos.estado).toBe("borrador");
    expect(body.datos.slug).toContain("la-creacion-copia-");
    expect(body.datos.grupos_edad).toHaveLength(2);
    expect(inserciones[0].path).toBe("/rest/v1/tema");
    expect(inserciones[0].body).toMatchObject({
      titulo: "La creación (copia)",
      estado: "borrador",
      version_contenido: 0,
      senda_id: "senda-1",
      portada_recurso_id: "portada-1"
    });
    expect(inserciones[1].path).toBe("/rest/v1/tema_grupo_edad");
    expect(inserciones[1].body as unknown as Array<{ tema_id: string; grupo_edad_id: string }>).toEqual([
      { tema_id: "tema-duplicado", grupo_edad_id: "grupo-1" },
      { tema_id: "tema-duplicado", grupo_edad_id: "grupo-2" }
    ]);
  });
});
