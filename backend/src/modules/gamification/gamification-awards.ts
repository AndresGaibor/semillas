import { and, eq, sql } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";

export type LogroDesbloqueado = {
  id: string;
  codigo: string;
  nombre: string;
  bonoXp: number;
};

type MetricasLogros = {
  temas_completados: number;
  actividades_completadas: number;
  dias_racha: number;
  xp_total: number;
};

async function obtenerMetricas(db: DbClient, usuarioId: string): Promise<MetricasLogros> {
  const [[temas], [actividades], [racha], [xp]] = await Promise.all([
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.progresoTemaUsuario)
      .where(and(
        eq(schema.progresoTemaUsuario.usuarioId, usuarioId),
        eq(schema.progresoTemaUsuario.estado, "completado"),
      )),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.progresoActividadUsuario)
      .where(and(
        eq(schema.progresoActividadUsuario.usuarioId, usuarioId),
        eq(schema.progresoActividadUsuario.completado, true),
      )),
    db
      .select({ total: schema.rachaUsuario.diasActuales })
      .from(schema.rachaUsuario)
      .where(eq(schema.rachaUsuario.usuarioId, usuarioId)),
    db
      .select({ total: sql<number>`coalesce(sum(${schema.movimientoXp.cantidad}), 0)::int` })
      .from(schema.movimientoXp)
      .where(eq(schema.movimientoXp.usuarioId, usuarioId)),
  ]);

  return {
    temas_completados: Number(temas?.total ?? 0),
    actividades_completadas: Number(actividades?.total ?? 0),
    dias_racha: Number(racha?.total ?? 0),
    xp_total: Number(xp?.total ?? 0),
  };
}

/**
 * Evalúa el catálogo administrable de logros. La inserción en logro_usuario y
 * el libro mayor de XP son las barreras de idempotencia. El cliente nunca
 * decide si un logro corresponde ni cuánto XP entrega.
 */
export async function evaluarYDesbloquearLogros(
  db: DbClient,
  usuarioId: string,
): Promise<LogroDesbloqueado[]> {
  const [metricas, logrosActivos] = await Promise.all([
    obtenerMetricas(db, usuarioId),
    db.select().from(schema.logro).where(eq(schema.logro.activo, true)),
  ]);

  const desbloqueados: LogroDesbloqueado[] = [];

  for (const logro of logrosActivos) {
    const criterio = logro.codigoCriterio as keyof MetricasLogros;
    if (!(criterio in metricas)) continue;

    const requerido = Math.max(1, Number(logro.valorCriterio ?? 1));
    if (metricas[criterio] < requerido) continue;

    const nuevo = await db.transaction(async (tx) => {
      const [registro] = await tx
        .insert(schema.logroUsuario)
        .values({ usuarioId, logroId: logro.id })
        .onConflictDoNothing()
        .returning();

      if (!registro) return false;

      return true;
    });

    if (nuevo) {
      desbloqueados.push({
        id: logro.id,
        codigo: logro.codigo,
        nombre: logro.nombre,
        bonoXp: Math.max(0, Number(logro.bonoXp ?? 0)),
      });
    }
  }

  return desbloqueados;
}

/** Reclama un logro desbloqueado y otorga su XP una sola vez. */
export async function reclamarLogro(
  db: DbClient,
  usuarioId: string,
  logroId: string,
): Promise<{ bonoXp: number; nombre: string } | null> {
  return db.transaction(async (tx) => {
    const [existente] = await tx
      .select({
        logroId: schema.logroUsuario.logroId,
        reclamadoEn: schema.logroUsuario.reclamadoEn,
        bonoXp: schema.logro.bonoXp,
        nombre: schema.logro.nombre,
        codigo: schema.logro.codigo,
      })
      .from(schema.logroUsuario)
      .leftJoin(schema.logro, eq(schema.logroUsuario.logroId, schema.logro.id))
      .where(and(
        eq(schema.logroUsuario.usuarioId, usuarioId),
        eq(schema.logroUsuario.logroId, logroId),
      ))
      .limit(1);

    if (!existente) return null;
    if (existente.reclamadoEn !== null) return { bonoXp: 0, nombre: existente.nombre ?? "" };

    const ahora = new Date();
    await tx.update(schema.logroUsuario)
      .set({ reclamadoEn: ahora })
      .where(and(
        eq(schema.logroUsuario.usuarioId, usuarioId),
        eq(schema.logroUsuario.logroId, logroId),
      ));

    const bonoXp = Math.max(0, Number(existente.bonoXp ?? 0));
    if (bonoXp > 0) {
      await tx.insert(schema.movimientoXp).values({
        usuarioId,
        origen: "logro",
        origenId: logroId,
        cantidad: bonoXp,
        metadatos: { logro_codigo: existente.codigo ?? "", origen: "reclamacion_usuario" },
      }).onConflictDoNothing();
    }

    return { bonoXp, nombre: existente.nombre ?? "" };
  });
}
