import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito, responderError } from "../../shared/http/respuesta";
import { syncPullQuerySchema, syncPushBodySchema } from "./sync.schemas";
import { db as dbPredeterminado, type DbClient } from "../../db/client";
import { crearSyncRepository, type SyncRepository } from "./sync.repository";
import { crearCasoObtenerSyncPull } from "./casos-uso/obtener-sync-pull";
import { crearCasoProcesarSyncPush } from "./casos-uso/procesar-sync-push";

type Dependencias = {
  db?: DbClient;
  authMiddleware?: MiddlewareHandler<AppBindings>;
  repositorio?: SyncRepository;
};

export function crearModuloSync({
  db = dbPredeterminado,
  authMiddleware: middlewareAutenticacion = authMiddleware,
  repositorio = crearSyncRepository({ db })
}: Dependencias = {}) {
  const syncRoutes = new Hono<AppBindings>();
  const obtenerSyncPull = crearCasoObtenerSyncPull({ repositorio });
  const procesarSyncPush = crearCasoProcesarSyncPush({ repositorio });

  syncRoutes.use("*", middlewareAutenticacion);

  syncRoutes.get(
    "/pull",
    zValidator("query", syncPullQuerySchema),
    async (c) => {
      const user = c.get("user");
      const { since } = c.req.valid("query");
      const datos = await obtenerSyncPull(user.id, since);

      return responderExito(datos);
    }
  );

  syncRoutes.post(
    "/push",
    zValidator("json", syncPushBodySchema),
    async (c) => {
      const user = c.get("user");
      const { eventos } = c.req.valid("json");
      const resultado = await procesarSyncPush(user.id, eventos);

      return responderExito(resultado, resultado.procesados > 0 ? 201 : 200);
    }
  );

  return syncRoutes;
}

export const syncRoutes = crearModuloSync();
