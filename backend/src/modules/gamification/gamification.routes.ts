import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { responderExito } from "../../shared/http/respuesta";
import { serializarNivelUsuario } from "../../shared/serializers/progreso.serializer";

export const gamificationRoutes = new Hono<AppBindings>();

gamificationRoutes.use("*", authMiddleware);

gamificationRoutes.get("/mi", async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const { data: level, error: levelError } = await db
    .from("v_nivel_usuario")
    .select("*")
    .eq("usuario_id", user.id)
    .single();

  if (levelError) {
    throw levelError;
  }

  const { data: achievements, error: achievementsError } = await db
    .from("logro_usuario")
    .select("*, achievement:logro(*)")
    .eq("usuario_id", user.id);

  if (achievementsError) {
    throw achievementsError;
  }

  return responderExito({
    nivel: level
      ? serializarNivelUsuario({
          usuario_id: String(level.usuario_id ?? ""),
          xp_total: Number(level.xp_total ?? 0),
          numero_nivel: Number(level.numero_nivel ?? 0),
          nombre_nivel: String(level.nombre_nivel ?? "")
        })
      : null,
    logros: achievements ?? []
  });
});
