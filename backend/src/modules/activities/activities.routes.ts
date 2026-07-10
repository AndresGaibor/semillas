import { Hono } from "hono";
import { asc, eq, sql } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { NotFoundError } from "../../shared/errors/http-error";
import { responderExito } from "../../shared/http/respuesta";
import { serializarActividad } from "../../shared/serializers/actividad.serializer";
import { responderActividadSchema } from "./activities.schemas";
import { db, schema } from "../../db/client";

export const activitiesRoutes = new Hono<AppBindings>();

function mapearActividad(actividad: Record<string, unknown>) {
  return serializarActividad({
    id: String(actividad.id),
    tema_id: String(actividad.tema_id ?? ""),
    paso_id: (actividad.paso_id ?? null) as string | null,
    grupo_edad_id: String(actividad.grupo_edad_id ?? ""),
    tipo_actividad_id: String(actividad.tipo_actividad_id ?? ""),
    titulo: String(actividad.titulo ?? ""),
    consigna: String(actividad.consigna ?? ""),
    orden: Number(actividad.orden ?? 0),
    xp_recompensa: Number(actividad.xp_recompensa ?? 0),
    dificultad: String(actividad.dificultad ?? ""),
    limite_tiempo_seg: (actividad.limite_tiempo_seg ?? null) as number | null,
    obligatorio: Boolean(actividad.obligatorio ?? false),
    retroalimentacion: (actividad.retroalimentacion ?? null) as string | null,
    configuracion: (actividad.configuracion ?? {}) as Record<string, unknown>,
    creado_en: String(actividad.creado_en ?? ""),
    actualizado_en: String(actividad.actualizado_en ?? ""),
    tipo_actividad: (actividad.tipo_actividad ?? null) as Parameters<typeof serializarActividad>[0]["tipo_actividad"],
    opciones: Array.isArray(actividad.opciones)
      ? (actividad.opciones as Array<Record<string, unknown>>).map((opcion) => ({
          id: String(opcion.id ?? ""),
          actividad_id: String(opcion.actividad_id ?? ""),
          etiqueta: (opcion.etiqueta ?? null) as string | null,
          texto: String(opcion.texto ?? ""),
          correcta: Boolean(opcion.correcta ?? false),
          orden: Number(opcion.orden ?? 0),
          retroalimentacion: (opcion.retroalimentacion ?? null) as string | null
        }))
      : []
  });
}

// Convierte filas Drizzle a la forma exacta que espera el serializador existente.
function serializarActividadDesdeDrizzle(
  actividad: typeof schema.actividad.$inferSelect,
  tipoActividad: typeof schema.tipoActividad.$inferSelect | null,
  opciones: Array<typeof schema.opcionActividad.$inferSelect>
) {
  return mapearActividad({
    id: actividad.id,
    tema_id: actividad.temaId,
    paso_id: actividad.pasoId,
    grupo_edad_id: actividad.grupoEdadId,
    tipo_actividad_id: actividad.tipoActividadId,
    titulo: actividad.titulo,
    consigna: actividad.consigna,
    orden: actividad.orden,
    xp_recompensa: actividad.xpRecompensa,
    dificultad: actividad.dificultad,
    limite_tiempo_seg: actividad.limiteTiempoSeg,
    obligatorio: actividad.obligatorio,
    retroalimentacion: actividad.retroalimentacion,
    configuracion: actividad.configuracion ?? {},
    creado_en: actividad.creadoEn.toISOString(),
    actualizado_en: actividad.actualizadoEn.toISOString(),
    tipo_actividad: tipoActividad
      ? {
          id: tipoActividad.id,
          codigo: tipoActividad.codigo,
          nombre: tipoActividad.nombre,
          descripcion: tipoActividad.descripcion,
          es_juego: tipoActividad.esJuego
        }
      : null,
    opciones
  });
}

