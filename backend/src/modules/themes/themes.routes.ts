import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../../config/env";
import { createSupabaseAdmin, db as dbPredeterminado, type DbClient } from "../../db/client";
import { NotFoundError } from "../../shared/errors/http-error";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { crearThemesRepository } from "./themes.repository";
import { crearThemesService } from "./themes.service";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Dependencias = {
  db?: DbClient;
  createSupabaseAdmin?: typeof createSupabaseAdmin;
  authMiddleware?: MiddlewareHandler<AppBindings>;
};

export function crearModuloThemes({
  db = dbPredeterminado,
  createSupabaseAdmin: crearAdmin = createSupabaseAdmin
}: Dependencias = {}) {
  const themesRoutes = new Hono<AppBindings>();
  const repositorio = crearThemesRepository(db);
  const servicio = crearThemesService({ themes: repositorio, crearSupabaseAdmin: crearAdmin });

  themesRoutes.get("/", async (c) => {
    const sendaId = c.req.query("senda_id") ?? undefined;
    return responderExito(await servicio.listarTemasPublicos(sendaId));
  });

  themesRoutes.get("/:tema_id/portada", async (c) => {
    const temaId = c.req.param("tema_id");

    if (!UUID_REGEX.test(temaId)) {
      return responderError("El ID del tema debe ser un UUID válido", "VALIDATION_ERROR", 400);
    }

    const portada = await servicio.obtenerPortadaTema(c.env, temaId);

    if (!portada) {
      throw new NotFoundError("El tema no tiene portada activa");
    }

    return responderExito({
      url: portada.url,
      expiraEnSegundos: portada.expiraEnSegundos
    });
  });

  themesRoutes.get("/:tema_id", async (c) => {
    const temaId = c.req.param("tema_id");
    const tema = await servicio.obtenerTemaPublico(temaId);

    if (!tema) {
      throw new NotFoundError("Tema no encontrado");
    }

    return responderExito(tema);
  });

  themesRoutes.get("/:tema_id/pasos", async (c) => {
    const temaId = c.req.param("tema_id");
    const grupoEdadId = c.req.query("grupo_edad_id") ?? undefined;
    return responderExito(await servicio.listarPasosTema(temaId, grupoEdadId));
  });

  themesRoutes.get("/:tema_id/actividades", async (c) => {
    const temaId = c.req.param("tema_id");
    const grupoEdadId = c.req.query("grupo_edad_id") ?? undefined;
    return responderExito(await servicio.listarActividadesTema(temaId, grupoEdadId));
  });

  return themesRoutes;
}

export const themesRoutes = crearModuloThemes();
