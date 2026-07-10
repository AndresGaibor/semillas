import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { responderExito } from "../../shared/http/respuesta";
import { serializarNivelUsuario } from "../../shared/serializers/progreso.serializer";
import { db, schema } from "../../db/client";

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
  const logro = (fila.logro ?? null) as Record<string, unknown> | null;

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
  const user = c.get("user");

  // La vista todavía no está declarada en el schema, así que la consultamos con SQL explícito.
  const level = await db.execute(sql`
    select usuario_id, xp_total, numero_nivel, nombre_nivel
    from v_nivel_usuario
    where usuario_id = ${user.id}
    limit 1
  `);

  const logros = await db
    .select({
      usuario_id: schema.logroUsuario.usuarioId,
      logro_id: schema.logroUsuario.logroId,
      ganado_en: schema.logroUsuario.ganadoEn,
      logro: schema.logro
    })
    .from(schema.logroUsuario)
    .leftJoin(schema.logro, eq(schema.logroUsuario.logroId, schema.logro.id))
    .where(eq(schema.logroUsuario.usuarioId, user.id));

  const filaNivel = Array.isArray(level) ? level[0] : (level as unknown as Array<Record<string, unknown>>)[0];

  return responderExito({
    nivel: filaNivel
      ? serializarNivelUsuario({
          usuario_id: String(filaNivel.usuario_id ?? ""),
          xp_total: Number(filaNivel.xp_total ?? 0),
          numero_nivel: Number(filaNivel.numero_nivel ?? 0),
          nombre_nivel: String(filaNivel.nombre_nivel ?? "")
        })
      : null,
    logros: logros.map((logroUsuario) =>
      serializarLogroUsuario({
        usuario_id: logroUsuario.usuario_id,
        logro_id: logroUsuario.logro_id,
        ganado_en: logroUsuario.ganado_en.toISOString(),
        logro: logroUsuario.logro
          ? {
              ...logroUsuario.logro,
              creado_en: logroUsuario.logro.creadoEn.toISOString()
            }
          : null
      })
    )
  });
});
