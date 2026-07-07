import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { responderExito } from "../../shared/http/respuesta";
import { serializarNivelUsuario } from "../../shared/serializers/progreso.serializer";

function serializarLogro(logro: Record<string, unknown>) {
  return {
    id: String(logro.id ?? ""),
    codigo: String(logro.codigo ?? ""),
    nombre: String(logro.nombre ?? ""),
    descripcion: (logro.descripcion ?? null) as string | null,
    codigo_criterio: String(logro.codigo_criterio ?? ""),
    valor_criterio: (logro.valor_criterio ?? null) as number | null,
    bono_xp: Number(logro.bono_xp ?? 0),
    url_icono: (logro.url_icono ?? null) as string | null,
    activo: Boolean(logro.activo ?? false),
    creado_en: String(logro.creado_en ?? "")
  };
}

function serializarLogroUsuario(fila: Record<string, unknown>) {
  const logro = (fila.logro ?? fila.achievement ?? null) as Record<string, unknown> | null;

  return {
    usuario_id: String(fila.usuario_id ?? ""),
    logro_id: String(fila.logro_id ?? ""),
    ganado_en: String(fila.ganado_en ?? ""),
    ...(logro ? { logro: serializarLogro(logro) } : {})
  };
}

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

  const { data: logros, error: logrosError } = await db
    .from("logro_usuario")
    .select("*, logro(*)")
    .eq("usuario_id", user.id);

  if (logrosError) {
    throw logrosError;
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
    logros: (logros ?? []).map((logroUsuario) => serializarLogroUsuario(logroUsuario as Record<string, unknown>))
  });
});