activitiesRoutes.get("/", async (c) => {
  const actividades = await db
    .select()
    .from(schema.actividad)
    .orderBy(asc(schema.actividad.orden));

  const tipos = await db.select().from(schema.tipoActividad);
  const opciones = await db.select().from(schema.opcionActividad);

  const tipoPorId = new Map(tipos.map((tipo) => [tipo.id, tipo]));
  const opcionesPorActividad = opciones.reduce<Map<string, Array<typeof schema.opcionActividad.$inferSelect>>>(
    (mapa, opcion) => {
      const actuales = mapa.get(opcion.actividadId) ?? [];
      mapa.set(opcion.actividadId, [...actuales, opcion]);
      return mapa;
    },
    new Map()
  );

  return responderExito(
    actividades.map((actividad: typeof schema.actividad.$inferSelect) =>
      serializarActividadDesdeDrizzle(
        actividad,
        tipoPorId.get(actividad.tipoActividadId) ?? null,
        opcionesPorActividad.get(actividad.id) ?? []
      )
    )
  );
});

activitiesRoutes.get("/:actividad_id", async (c) => {
  const actividadId = c.req.param("actividad_id");

  const [actividad] = await db
    .select()
    .from(schema.actividad)
    .where(eq(schema.actividad.id, actividadId))
    .limit(1);

  if (!actividad) {
    throw new NotFoundError("Actividad no encontrada");
  }

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

  return responderExito(serializarActividadDesdeDrizzle(actividad, tipoActividad ?? null, opciones));
});

activitiesRoutes.post(
  "/:actividad_id/responder",
  authMiddleware,
  zValidator("json", responderActividadSchema),
async (c) => {
    const user = c.get("user");
    const actividadId = c.req.param("actividad_id");
    const body = c.req.valid("json");

    const [actividad] = await db
      .select({
        id: schema.actividad.id,
        temaId: schema.actividad.temaId,
        xpRecompensa: schema.actividad.xpRecompensa
      })
      .from(schema.actividad)
      .where(eq(schema.actividad.id, actividadId))
      .limit(1);

    if (!actividad) {
      throw new NotFoundError("Actividad no encontrada");
    }

    let correcta = false;

    if (body.opcion_id_seleccionada) {
      const [opcion] = await db
        .select({ id: schema.opcionActividad.id, correcta: schema.opcionActividad.correcta })
        .from(schema.opcionActividad)
        .where(
          sql`${schema.opcionActividad.id} = ${body.opcion_id_seleccionada} and ${schema.opcionActividad.actividadId} = ${actividadId}`
        )
        .limit(1);

      if (!opcion) {
        throw new NotFoundError("Opción no encontrada");
      }

      correcta = Boolean(opcion.correcta);
    }

    const xpOtorgada = correcta ? Number(actividad.xpRecompensa ?? 0) : 0;

    const [evento] = await db
      .insert(schema.eventoProgreso)
      .values({
        usuarioId: user.id,
        idEventoCliente: body.evento_id_cliente,
        tipoEvento: "actividad_respondida",
        temaId: actividad.temaId,
        actividadId: actividadId,
        correcta,
        puntaje: correcta ? 100 : 0,
        xpOtorgada,
        datos: {
          opcion_id_seleccionada: body.opcion_id_seleccionada ?? null,
          texto_respuesta: body.texto_respuesta ?? null
        },
        ocurridoEnCliente: body.ocurrido_en_cliente ? new Date(body.ocurrido_en_cliente) : new Date(),
        dispositivoId: body.dispositivo_id ?? null
      })
      .onConflictDoNothing({ target: schema.eventoProgreso.idEventoCliente })
      .returning();

    if (!evento) {
      return responderExito(
        {
          resultado: {
            correcta,
            xp_otorgada: 0
          },
          duplicado: true,
          correcta,
          xp_otorgada: 0
        },
        200
      );
    }

    await db
      .insert(schema.progresoActividadUsuario)
      .values({
        usuarioId: user.id,
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

    if (correcta) {
      await db
        .insert(schema.progresoTemaUsuario)
        .values({
          usuarioId: user.id,
          temaId: actividad.temaId,
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

    return responderExito(
      {
        resultado: {
          correcta,
          xp_otorgada: xpOtorgada
        },
        duplicado: false,
        correcta,
        xp_otorgada: xpOtorgada
      },
      201
    );
  }
);
