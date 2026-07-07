import { describe, expect, it } from "bun:test";
import app from "./app";
import type { AppBindings } from "./config/env";

const env: AppBindings["Bindings"] = {
  APP_ENV: "development",
  CORS_ORIGIN: "http://localhost:3000",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
  SUPABASE_SERVER_KEY: "test-server-key",
  SUPABASE_PROJECT_REF: "test-project-ref"
};

const usuarioInvitado = {
  id: "usuario-invitado-1",
  rol: "invitado",
  proveedor: "invitado",
  nombre_visible: "Semillero",
  correo: null
};

const perfilInvitado = {
  id: "perfil-1",
  usuario_id: usuarioInvitado.id,
  apodo: "Semillero",
  grupo_edad_id: "grupo-edad-1",
  url_avatar: "https://cdn.ejemplo.com/avatar.png",
  clave_avatar: "semilla",
  prefiere_audio: true,
  tamano_texto_preferido: "medio"
};

const originalFetch = globalThis.fetch;

function instalarMockSupabase() {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input.toString());
    const metodo = (init?.method ?? "GET").toUpperCase();
    const ruta = url.pathname;

    if (ruta.includes("/rest/v1/usuario_app")) {
      if (metodo === "POST") {
        return new Response(JSON.stringify(usuarioInvitado), {
          status: 201,
          headers: { "content-type": "application/json" }
        });
      }

      if (metodo === "GET") {
        return new Response(JSON.stringify([usuarioInvitado]), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }
    }

    if (ruta.includes("/rest/v1/perfil")) {
      if (metodo === "POST" || metodo === "PATCH") {
        return new Response(JSON.stringify(perfilInvitado), {
          status: 201,
          headers: { "content-type": "application/json" }
        });
      }

      if (metodo === "GET") {
        return new Response(JSON.stringify(perfilInvitado), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }
    }

    if (ruta.includes("/rest/v1/grupo_edad")) {
      return new Response(
        JSON.stringify([
          {
            codigo: "SEMILLAS",
            nombre: "Semillas",
            edad_minima: 5,
            edad_maxima: 8,
            descripcion: "Semillas 5-8",
            orden: 1,
            dominio_publico: true,
            es_juego: false
          }
        ]),
        {
          status: 200,
          headers: { "content-type": "application/json" }
        }
      );
    }

    if (ruta.includes("/rest/v1/v_temas_publicos")) {
      return new Response(
        JSON.stringify([
          {
            id: "tema-1",
            senda_id: "senda-1",
            titulo: "La creación",
            slug: "la-creacion",
            objetivo: "Entender que Dios creó todo",
            resumen: "Resumen",
            portada_recurso_id: "recurso-1",
            estado: "publicado",
            version_biblica_id: "biblia-1",
            xp_recompensa: 50,
            minutos_estimados: 15,
            version_contenido: 2,
            publicado_en: "2026-01-01T00:00:00.000Z"
          }
        ]),
        {
          status: 200,
          headers: { "content-type": "application/json" }
        }
      );
    }

    if (ruta.includes("/rest/v1/actividad")) {
      return new Response(
        JSON.stringify([
          {
            id: "actividad-1",
            tema_id: "tema-1",
            paso_id: "paso-1",
            grupo_edad_id: "grupo-edad-1",
            tipo_actividad_id: "tipo-1",
            titulo: "Pregunta",
            consigna: "Selecciona la respuesta",
            orden: 1,
            xp_recompensa: 10,
            dificultad: "facil",
            limite_tiempo_seg: 30,
            obligatorio: true,
            retroalimentacion: "Bien",
            configuracion: { intentos: 3 },
            creado_en: "2026-01-01T00:00:00.000Z",
            actualizado_en: "2026-01-02T00:00:00.000Z"
          }
        ]),
        {
          status: 200,
          headers: { "content-type": "application/json" }
        }
      );
    }

    if (ruta.includes("/rest/v1/progreso_tema_usuario")) {
      return new Response(
        JSON.stringify([
          {
            usuario_id: usuarioInvitado.id,
            tema_id: "tema-1",
            estado: "en_progreso",
            porcentaje: 50,
            iniciado_en: "2026-01-01T00:00:00.000Z",
            completado_en: null,
            ultimo_paso_id: "paso-1",
            actualizado_en: "2026-01-02T00:00:00.000Z"
          }
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    if (ruta.includes("/rest/v1/progreso_actividad_usuario")) {
      return new Response(
        JSON.stringify([
          {
            usuario_id: usuarioInvitado.id,
            actividad_id: "actividad-1",
            intentos: 2,
            mejor_puntaje: 100,
            completado: true,
            completado_en: "2026-01-02T00:00:00.000Z",
            actualizado_en: "2026-01-03T00:00:00.000Z"
          }
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    if (ruta.includes("/rest/v1/v_nivel_usuario")) {
      return new Response(
        JSON.stringify({
          usuario_id: usuarioInvitado.id,
          xp_total: 150,
          numero_nivel: 3,
          nombre_nivel: "Explorador"
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    if (ruta.includes("/rest/v1/logro_usuario")) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    if (metodo === "GET" && ruta.includes("/rest/v1/tema")) {
      return new Response("", {
        status: 200,
        headers: { "content-range": "0-0/1", "content-type": "application/json" }
      });
    }

    if (metodo === "GET" && ruta.includes("/rest/v1/actividad") && url.searchParams.get("head") === "true") {
      return new Response("", {
        status: 200,
        headers: { "content-range": "0-0/1", "content-type": "application/json" }
      });
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };
}

function jsonResponse(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("app routes", () => {
  it("expone autenticación invitado con claves exactas en español", async () => {
    instalarMockSupabase();

    const response = await app.fetch(
      new Request("http://localhost/autenticacion/invitado", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          apodo: "Semillero",
          grupo_edad_id: "grupo-edad-1",
          url_avatar: "https://cdn.ejemplo.com/avatar.png"
        })
      }),
      env
    );

    expect(response.status).toBe(201);
    await expect(jsonResponse(response)).resolves.toEqual({
      exito: true,
      datos: {
        usuario: {
          id: usuarioInvitado.id,
          rol: "invitado",
          proveedor: "invitado",
          nombre_visible: "Semillero",
          correo: null
        },
        perfil: perfilInvitado,
        autenticacion: {
          tipo: "invitado",
          encabezado: "x-guest-user-id",
          valor: usuarioInvitado.id
        }
      }
    });
  });

  it("expone el catálogo, perfil, temas, actividades, progreso, administración y gamificación en español", async () => {
    instalarMockSupabase();

    const invitado = await app.fetch(
      new Request("http://localhost/autenticacion/invitado", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ apodo: "Semillero" })
      }),
      env
    );
    const invitadoBody = await invitado.json();
    const guestUserId = (invitadoBody as { datos: { usuario: { id: string } } }).datos.usuario.id;

    const responses = await Promise.all([
      app.fetch(new Request("http://localhost/catalogo/grupos-etarios"), env),
      app.fetch(new Request("http://localhost/perfil", { headers: { "x-guest-user-id": guestUserId } }), env),
      app.fetch(new Request("http://localhost/temas"), env),
      app.fetch(new Request("http://localhost/actividades"), env),
      app.fetch(new Request("http://localhost/progreso/mi", { headers: { "x-guest-user-id": guestUserId } }), env),
      app.fetch(new Request("http://localhost/administracion/resumen", { headers: { "x-guest-user-id": guestUserId } }), env),
      app.fetch(new Request("http://localhost/gamificacion/mi", { headers: { "x-guest-user-id": guestUserId } }), env)
    ]);

    expect(responses.map((response) => response.status)).toEqual([200, 200, 200, 200, 200, 200, 200]);

    await expect(jsonResponse(responses[0])).resolves.toEqual({
      exito: true,
      datos: [
        {
          codigo: "SEMILLAS",
          nombre: "Semillas",
          edad_minima: 5,
          edad_maxima: 8,
          descripcion: "Semillas 5-8",
          orden: 1,
          dominio_publico: true,
          es_juego: false
        }
      ]
    });

    await expect(jsonResponse(responses[1])).resolves.toEqual({
      exito: true,
      datos: {
        usuario: {
          id: usuarioInvitado.id,
          rol: "invitado",
          proveedor: "invitado",
          nombre_visible: "Semillero",
          correo: null
        },
        perfil: perfilInvitado
      }
    });

    await expect(jsonResponse(responses[2])).resolves.toEqual({
      exito: true,
      datos: [
        {
          id: "tema-1",
          senda_id: "senda-1",
          titulo: "La creación",
          slug: "la-creacion",
          objetivo: "Entender que Dios creó todo",
          resumen: "Resumen",
          portada_recurso_id: "recurso-1",
          estado: "publicado",
          version_biblica_id: "biblia-1",
          xp_recompensa: 50,
          minutos_estimados: 15,
          version_contenido: 2,
          publicado_en: "2026-01-01T00:00:00.000Z"
        }
      ]
    });

    await expect(jsonResponse(responses[3])).resolves.toEqual({
      exito: true,
      datos: [
        {
          id: "actividad-1",
          tema_id: "tema-1",
          paso_id: "paso-1",
          grupo_edad_id: "grupo-edad-1",
          tipo_actividad_id: "tipo-1",
          titulo: "Pregunta",
          consigna: "Selecciona la respuesta",
          orden: 1,
          xp_recompensa: 10,
          dificultad: "facil",
          limite_tiempo_seg: 30,
          obligatorio: true,
          retroalimentacion: "Bien",
          configuracion: { intentos: 3 },
          creado_en: "2026-01-01T00:00:00.000Z",
          actualizado_en: "2026-01-02T00:00:00.000Z"
        }
      ]
    });

    await expect(jsonResponse(responses[4])).resolves.toEqual({
      exito: true,
      datos: {
        progresos_tema: [
          {
            usuario_id: usuarioInvitado.id,
            tema_id: "tema-1",
            estado: "en_progreso",
            porcentaje: 50,
            iniciado_en: "2026-01-01T00:00:00.000Z",
            completado_en: null,
            ultimo_paso_id: "paso-1",
            actualizado_en: "2026-01-02T00:00:00.000Z"
          }
        ],
        progresos_actividad: [
          {
            usuario_id: usuarioInvitado.id,
            actividad_id: "actividad-1",
            intentos: 2,
            mejor_puntaje: 100,
            completado: true,
            completado_en: "2026-01-02T00:00:00.000Z",
            actualizado_en: "2026-01-03T00:00:00.000Z"
          }
        ]
      }
    });

    await expect(jsonResponse(responses[5])).resolves.toEqual({
      exito: true,
      datos: {
        temas: 1,
        publicados: 1,
        usuarios: 1,
        actividades: 1
      }
    });

    await expect(jsonResponse(responses[6])).resolves.toEqual({
      exito: true,
      datos: {
        nivel: {
          usuario_id: usuarioInvitado.id,
          xp_total: 150,
          numero_nivel: 3,
          nombre_nivel: "Explorador"
        },
        logros: []
      }
    });
  });

  it("mantiene viva la ruta canónica /health", async () => {
    const response = await app.fetch(new Request("http://localhost/health"), env);

    expect(response.status).toBe(200);
  });
});
