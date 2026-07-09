import { afterEach, describe, expect, it } from "bun:test";
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

describe("themes.routes", () => {
  it("devuelve el listado de temas con senda y portada_recurso desde la vista publica", async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = new URL(input instanceof Request ? input.url : String(input));

      if (url.pathname === "/rest/v1/v_temas_publicos") {
        return new Response(
          JSON.stringify([
            {
              id: "tema-1",
              senda_id: "senda-padre",
              titulo: "La creación del mundo",
              slug: "la-creacion-del-mundo",
              objetivo: "Aprender sobre la creación",
              resumen: "Dios creo todo en siete dias",
              portada_recurso_id: "recurso-1",
              portada_recurso: {
                id: "recurso-1",
                tipo: "imagen",
                url_publica: "https://example.supabase.co/storage/v1/object/public/media/imagen/recurso-1.png",
                texto_alternativo: "Creación",
                titulo: "Portada La creación",
                tipo_mime: "image/png",
                tamano_bytes: 102400,
                duracion_seg: null,
                ancho_px: 1280,
                alto_px: 720
              },
              estado: "publicado",
              version_biblica_id: "biblia-1",
              xp_recompensa: 100,
              minutos_estimados: 10,
              version_contenido: 1,
              publicado_en: "2026-01-01T00:00:00.000Z",
              senda_codigo: "padre",
              senda_nombre: "Senda del Padre",
              senda_color_hex: "#3D8BD4"
            }
          ]),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const response = await app.fetch(new Request("http://localhost/temas"), env);
    const body = (await response.json()) as {
      exito: true;
      datos: Array<{
        id: string;
        titulo: string;
        portada_recurso: { url_publica: string } | null;
        senda: { codigo: string; nombre: string } | null;
      }>;
    };

    expect(response.status).toBe(200);
    expect(body.datos).toHaveLength(1);
    expect(body.datos[0].titulo).toBe("La creación del mundo");
    expect(body.datos[0].senda?.codigo).toBe("padre");
    expect(body.datos[0].portada_recurso?.url_publica).toContain("/storage/v1/object/public/media/");
  });

  it("filtra los temas por senda_id en el cliente", async () => {
    let consultaSendaId: string | null = null;

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = new URL(input instanceof Request ? input.url : String(input));

      if (url.pathname === "/rest/v1/v_temas_publicos") {
        consultaSendaId = url.searchParams.get("senda_id");
        return new Response(
          JSON.stringify([
            {
              id: "tema-1",
              senda_id: "senda-padre",
              titulo: "La creación",
              slug: "la-creacion",
              objetivo: "obj",
              resumen: null,
              portada_recurso_id: null,
              portada_recurso: null,
              estado: "publicado",
              version_biblica_id: null,
              xp_recompensa: 100,
              minutos_estimados: 10,
              version_contenido: 1,
              publicado_en: null,
              senda_codigo: "padre",
              senda_nombre: "Senda del Padre",
              senda_color_hex: "#3D8BD4"
            },
            {
              id: "tema-2",
              senda_id: "senda-hijo",
              titulo: "Parábolas",
              slug: "parabolas",
              objetivo: "obj",
              resumen: null,
              portada_recurso_id: null,
              portada_recurso: null,
              estado: "publicado",
              version_biblica_id: null,
              xp_recompensa: 120,
              minutos_estimados: 12,
              version_contenido: 1,
              publicado_en: null,
              senda_codigo: "hijo",
              senda_nombre: "Senda del Hijo",
              senda_color_hex: "#6D35E8"
            }
          ]),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const response = await app.fetch(
      new Request("http://localhost/temas?senda_id=senda-padre"),
      env,
    );
    const body = (await response.json()) as { exito: true; datos: Array<{ id: string }> };

    expect(consultaSendaId).toBeNull();
    expect(response.status).toBe(200);
    expect(body.datos).toHaveLength(1);
    expect(body.datos[0].id).toBe("tema-1");
  });

  it("devuelve una URL firmada publica para la portada del tema", async () => {
    let pidioFirmada = false;

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      const metodo = input instanceof Request ? input.method : "GET";

      if (url.pathname === "/rest/v1/tema" && metodo === "GET") {
        return new Response(
          JSON.stringify({
            id: "550e8400-e29b-41d4-a716-446655440099",
            portada_recurso_id: "550e8400-e29b-41d4-a716-446655440010",
            estado: "publicado",
            portada_recurso: {
              id: "550e8400-e29b-41d4-a716-446655440010",
              bucket_almacenamiento: "media",
              clave_almacenamiento: "imagen/portadas/la-creacion-del-mundo.png",
              activo: true
            }
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }

      if (
        url.pathname === "/storage/v1/object/sign/media/imagen/portadas/la-creacion-del-mundo.png"
      ) {
        pidioFirmada = true;
        return new Response(
          JSON.stringify({
            signedURL: "/object/sign/media/imagen/portadas/la-creacion-del-mundo.png?token=abc123"
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const response = await app.fetch(
      new Request("http://localhost/temas/550e8400-e29b-41d4-a716-446655440099/portada"),
      env,
    );
    const body = (await response.json()) as {
      exito: true;
      datos: { url: string; expira_en_segundos: number };
    };

    expect(response.status).toBe(200);
    expect(body.datos.url).toContain("token=abc123");
    expect(body.datos.url).toContain("la-creacion-del-mundo.png");
    expect(body.datos.expira_en_segundos).toBe(300);
    expect(pidioFirmada).toBe(true);
  });

  it("devuelve 404 cuando el tema no tiene portada activa", async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = new URL(input instanceof Request ? input.url : String(input));

      if (url.pathname === "/rest/v1/tema") {
        return new Response(
          JSON.stringify({
            id: "550e8400-e29b-41d4-a716-446655440098",
            portada_recurso_id: null,
            portada_recurso: null,
            estado: "publicado"
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const response = await app.fetch(
      new Request("http://localhost/temas/550e8400-e29b-41d4-a716-446655440098/portada"),
      env,
    );

    expect(response.status).toBe(404);
  });
});