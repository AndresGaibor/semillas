import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";
import { obtenerMetricasCriterio, obtenerResumenGamificacion } from "./gamification-engine";
import { reclamarLogro } from "./gamification-awards";

export type GamificationRepository = ReturnType<typeof crearGamificationRepository>;

export function crearGamificationRepository(db: DbClient) {
  return {
    async obtenerResumen(usuarioId: string) {
      return obtenerResumenGamificacion(db, usuarioId);
    },

    async listarCatalogoLogros(usuarioId: string) {
      const [catalogo, ganados, metricas] = await Promise.all([
        db.select().from(schema.logro).where(eq(schema.logro.activo, true)).orderBy(asc(schema.logro.creadoEn)),
        db.select().from(schema.logroUsuario).where(eq(schema.logroUsuario.usuarioId, usuarioId)),
        obtenerMetricasCriterio(db, usuarioId),
      ]);
      const ganadosMap = new Map(ganados.map((item) => [item.logroId, item]));

      return catalogo.map((logro) => {
        const actual = Number(metricas[logro.codigoCriterio as keyof typeof metricas] ?? 0);
        const objetivo = Math.max(1, Number(logro.valorCriterio ?? 1));
        return {
          ...logro,
          obtenido: ganadosMap.has(logro.id),
          ganadoEn: ganadosMap.get(logro.id)?.ganadoEn ?? null,
          reclamadoEn: ganadosMap.get(logro.id)?.reclamadoEn ?? null,
          progresoActual: Math.min(actual, objetivo),
          progresoObjetivo: objetivo,
          porcentaje: Math.min(100, Math.round((actual / objetivo) * 100)),
        };
      });
    },

    async listarNiveles() {
      return db.select().from(schema.reglaNivel).orderBy(asc(schema.reglaNivel.numeroNivel));
    },

    async listarHistorial(usuarioId: string, limit = 50, offset = 0) {
      const [movimientos, [total]] = await Promise.all([
        db
          .select()
          .from(schema.movimientoXp)
          .where(eq(schema.movimientoXp.usuarioId, usuarioId))
          .orderBy(desc(schema.movimientoXp.creadoEn))
          .limit(limit)
          .offset(offset),
        db
          .select({ total: sql<number>`count(*)::int` })
          .from(schema.movimientoXp)
          .where(eq(schema.movimientoXp.usuarioId, usuarioId)),
      ]);
      return { movimientos, total: Number(total?.total ?? 0), limit, offset };
    },

    async listarLogrosUsuario(usuarioId: string) {
      return db
        .select({
          usuario_id: schema.logroUsuario.usuarioId,
          logro_id: schema.logroUsuario.logroId,
          ganado_en: schema.logroUsuario.ganadoEn,
          reclamado_en: schema.logroUsuario.reclamadoEn,
          logro: schema.logro,
        })
        .from(schema.logroUsuario)
        .leftJoin(schema.logro, eq(schema.logroUsuario.logroId, schema.logro.id))
        .where(eq(schema.logroUsuario.usuarioId, usuarioId))
        .orderBy(desc(schema.logroUsuario.ganadoEn));
    },

    async obtenerEstadisticasGlobales() {
      const [[xp], [usuarios], [rachas]] = await Promise.all([
        db.select({ total: sql<number>`coalesce(sum(${schema.movimientoXp.cantidad}), 0)::int` }).from(schema.movimientoXp),
        db.select({ total: sql<number>`count(distinct ${schema.movimientoXp.usuarioId})::int` }).from(schema.movimientoXp),
        db.select({ promedio: sql<number>`coalesce(avg(${schema.rachaUsuario.diasActuales}), 0)::numeric` }).from(schema.rachaUsuario),
      ]);
      return {
        xp_otorgada: Number(xp?.total ?? 0),
        usuarios_con_xp: Number(usuarios?.total ?? 0),
        racha_promedio: Number(rachas?.promedio ?? 0),
      };
    },

    async reclamarLogro(usuarioId: string, logroId: string) {
      return reclamarLogro(db, usuarioId, logroId);
    },

    async contarLogrosPendientesReclamar(usuarioId: string): Promise<number> {
      const [resultado] = await db
        .select({ total: sql<number>`count(*)::int` })
        .from(schema.logroUsuario)
        .where(sql`${schema.logroUsuario.usuarioId} = ${usuarioId} AND ${schema.logroUsuario.reclamadoEn} IS NULL`);
      return Number(resultado?.total ?? 0);
    },
  };
}
