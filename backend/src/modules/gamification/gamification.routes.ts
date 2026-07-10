import { Hono } from "hono";
import type { Context } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { responderExito } from "../../shared/http/respuesta";
import { crearGamificationRepository } from "./gamification.repository";
import { crearCasoObtenerMiGamificacion } from "./casos-uso/obtener-mi";

export const gamificationRoutes = new Hono<AppBindings>();

gamificationRoutes.use("*", authMiddleware);

function obtenerServicio(c: Context<AppBindings>) {
  const cliente = c.get("drizzle");
  if (!cliente) throw new Error("Cliente Drizzle no disponible");
  const repositorio = crearGamificationRepository(cliente);
  return crearCasoObtenerMiGamificacion(repositorio);
}

gamificationRoutes.get("/mi", async (c) => {
  const servicio = obtenerServicio(c);
  return responderExito(await servicio(c.get("user").id));
});
