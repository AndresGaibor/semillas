import { eq, sql } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";

export type GamificationRepository = ReturnType<typeof crearGamificationRepository>;

export function crearGamificationRepository(db: DbClient) {
  return {
    async obtenerNivelUsuario(usuarioId: string) {
      const level = await db.execute(sql`
        select usuario_id, xp_total, numero_nivel, nombre_nivel
        from v_nivel_usuario
        where usuario_id = ${usuarioId}
        limit 1
      `);

      return Array.isArray(level) ? level[0] ?? null : (level as unknown as Array<Record<string, unknown>>)[0] ?? null;
    },
    async listarLogrosUsuario(usuarioId: string) {
      return db
        .select({
          usuario_id: schema.logroUsuario.usuarioId,
          logro_id: schema.logroUsuario.logroId,
          ganado_en: schema.logroUsuario.ganadoEn,
          logro: schema.logro
        })
        .from(schema.logroUsuario)
        .leftJoin(schema.logro, eq(schema.logroUsuario.logroId, schema.logro.id))
        .where(eq(schema.logroUsuario.usuarioId, usuarioId));
    }
  };
}
