import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../../config/env";
import { db as dbPredeterminado, type DbClient } from "../../db/client";
import { responderExito } from "../../shared/http/respuesta";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderActividadSchema } from "./activities.schemas";
import { crearActivitiesRepository } from "./activities.repository";
import { crearCasoListarActividades } from "./casos-uso/listar-actividades";
import { crearCasoObtenerActividad } from "./casos-uso/obtener-actividad";
import { crearCasoResponderActividad } from "./casos-uso/responder-actividad";

type Dependencias = {
  db?: DbClient;
  authMiddleware?: MiddlewareHandler<AppBindings>;
};

export function crearModuloActivities({
  db = dbPredeterminado,
  authMiddleware: middlewareAutenticacion = authMiddleware
}: Dependencias = {}) {
  const activitiesRoutes = new Hono<AppBindings>();
  const actividades = crearActivitiesRepository(db);
  const listarActividades = crearCasoListarActividades({ actividades });
  const obtenerActividad = crearCasoObtenerActividad({ actividades });
  const responderActividad = crearCasoResponderActividad({ actividades });

  activitiesRoutes.get("/", async (c) => {
    return responderExito(await listarActividades());
  });

  activitiesRoutes.get("/:actividad_id", async (c) => {
    return responderExito(await obtenerActividad(c.req.param("actividad_id")));
  });

  activitiesRoutes.post(
    "/:actividad_id/responder",
    middlewareAutenticacion,
    zValidator("json", responderActividadSchema),
    async (c) => {
      const usuario = c.get("user");
      const actividadId = c.req.param("actividad_id");
      const cuerpo = c.req.valid("json");

      return responderExito(
        await responderActividad(usuario, actividadId, cuerpo),
        201
      );
    }
  );

  return activitiesRoutes;
}

export const activitiesRoutes = crearModuloActivities();
