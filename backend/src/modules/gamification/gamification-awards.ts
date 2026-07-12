import { and, desc, eq, inArray, sql } from "drizzle-orm";
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
};

function fechaUtc(fecha: Date) {
  return fecha.toISOString().slice(0, 10);
}

function restarDias(fecha: Date, cantidad: number) {
  const copia = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()));
  copia.setUTCDate(copia.getUTCDate() - cantidad);
  return copia;
}

function calcularRacha(dias: string[]) {
  if (dias.length === 0) return 0;

  const disponibles = new Set(dias);
  const ahora = new Date();
  const hoy = fechaUtc(ahora);
  const ayer = fechaUtc(restarDias(ahora, 1));
  let cursor = disponibles.has(hoy) ? ahora : disponibles.has(ayer) ? restarDias(ahora, 1) : null;
  if (!cursor) return 0;

  let racha = 0;
  while (disponibles.has(fechaUtc(cursor))) {
    racha += 1;
    cursor = restarDias(cursor, 1);
  }
  return racha;
}

async function obtenerMetricas(db: DbClient, usuarioId: string): Promise<MetricasLogros> {
  const [[temas], [actividades], filasDias] = await Promise.all([
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.progresoTemaUsuario)
      .where(and(
        eq(schema.progresoTemaUsuario.usuarioId, usuarioId),
        eq(schema.progresoTemaUsuario.estado, "completado"),
      ))
      .limit(1),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.progresoActividadUsuario)
      .where(and(
        eq(schema.progresoActividadUsuario.usuarioId, usuarioId),
        eq(schema.progresoActividadUsuario.completado, true),
      ))
      .limit(1),
    db
      .select({ dia: sql<string>`(${schema.eventoProgreso.recibidoEnServidor} at time zone 'UTC')::date::text` })
      .from(schema.eventoProgreso)
      .where(and(
        eq(schema.eventoProgreso.usuarioId, usuarioId),
        inArray(schema.eventoProgreso.tipoEvento, ["tema_completado", "actividad_respondida"]),
        sql`(${schema.eventoProgreso.tipoEvento} = 'tema_completado' or ${schema.eventoProgreso.correcta} = true)`,
      ))
      .groupBy(sql`(${schema.eventoProgreso.recibidoEnServidor} at time zone 'UTC')::date`)
      .orderBy(desc(sql`(${schema.eventoProgreso.recibidoEnServidor} at time zone 'UTC')::date`))
      .limit(366),
  ]);

  return {
    temas_completados: Number(temas?.total ?? 0),
    actividades_completadas: Number(actividades?.total ?? 0),
    dias_racha: calcularRacha(filasDias.map((fila) => fila.dia)),
  };
}

/**
 * Evalúa el catálogo de logros y desbloquea los que el usuario cumple.
 * Los logros se insertan con reclamado_en = NULL (pendientes de reclamar).
 * La XP se otorga SOLO cuando el usuario hace clic en "Reclamar".
 */
export async function evaluarYDesbloquearLogros(
  db: DbClient,
  usuarioId: string,
): Promise<LogroDesbloqueado[]> {
  const [metricas, logrosActivos] = await Promise.all([
    obtenerMetricas(db, usuarioId),
    db
      .select()
      .from(schema.logro)
      .where(eq(schema.logro.activo, true)),
  ]);

  const desbloqueados: LogroDesbloqueado[] = [];

  for (const logro of logrosActivos) {
    const criterio = logro.codigoCriterio as keyof MetricasLogros;
    if (!(criterio in metricas)) continue;

    const requerido = Number(logro.valorCriterio ?? 1);
    if (metricas[criterio] < requerido) continue;

    // Insertar con reclamado_en = null (pendiente de reclamar, sin XP aún)
    const [registro] = await db
      .insert(schema.logroUsuario)
      .values({ usuarioId, logroId: logro.id, reclamadoEn: null })
      .onConflictDoNothing()
      .returning();

    if (registro) {
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

/**
 * Reclama un logro desbloqueado: setea reclamado_en = now() y otorga el bono XP.
 * Es idempotente: si ya estaba reclamado, no hace nada.
 * Devuelve el bono XP otorgado (0 si ya estaba reclamado).
 */
export async function reclamarLogro(
  db: DbClient,
  usuarioId: string,
  logroId: string,
): Promise<{ bonoXp: number; nombre: string } | null> {
  return db.transaction(async (tx) => {
    // Verificar que el logro existe para este usuario y aún no fue reclamado
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
      .where(
        and(
          eq(schema.logroUsuario.usuarioId, usuarioId),
          eq(schema.logroUsuario.logroId, logroId),
        )
      )
      .limit(1);

    if (!existente) return null; // El logro no existe o no pertenece al usuario
    if (existente.reclamadoEn !== null) {
      // Ya fue reclamado, retornar info sin hacer nada
      return { bonoXp: 0, nombre: existente.nombre ?? "" };
    }

    // Marcar como reclamado
    const ahora = new Date();
    await tx
      .update(schema.logroUsuario)
      .set({ reclamadoEn: ahora })
      .where(
        and(
          eq(schema.logroUsuario.usuarioId, usuarioId),
          eq(schema.logroUsuario.logroId, logroId),
        )
      );

    // Otorgar bono XP si corresponde
    const bonoXp = Math.max(0, Number(existente.bonoXp ?? 0));
    if (bonoXp > 0) {
      await tx.insert(schema.eventoProgreso).values({
        usuarioId,
        idEventoCliente: crypto.randomUUID(),
        tipoEvento: "recompensa_reclamada",
        datos: {
          logro_id: logroId,
          logro_codigo: existente.codigo ?? "",
          origen: "reclamacion_usuario",
        },
        xpOtorgada: bonoXp,
        ocurridoEnCliente: ahora,
        recibidoEnServidor: ahora,
      });
    }

    return { bonoXp, nombre: existente.nombre ?? "" };
  });
}
