import { afterEach, describe, expect, it } from "bun:test";
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

const usuarioAdmin = {
  id: "usuario-admin-1",
  rol: "administrador",
  proveedor: "invitado",
  nombre_visible: "Admin",
  correo: null
};

const usuarioGoogle = {
  id: "usuario-google-1",
  rol: "usuario",
  proveedor: "google",
  nombre_visible: "Alma",
  correo: "alma@example.com"
};

const perfilInvitado = {
  id: "perfil-1",
  usuario_id: usuarioInvitado.id,
  apodo: "Semillero",
  grupo_edad_id: "550e8400-e29b-41d4-a716-446655440000",
  url_avatar: "https://cdn.ejemplo.com/avatar.png",
  clave_avatar: "semilla",
  prefiere_audio: true,
  tamano_texto_preferido: "medio"
};

const originalFetch = globalThis.fetch;

function instalarMockSupabase() {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(String(input), init);
    const url = new URL(request.url);
    const metodo = request.method.toUpperCase();
    const ruta = url.pathname;
    const prefer = request.headers.get("prefer") ?? "";

    if (ruta.includes("/rest/v1/usuario_app")) {
      if (metodo === "POST") {
        return new Response(JSON.stringify(usuarioInvitado), {
          status: 201,
          headers: { "content-type": "application/json" }
        });
      }

      if (metodo === "GET") {
        const idFiltro = url.searchParams.get("id") ?? "";
        const idExternoFiltro = url.searchParams.get("id_externo") ?? "";
        if (idFiltro.includes(usuarioAdmin.id)) {
          return new Response(JSON.stringify(usuarioAdmin), {
            status: 200,
            headers: { "content-type": "application/json" }
          });
        }

        if (idFiltro.includes(usuarioGoogle.id) || idExternoFiltro.includes(usuarioGoogle.id)) {
          return new Response(JSON.stringify(usuarioGoogle), {
            status: 200,
            headers: { "content-type": "application/json" }
          });
        }

        return new Response(JSON.stringify(usuarioInvitado), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }
    }

    if (ruta.includes("/auth/v1/user")) {
      return new Response(
        JSON.stringify({
          user: {
            id: usuarioGoogle.id,
            email: usuarioGoogle.correo,
            app_metadata: { provider: usuarioGoogle.proveedor },
            user_metadata: { full_name: usuarioGoogle.nombre_visible }
          }
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" }
        }
      );
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

    if (ruta.includes("/rest/v1/senda")) {
      return new Response(
        JSON.stringify([
          {
            id: "senda-1",
            code: "PADRE",
            name: "Senda del Padre",
            description: "Dios es nuestro Padre amoroso.",
            color_hex: "#3D8BD4",
            icon_name: "crown",
            sort_order: 1
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

    if (metodo === "GET" && ruta.includes("/rest/v1/tema") && prefer.includes("head=true")) {
      return new Response("", {
        status: 200,
        headers: { "content-range": "0-0/1", "content-type": "application/json" }
      });
    }

    if (metodo === "GET" && ruta.includes("/rest/v1/actividad") && prefer.includes("head=true")) {
      return new Response("", {
        status: 200,
        headers: { "content-range": "0-0/1", "content-type": "application/json" }
      });
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }) as typeof fetch;
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
          grupo_edad_id: "550e8400-e29b-41d4-a716-446655440000",
          url_avatar: "https://cdn.ejemplo.com/avatar.png"
        })
      }),
      env
    );

    expect(response.status).toBe(201);
    expect(await jsonResponse(response)).toEqual({
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
      app.fetch(new Request("http://localhost/administracion/resumen", { headers: { "x-guest-user-id": usuarioAdmin.id } }), env),
      app.fetch(new Request("http://localhost/gamificacion/mi", { headers: { "x-guest-user-id": guestUserId } }), env)
    ]);

    expect(responses.map((response) => response.status)).toEqual([200, 200, 200, 200, 200, 200, 200]);

    expect(await jsonResponse(responses[0])).toEqual({
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

    expect(await jsonResponse(responses[1])).toEqual({
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

    expect(await jsonResponse(responses[2])).toEqual({
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

    expect(await jsonResponse(responses[3])).toEqual({
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

    expect(await jsonResponse(responses[4])).toEqual({
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

    const adminBody = await jsonResponse(responses[5]);
    expect(adminBody).toHaveProperty("exito", true);
    expect(adminBody).toHaveProperty("datos");
    expect(adminBody).not.toHaveProperty("ok");
    expect(adminBody).not.toHaveProperty("data");
    expect((adminBody as { datos: Record<string, unknown> }).datos).toMatchObject({
      temas: expect.any(Number),
      publicados: expect.any(Number),
      usuarios: expect.any(Number),
      actividades: expect.any(Number)
    });

    const eliminarTema = await app.fetch(
      new Request("http://localhost/administracion/temas/tema-1", {
        method: "DELETE",
        headers: { "x-guest-user-id": usuarioAdmin.id }
      }),
      env
    );

    expect(eliminarTema.status).toBe(200);
    const eliminarTemaBody = await jsonResponse(eliminarTema);
    expect(eliminarTemaBody).toHaveProperty("exito", true);
    expect(eliminarTemaBody).toHaveProperty("datos", { deleted: true });
    expect(eliminarTemaBody).not.toHaveProperty("ok");
    expect(eliminarTemaBody).not.toHaveProperty("data");

    expect(await jsonResponse(responses[6])).toEqual({
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

  it("expone sendas con envelope y claves canónicas en español", async () => {
    instalarMockSupabase();

    const response = await app.fetch(new Request("http://localhost/sendas"), env);

    expect(response.status).toBe(200);

    expect(await jsonResponse(response)).toEqual({
      exito: true,
      datos: [
        {
          id: "senda-1",
          codigo: "PADRE",
          nombre: "Senda del Padre",
          descripcion: "Dios es nuestro Padre amoroso.",
          color_hex: "#3D8BD4",
          nombre_icono: "crown",
          orden: 1
        }
      ]
    });
  });

  it("responde configuracion-dev con envelope español fuera de desarrollo", async () => {
    instalarMockSupabase();

    const response = await app.fetch(
      new Request("http://localhost/autenticacion/configuracion-dev", {
        method: "POST"
      }),
      {
        ...env,
        APP_ENV: "production"
      }
    );

    expect(response.status).toBe(403);
    expect(await jsonResponse(response)).toEqual({
      exito: false,
      error: "No disponible fuera de desarrollo",
      codigo: "NO_DISPONIBLE_EN_DESARROLLO"
    });
  });

  it("expone gamificación con la clave logro y sin achievement", async () => {
    instalarMockSupabase();

    const baseFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      const url = new URL(request.url);

      if (url.pathname.includes("/rest/v1/logro_usuario")) {
        return new Response(
          JSON.stringify([
            {
              usuario_id: usuarioInvitado.id,
              logro_id: "logro-1",
              ganado_en: "2026-01-02T00:00:00.000Z",
              achievement: {
                id: "logro-1",
                codigo: "PRIMER_TEMA",
                nombre: "Primer paso",
                descripcion: "Completaste tu primera lección.",
                codigo_criterio: "temas_completados",
                valor_criterio: 1,
                bono_xp: 20,
                url_icono: null,
                activo: true,
                creado_en: "2026-01-01T00:00:00.000Z"
              }
            }
          ]),
          {
            status: 200,
            headers: { "content-type": "application/json" }
          }
        );
      }

      return baseFetch(input, init);
    }) as typeof fetch;

    const response = await app.fetch(
      new Request("http://localhost/gamificacion/mi", {
        headers: { "x-guest-user-id": usuarioInvitado.id }
      }),
      env
    );

    expect(response.status).toBe(200);
    expect(await jsonResponse(response)).toEqual({
      exito: true,
      datos: {
        nivel: {
          usuario_id: usuarioInvitado.id,
          xp_total: 150,
          numero_nivel: 3,
          nombre_nivel: "Explorador"
        },
        logros: [
          {
            usuario_id: usuarioInvitado.id,
            logro_id: "logro-1",
            ganado_en: "2026-01-02T00:00:00.000Z",
            logro: {
              id: "logro-1",
              codigo: "PRIMER_TEMA",
              nombre: "Primer paso",
              descripcion: "Completaste tu primera lección.",
              codigo_criterio: "temas_completados",
              valor_criterio: 1,
              bono_xp: 20,
              url_icono: null,
              activo: true,
              creado_en: "2026-01-01T00:00:00.000Z"
            }
          }
        ]
      }
    });
  });

  it("preserva el proveedor real del usuario autenticado existente", async () => {
    instalarMockSupabase();

    const response = await app.fetch(
      new Request("http://localhost/perfil", {
        headers: { Authorization: "Bearer token-google" }
      }),
      env
    );

    expect(response.status).toBe(200);

    const body = await jsonResponse(response);
    expect(body).toEqual({
      exito: true,
      datos: {
        usuario: {
          id: usuarioGoogle.id,
          rol: usuarioGoogle.rol,
          proveedor: "google",
          nombre_visible: usuarioGoogle.nombre_visible,
          correo: usuarioGoogle.correo
        },
        perfil: perfilInvitado
      }
    });
  });

  it("mantiene viva la ruta canónica /health", async () => {
    const response = await app.fetch(new Request("http://localhost/health"), env);

    expect(response.status).toBe(200);
  });

  it("rechaza aliases legacy con 404", async () => {
    const rutasLegacy = ["/auth", "/me", "/themes", "/activities", "/progress", "/admin"];

    const respuestas = await Promise.all(rutasLegacy.map((ruta) => app.fetch(new Request(`http://localhost${ruta}`), env)));

    expect(respuestas.map((response) => response.status)).toEqual([404, 404, 404, 404, 404, 404]);
  });
});
