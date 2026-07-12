import { and, eq, sql } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";
import { BadRequestError, NotFoundError } from "../../shared/errors/http-error";
import { procesarGamificacionPorAprendizaje } from "../gamification/gamification-engine";

export type EventoProgresoEntrada = {
  evento_id_cliente: string;
  tipo_evento: string;
  tema_id?: string;
  paso_id?: string;
  actividad_id?: string;
  correcta?: boolean;
  puntaje?: number;
  xp_otorgada?: number;
  datos?: Record<string, unknown>;
  ocurrido_en_cliente?: string;
  dispositivo_id?: string;
};

function fechaClienteSegura(value?: string) {
  const ahora = new Date();
  if (!value) return ahora;
  const fecha = new Date(value);
  if (Number.isNaN(fecha.getTime()) || fecha > ahora) return ahora;
  return fecha;
}

async function asegurarTemaExiste(db: DbClient, temaId: string) {
  const [tema] = await db
    .select({ id: schema.tema.id, xpRecompensa: schema.tema.xpRecompensa, estado: schema.tema.estado })
    .from(schema.tema)
    .where(eq(schema.tema.id, temaId))
    .limit(1);
  if (!tema || tema.estado !== "publicado") throw new NotFoundError("Tema no disponible");
  return tema;
}

async function validarPasoTema(db: DbClient, temaId: string, pasoId: string) {
  const [paso] = await db
    .select({ id: schema.pasoTema.id, orden: schema.pasoTema.orden })
    .from(schema.pasoTema)
    .where(and(eq(schema.pasoTema.id, pasoId), eq(schema.pasoTema.temaId, temaId)))
    .limit(1);
  if (!paso) throw new BadRequestError("El paso no pertenece al tema");
  return paso;
}

async function calcularPorcentajeTema(db: DbClient, usuarioId: string, temaId: string) {
  const [[total], [completados]] = await Promise.all([
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.pasoTema)
      .where(and(eq(schema.pasoTema.temaId, temaId), eq(schema.pasoTema.obligatorio, true))),
    db
      .select({ total: sql<number>`count(distinct ${schema.eventoProgreso.pasoId})::int` })
      .from(schema.eventoProgreso)
      .where(and(
        eq(schema.eventoProgreso.usuarioId, usuarioId),
        eq(schema.eventoProgreso.temaId, temaId),
        eq(schema.eventoProgreso.tipoEvento, "bloque_completado"),
      )),
  ]);

  const cantidad = Math.max(1, Number(total?.total ?? 0));
  return Math.min(100, Math.round((Number(completados?.total ?? 0) / cantidad) * 100));
}

async function temaEsCompletable(db: DbClient, usuarioId: string, temaId: string) {
  const [[pasos], [pasosCompletados], [actividades]] = await Promise.all([
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.pasoTema)
      .where(and(eq(schema.pasoTema.temaId, temaId), eq(schema.pasoTema.obligatorio, true))),
    db
      .select({ total: sql<number>`count(distinct ${schema.eventoProgreso.pasoId})::int` })
      .from(schema.eventoProgreso)
      .where(and(
        eq(schema.eventoProgreso.usuarioId, usuarioId),
        eq(schema.eventoProgreso.temaId, temaId),
        eq(schema.eventoProgreso.tipoEvento, "bloque_completado"),
      )),
    db
      .select({
        total: sql<number>`count(${schema.actividad.id}) filter (where ${schema.actividad.obligatorio} = true)::int`,
        completadas: sql<number>`count(${schema.progresoActividadUsuario.actividadId}) filter (where ${schema.actividad.obligatorio} = true and ${schema.progresoActividadUsuario.completado} = true)::int`,
      })
      .from(schema.actividad)
      .leftJoin(
        schema.progresoActividadUsuario,
        and(
          eq(schema.progresoActividadUsuario.actividadId, schema.actividad.id),
          eq(schema.progresoActividadUsuario.usuarioId, usuarioId),
        ),
      )
      .where(eq(schema.actividad.temaId, temaId)),
  ]);

  return Number(pasosCompletados?.total ?? 0) >= Number(pasos?.total ?? 0)
    && Number(actividades?.completadas ?? 0) >= Number(actividades?.total ?? 0);
}

