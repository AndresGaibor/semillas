import { Hono } from "hono";
import { and, desc, eq, sql } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito, responderError } from "../../shared/http/respuesta";
import { syncPullQuerySchema, syncPushBodySchema } from "./sync.schemas";
import type { SyncPushEvent } from "./sync.schemas";
import { db, schema } from "../../db/client";

export const syncRoutes = new Hono<AppBindings>();

function serializarEvento(fila: typeof schema.eventoProgreso.$inferSelect) {
  return {
    id: fila.id,
    usuario_id: fila.usuarioId,
    id_evento_cliente: fila.idEventoCliente,
    tipo_evento: fila.tipoEvento,
    tema_id: fila.temaId,
    paso_id: fila.pasoId,
    actividad_id: fila.actividadId,
    correcta: fila.correcta,
    puntaje: fila.puntaje,
    xp_otorgada: fila.xpOtorgada,
    datos: fila.datos,
    ocurrido_en_cliente: fila.ocurridoEnCliente.toISOString(),
    dispositivo_id: fila.dispositivoId,
    recibido_en_servidor: fila.recibidoEnServidor.toISOString()
  };
}

function serializarProgresoTema(fila: typeof schema.progresoTemaUsuario.$inferSelect) {
  return {
    usuario_id: fila.usuarioId,
    tema_id: fila.temaId,
    estado: fila.estado,
    porcentaje: fila.porcentaje,
    iniciado_en: fila.iniciadoEn ? fila.iniciadoEn.toISOString() : null,
    completado_en: fila.completadoEn ? fila.completadoEn.toISOString() : null,
    ultimo_paso_id: fila.ultimoPasoId,
    actualizado_en: fila.actualizadoEn.toISOString()
  };
}

function serializarProgresoActividad(fila: typeof schema.progresoActividadUsuario.$inferSelect) {
  return {
    usuario_id: fila.usuarioId,
    actividad_id: fila.actividadId,
    intentos: fila.intentos,
    mejor_puntaje: fila.mejorPuntaje,
    completado: fila.completado,
    completado_en: fila.completadoEn ? fila.completadoEn.toISOString() : null,
    actualizado_en: fila.actualizadoEn.toISOString()
  };
}

syncRoutes.use("*", authMiddleware);

syncRoutes.get(
  "/pull",
  zValidator("query", syncPullQuerySchema),
  async (c) => {
    const user = c.get("user");
    const { since } = c.req.valid("query");

    let query = db
      .select()
      .from(schema.eventoProgreso)
      .where(eq(schema.eventoProgreso.usuarioId, user.id))
      .orderBy(desc(schema.eventoProgreso.recibidoEnServidor));

    if (since) {
      query = db
        .select()
        .from(schema.eventoProgreso)
        .where(and(eq(schema.eventoProgreso.usuarioId, user.id), sql`${schema.eventoProgreso.recibidoEnServidor} >= ${new Date(since)}`))
        .orderBy(desc(schema.eventoProgreso.recibidoEnServidor));
    }

    const [eventos, temas, actividades] = await Promise.all([
      query,
      db.select().from(schema.progresoTemaUsuario).where(eq(schema.progresoTemaUsuario.usuarioId, user.id)),
      db.select().from(schema.progresoActividadUsuario).where(eq(schema.progresoActividadUsuario.usuarioId, user.id))
    ]);

    return responderExito({
      eventos: eventos.map(serializarEvento),
      progreso: {
        temas: temas.map(serializarProgresoTema),
        actividades: actividades.map(serializarProgresoActividad)
      }
    });
  }
);

