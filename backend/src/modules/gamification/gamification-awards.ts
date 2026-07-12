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
 * Evalúa el catálogo administrable de logros después de reconciliar progreso.
 * La inserción en logro_usuario es la barrera de idempotencia. El bono XP se
 * registra como evento del servidor para que v_nivel_usuario lo contabilice.
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

    const nuevo = await db.transaction(async (tx) => {
      const [registro] = await tx
        .insert(schema.logroUsuario)
        .values({ usuarioId, logroId: logro.id })
        .onConflictDoNothing()
        .returning();

      if (!registro) return false;

      const bonoXp = Math.max(0, Number(logro.bonoXp ?? 0));
      if (bonoXp > 0) {
        const ahora = new Date();
        await tx.insert(schema.eventoProgreso).values({
          usuarioId,
          idEventoCliente: crypto.randomUUID(),
          tipoEvento: "recompensa_reclamada",
          datos: {
            logro_id: logro.id,
            logro_codigo: logro.codigo,
            origen: "evaluacion_automatica",
          },
          xpOtorgada: bonoXp,
          ocurridoEnCliente: ahora,
          recibidoEnServidor: ahora,
        });
      }

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