export function crearProgressRepository(db: DbClient) {
  return {
    async obtenerProgresoPropio(usuarioId: string) {
      const [themes, activities] = await Promise.all([
        db.select().from(schema.progresoTemaUsuario).where(eq(schema.progresoTemaUsuario.usuarioId, usuarioId)),
        db.select().from(schema.progresoActividadUsuario).where(eq(schema.progresoActividadUsuario.usuarioId, usuarioId)),
      ]);
      return { themes, activities };
    },

    async registrarEvento(usuarioId: string, body: EventoProgresoEntrada) {
      if (["actividad_respondida", "actividad_completada", "recompensa_reclamada"].includes(body.tipo_evento)) {
        throw new BadRequestError(
          body.tipo_evento === "recompensa_reclamada"
            ? "Las recompensas solo pueden reclamarse desde su módulo correspondiente"
            : "Responde o completa la actividad mediante el endpoint seguro de actividades",
        );
      }

      if (body.tema_id) await asegurarTemaExiste(db, body.tema_id);
      if (body.paso_id && body.tema_id) await validarPasoTema(db, body.tema_id, body.paso_id);

      const [data] = await db
        .insert(schema.eventoProgreso)
        .values({
          usuarioId,
          idEventoCliente: body.evento_id_cliente,
          tipoEvento: body.tipo_evento as typeof schema.eventoProgreso.$inferInsert["tipoEvento"],
          temaId: body.tema_id ?? null,
          pasoId: body.paso_id ?? null,
          actividadId: body.actividad_id ?? null,
          correcta: null,
          puntaje: null,
          xpOtorgada: 0,
          datos: { ...(body.datos ?? {}), valores_cliente_ignorados: true },
          ocurridoEnCliente: fechaClienteSegura(body.ocurrido_en_cliente),
          dispositivoId: body.dispositivo_id ?? null,
        })
        .onConflictDoNothing({
          target: [schema.eventoProgreso.usuarioId, schema.eventoProgreso.idEventoCliente],
        })
        .returning();

      if (!data) return null;

      const ahora = new Date();
      let logrosGanados: Array<{ id: string; codigo: string; nombre: string; bonoXp: number }> = [];

      if (body.tema_id && body.tipo_evento === "tema_iniciado") {
        await db
          .insert(schema.progresoTemaUsuario)
          .values({
            usuarioId,
            temaId: body.tema_id,
            estado: "en_progreso",
            porcentaje: 0,
            iniciadoEn: fechaClienteSegura(body.ocurrido_en_cliente),
            actualizadoEn: ahora,
          })
          .onConflictDoUpdate({
            target: [schema.progresoTemaUsuario.usuarioId, schema.progresoTemaUsuario.temaId],
            set: {
              estado: sql`case when ${schema.progresoTemaUsuario.estado} = 'completado' then 'completado' else 'en_progreso' end`,
              actualizadoEn: ahora,
            },
          });
      }

      if (body.tema_id && body.paso_id && ["bloque_iniciado", "bloque_completado"].includes(body.tipo_evento)) {
        const porcentaje = body.tipo_evento === "bloque_completado"
          ? await calcularPorcentajeTema(db, usuarioId, body.tema_id)
          : undefined;
        await db
          .insert(schema.progresoTemaUsuario)
          .values({
            usuarioId,
            temaId: body.tema_id,
            estado: "en_progreso",
            porcentaje: porcentaje ?? 0,
            ultimoPasoId: body.paso_id,
            iniciadoEn: ahora,
            actualizadoEn: ahora,
          })
          .onConflictDoUpdate({
            target: [schema.progresoTemaUsuario.usuarioId, schema.progresoTemaUsuario.temaId],
            set: {
              estado: sql`case when ${schema.progresoTemaUsuario.estado} = 'completado' then 'completado' else 'en_progreso' end`,
              ...(porcentaje !== undefined
                ? { porcentaje: sql`greatest(${schema.progresoTemaUsuario.porcentaje}, ${porcentaje})` }
                : {}),
              ultimoPasoId: body.paso_id,
              actualizadoEn: ahora,
            },
          });
      }

      if (body.tema_id && body.tipo_evento === "tema_completado") {
        if (!(await temaEsCompletable(db, usuarioId, body.tema_id))) {
          await db.delete(schema.eventoProgreso).where(eq(schema.eventoProgreso.id, data.id));
          throw new BadRequestError("Completa los pasos CRECER y las actividades obligatorias antes de finalizar el tema");
        }

        const tema = await asegurarTemaExiste(db, body.tema_id);
        await db
          .insert(schema.progresoTemaUsuario)
          .values({
            usuarioId,
            temaId: body.tema_id,
            estado: "completado",
            porcentaje: 100,
            iniciadoEn: ahora,
            completadoEn: ahora,
            actualizadoEn: ahora,
          })
          .onConflictDoUpdate({
            target: [schema.progresoTemaUsuario.usuarioId, schema.progresoTemaUsuario.temaId],
            set: { estado: "completado", porcentaje: 100, completadoEn: ahora, actualizadoEn: ahora },
          });

        const gamificacion = await procesarGamificacionPorAprendizaje(db, {
          usuarioId,
          origen: "tema",
          origenId: body.tema_id,
          xpConfigurada: tema.xpRecompensa,
          metadatos: { tema_id: body.tema_id },
        });
        logrosGanados = gamificacion.logros;
        if (gamificacion.xpOtorgada > 0) {
          await db
            .update(schema.eventoProgreso)
            .set({ xpOtorgada: gamificacion.xpOtorgada, puntaje: 100 })
            .where(eq(schema.eventoProgreso.id, data.id));
          data.xpOtorgada = gamificacion.xpOtorgada;
          data.puntaje = 100;
        }
      }

      return { data, logrosGanados };
    },
  };
}

export type ProgressRepository = ReturnType<typeof crearProgressRepository>;