syncRoutes.post(
  "/push",
  zValidator("json", syncPushBodySchema),
  async (c) => {
    const user = c.get("user");
    const { eventos } = c.req.valid("json");

    let procesados = 0;
    let omitidos = 0;
    const errores: { evento_id_cliente: string; error: string }[] = [];

    for (const evento of eventos) {
        try {
          const [nuevo] = await db
            .insert(schema.eventoProgreso)
            .values({
              usuarioId: user.id,
              idEventoCliente: evento.evento_id_cliente,
              tipoEvento: evento.tipo_evento,
              temaId: evento.tema_id ?? null,
              pasoId: evento.paso_id ?? null,
              actividadId: evento.actividad_id ?? null,
              correcta: evento.correcta ?? null,
              puntaje: evento.puntaje ?? null,
              xpOtorgada: evento.xp_otorgada,
              datos: evento.datos,
              ocurridoEnCliente: evento.creado_en_cliente ? new Date(evento.creado_en_cliente) : new Date(),
              dispositivoId: evento.dispositivo_id ?? null
            })
            .onConflictDoNothing({ target: schema.eventoProgreso.idEventoCliente })
            .returning();

          if (!nuevo) {
            omitidos++;
            continue;
          }

          procesados++;

        if (evento.tema_id) {
          await actualizarProgresoTema(user.id, evento);
        }

        if (evento.actividad_id) {
          await actualizarProgresoActividad(user.id, evento);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        errores.push({
          evento_id_cliente: evento.evento_id_cliente,
          error: message
        });
      }
    }

    return responderExito({
      procesados,
      omitidos,
      errores
    });
  }
);

async function actualizarProgresoTema(
  usuarioId: string,
  evento: SyncPushEvent
) {
  const now = new Date();

  const [existing] = await db
    .select()
    .from(schema.progresoTemaUsuario)
    .where(and(eq(schema.progresoTemaUsuario.usuarioId, usuarioId), eq(schema.progresoTemaUsuario.temaId, evento.tema_id!)))
    .limit(1);

  if (existing) {
    if (evento.tipo_evento === "tema_iniciado" && !existing.iniciadoEn) {
      await db
        .update(schema.progresoTemaUsuario)
        .set({ iniciadoEn: evento.creado_en_cliente ? new Date(evento.creado_en_cliente) : now, actualizadoEn: now })
        .where(and(eq(schema.progresoTemaUsuario.usuarioId, usuarioId), eq(schema.progresoTemaUsuario.temaId, evento.tema_id!)));
    }

    if (evento.tipo_evento === "tema_completado") {
      await db
        .update(schema.progresoTemaUsuario)
        .set({
          estado: "completado",
          porcentaje: 100,
          completadoEn: evento.creado_en_cliente ? new Date(evento.creado_en_cliente) : now,
          actualizadoEn: now
        })
        .where(and(eq(schema.progresoTemaUsuario.usuarioId, usuarioId), eq(schema.progresoTemaUsuario.temaId, evento.tema_id!)));
    }

    if (
      (evento.tipo_evento === "actividad_completada" || 
       evento.tipo_evento === "actividad_respondida" || 
       evento.tipo_evento === "bloque_iniciado" || 
       evento.tipo_evento === "tema_iniciado") &&
      existing.porcentaje < 100
    ) {
      // Incrementar aproximadamente 16% por fase visitada/iniciada
      const nuevoPorcentaje = Math.min(existing.porcentaje + 16, 99);
      await db
        .update(schema.progresoTemaUsuario)
        .set({ porcentaje: nuevoPorcentaje, actualizadoEn: now })
        .where(and(eq(schema.progresoTemaUsuario.usuarioId, usuarioId), eq(schema.progresoTemaUsuario.temaId, evento.tema_id!)));
    }
  } else {
    await db
      .insert(schema.progresoTemaUsuario)
      .values({
        usuarioId,
        temaId: evento.tema_id!,
        estado: evento.tipo_evento === "tema_completado" ? "completado" : "en_progreso",
        porcentaje: evento.tipo_evento === "tema_completado" ? 100 : evento.tipo_evento === "tema_iniciado" || evento.tipo_evento === "bloque_iniciado" ? 16 : 0,
        iniciadoEn: evento.creado_en_cliente ? new Date(evento.creado_en_cliente) : now,
        completadoEn: evento.tipo_evento === "tema_completado" ? (evento.creado_en_cliente ? new Date(evento.creado_en_cliente) : now) : null,
        actualizadoEn: now
      });
  }
}

async function actualizarProgresoActividad(
  usuarioId: string,
  evento: SyncPushEvent
) {
  const now = new Date();

  const [existing] = await db
    .select()
    .from(schema.progresoActividadUsuario)
    .where(and(eq(schema.progresoActividadUsuario.usuarioId, usuarioId), eq(schema.progresoActividadUsuario.actividadId, evento.actividad_id!)))
    .limit(1);

  if (existing) {
    const nuevoMejorPuntaje =
      evento.puntaje !== undefined && evento.puntaje > existing.mejorPuntaje
        ? evento.puntaje
        : existing.mejorPuntaje;

    const nuevoCompletado =
      (evento.tipo_evento === "actividad_completada" || evento.correcta === true) && !existing.completado;

    await db
      .update(schema.progresoActividadUsuario)
      .set({
        intentos: existing.intentos + 1,
        mejorPuntaje: nuevoMejorPuntaje,
        completado: nuevoCompletado ? true : existing.completado,
        completadoEn: nuevoCompletado ? now : existing.completadoEn,
        actualizadoEn: now
      })
      .where(and(eq(schema.progresoActividadUsuario.usuarioId, usuarioId), eq(schema.progresoActividadUsuario.actividadId, evento.actividad_id!)));
  } else {
    const completado = evento.correcta === true || evento.tipo_evento === "actividad_completada";

    await db
      .insert(schema.progresoActividadUsuario)
      .values({
        usuarioId,
        actividadId: evento.actividad_id!,
        intentos: 1,
        mejorPuntaje: evento.puntaje ?? 0,
        completado,
        completadoEn: completado ? now : null,
        actualizadoEn: now
      });
  }
}
