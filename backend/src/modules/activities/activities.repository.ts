import { asc, eq, sql } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";

type RegistroEventoProgreso = {
  usuarioId: string;
  idEventoCliente: string;
  actividadId: string;
  temaId: string;
  correcta: boolean;
  xpOtorgada: number;
  puntaje: number;
  datos: Record<string, unknown>;
  ocurridoEnCliente: Date;
  dispositivoId: string | null;
};

export function crearActivitiesRepository(db: DbClient) {
  return {
    async listarActividades() {
      const actividades = await db.select().from(schema.actividad).orderBy(asc(schema.actividad.orden));
      const tipos = await db.select().from(schema.tipoActividad);
      const opciones = await db.select().from(schema.opcionActividad);

      return { actividades, tipos, opciones };
    },

    async obtenerActividadConTipoYOpciones(actividadId: string) {
      const [actividad] = await db
        .select()
        .from(schema.actividad)
        .where(eq(schema.actividad.id, actividadId))
        .limit(1);

      if (!actividad) return null;

      const [tipoActividad] = await db
        .select()
        .from(schema.tipoActividad)
        .where(eq(schema.tipoActividad.id, actividad.tipoActividadId))
        .limit(1);

      const opciones = await db
        .select()
        .from(schema.opcionActividad)
        .where(eq(schema.opcionActividad.actividadId, actividad.id))
        .orderBy(asc(schema.opcionActividad.orden));

      return { actividad, tipoActividad: tipoActividad ?? null, opciones };
    },

    async obtenerActividadParaRespuesta(actividadId: string) {
      const [actividad] = await db
        .select({
          id: schema.actividad.id,
          temaId: schema.actividad.temaId,
          xpRecompensa: schema.actividad.xpRecompensa
        })
        .from(schema.actividad)
        .where(eq(schema.actividad.id, actividadId))
        .limit(1);

      return actividad ?? null;
    },

    async obtenerOpcionDeActividad(actividadId: string, opcionId: string) {
      const [opcion] = await db
        .select({ id: schema.opcionActividad.id, correcta: schema.opcionActividad.correcta })
        .from(schema.opcionActividad)
        .where(sql`${schema.opcionActividad.id} = ${opcionId} and ${schema.opcionActividad.actividadId} = ${actividadId}`)
        .limit(1);

      return opcion ?? null;
    },

    async registrarEventoProgreso(evento: RegistroEventoProgreso) {
      const [registro] = await db
        .insert(schema.eventoProgreso)
        .values({
          usuarioId: evento.usuarioId,
          idEventoCliente: evento.idEventoCliente,
          tipoEvento: "actividad_respondida",
          temaId: evento.temaId,
          actividadId: evento.actividadId,
          correcta: evento.correcta,
          puntaje: evento.puntaje,
          xpOtorgada: evento.xpOtorgada,
          datos: evento.datos,
          ocurridoEnCliente: evento.ocurridoEnCliente,
          dispositivoId: evento.dispositivoId
        })
        .onConflictDoNothing({ target: schema.eventoProgreso.idEventoCliente })
        .returning();

      return registro ?? null;
    },

    async upsertProgresoActividad(usuarioId: string, actividadId: string, correcta: boolean) {
      await db
        .insert(schema.progresoActividadUsuario)
        .values({
          usuarioId,
          actividadId,
          intentos: 1,
          mejorPuntaje: correcta ? 100 : 0,
          completado: correcta,
          completadoEn: correcta ? new Date() : null,
          actualizadoEn: new Date()
        })
        .onConflictDoUpdate({
          target: [schema.progresoActividadUsuario.usuarioId, schema.progresoActividadUsuario.actividadId],
          set: {
            intentos: sql`${schema.progresoActividadUsuario.intentos} + 1`,
            mejorPuntaje: sql`greatest(${schema.progresoActividadUsuario.mejorPuntaje}, ${correcta ? 100 : 0})`,
            completado: correcta,
            completadoEn: correcta ? new Date() : sql`${schema.progresoActividadUsuario.completadoEn}`,
            actualizadoEn: new Date()
          }
        });
    },

    async upsertProgresoTema(usuarioId: string, temaId: string) {
      await db
        .insert(schema.progresoTemaUsuario)
        .values({
          usuarioId,
          temaId,
          estado: "en_progreso",
          porcentaje: 0,
          actualizadoEn: new Date()
        })
        .onConflictDoUpdate({
          target: [schema.progresoTemaUsuario.usuarioId, schema.progresoTemaUsuario.temaId],
          set: {
            estado: "en_progreso",
            porcentaje: 0,
            actualizadoEn: new Date()
          }
        });
    }
  };
}

export type ActivitiesRepository = ReturnType<typeof crearActivitiesRepository>;
