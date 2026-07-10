import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../../config/env";
import { db as dbPredeterminado, type DbClient } from "../../db/client";
import { responderExito } from "../../shared/http/respuesta";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { progressEventSchema } from "./progress.schemas";
import { crearProgressRepository } from "./progress.repository";
import { crearCasoObtenerMiProgreso } from "./casos-uso/obtener-mi-progreso";
import { crearCasoRegistrarEvento } from "./casos-uso/registrar-evento";

type Dependencias = {
  db?: DbClient;
  authMiddleware?: MiddlewareHandler<AppBindings>;
};

export function crearModuloProgress({
  db = dbPredeterminado,
  authMiddleware: middlewareAutenticacion = authMiddleware
}: Dependencias = {}) {
  const progressRoutes = new Hono<AppBindings>();
  const progreso = crearProgressRepository(db);
  const obtenerMiProgreso = crearCasoObtenerMiProgreso({ progreso });
  const registrarEvento = crearCasoRegistrarEvento({ progreso });

  progressRoutes.use("*", middlewareAutenticacion);

  progressRoutes.get("/mi", async (c) => {
    const user = c.get("user");
    return responderExito(await obtenerMiProgreso(user.id));
  });

  progressRoutes.post(
    "/eventos",
    zValidator("json", progressEventSchema),
    async (c) => {
      const user = c.get("user");
      const body = c.req.valid("json");
      const resultado = await registrarEvento(user.id, body);

      return responderExito(resultado, resultado.duplicado ? 200 : 201);
    }
  );

  return progressRoutes;
}

export const progressRoutes = crearModuloProgress();
