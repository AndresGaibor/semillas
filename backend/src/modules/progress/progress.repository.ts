import { eq, sql, and } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";

export function crearProgressRepository(db: DbClient) {
  return {
    async obtenerProgresoPropio(usuarioId: string) {
      const themes = await db
        .select()
        .from(schema.progresoTemaUsuario)
        .where(eq(schema.progresoTemaUsuario.usuarioId, usuarioId));

      const activities = await db
        .select()
        .from(schema.progresoActividadUsuario)
        .where(eq(schema.progresoActividadUsuario.usuarioId, usuarioId));

      return { themes, activities };
    },

    async registrarEvento(usuarioId: string, body: {
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
    }) {
      const xpOtorga = body.xp_otorgada ?? 0;

      // ANTI-FARMING: Si el evento da XP, revisamos que no haya ganado XP por este tema o actividad antes
      if (xpOtorga > 0) {
        if (body.tema_id && body.tipo_evento === "tema_completado") {
          const [exists] = await db
            .select({ id: schema.eventoProgreso.id })
            .from(schema.eventoProgreso)
            .where(
              sql`${schema.eventoProgreso.usuarioId} = ${usuarioId} AND 
                  ${schema.eventoProgreso.temaId} = ${body.tema_id} AND 
                  ${schema.eventoProgreso.xpOtorgada} > 0 AND
                  ${schema.eventoProgreso.tipoEvento} = 'tema_completado'`
            )
            .limit(1);
          
          if (exists) return null; // Ya ganó XP por este tema
        }

        if (body.actividad_id && body.tipo_evento === "actividad_completada") {
          const [exists] = await db
            .select({ id: schema.eventoProgreso.id })
            .from(schema.eventoProgreso)
            .where(
              sql`${schema.eventoProgreso.usuarioId} = ${usuarioId} AND 
                  ${schema.eventoProgreso.actividadId} = ${body.actividad_id} AND 
                  ${schema.eventoProgreso.xpOtorgada} > 0 AND
                  ${schema.eventoProgreso.tipoEvento} = 'actividad_completada'`
            )
            .limit(1);
          
          if (exists) return null; // Ya ganó XP por esta actividad
        }
      }

      const fila = {
        usuarioId,
        idEventoCliente: body.evento_id_cliente,
        tipoEvento: body.tipo_evento as any,
        temaId: body.tema_id ?? null,
        pasoId: body.paso_id ?? null,
        actividadId: body.actividad_id ?? null,
        correcta: null,
        puntaje: null,
        xpOtorgada: xpOtorga,
        datos: body.datos ?? {},
        ocurridoEnCliente: body.ocurrido_en_cliente ? new Date(body.ocurrido_en_cliente) : new Date(),
        dispositivoId: body.dispositivo_id ?? null
      };

      const [data] = await db
        .insert(schema.eventoProgreso)
        .values(fila as never)
        .onConflictDoNothing({ target: [schema.eventoProgreso.usuarioId, schema.eventoProgreso.idEventoCliente] })
        .returning();

      // ACTUALIZACIÓN DE PORCENTAJE DEL TEMA
      if (data && data.tipoEvento === "bloque_completado" && data.temaId) {
        const resultPasos = await db
          .select({ count: sql<number>`count(*)` })
          .from(schema.pasoTema)
          .where(and(
            eq(schema.pasoTema.temaId, data.temaId),
            eq(schema.pasoTema.obligatorio, true)
          ));
        
        const total = Number(resultPasos[0]?.count ?? 0);

        if (total > 0) {
          const resultCompletados = await db
            .select({ count: sql<number>`count(distinct ${schema.eventoProgreso.pasoId})` })
            .from(schema.eventoProgreso)
            .where(and(
              eq(schema.eventoProgreso.usuarioId, usuarioId),
              eq(schema.eventoProgreso.temaId, data.temaId),
              eq(schema.eventoProgreso.tipoEvento, 'bloque_completado')
            ));
          
          const completados = Number(resultCompletados[0]?.count ?? 0);
          const porcentaje = Math.floor((completados / total) * 100);

          console.log(`\n[PROGRESO] Usuario: ${usuarioId} | Tema: ${data.temaId}`);
          console.log(`[PROGRESO] Pasos completados: ${completados} / ${total}`);
          console.log(`[PROGRESO] Nuevo porcentaje: ${porcentaje}%\n`);

          const [existingProgress] = await db
            .select({ id: schema.progresoTemaUsuario.usuarioId })
            .from(schema.progresoTemaUsuario)
            .where(and(
              eq(schema.progresoTemaUsuario.usuarioId, usuarioId),
              eq(schema.progresoTemaUsuario.temaId, data.temaId)
            ))
            .limit(1);

          if (existingProgress) {
            await db.update(schema.progresoTemaUsuario)
              .set({
                porcentaje,
                estado: porcentaje >= 100 ? "completado" : "en_progreso",
                ultimoPasoId: data.pasoId,
                actualizadoEn: new Date(),
                completadoEn: porcentaje >= 100 ? new Date() : undefined
              })
              .where(and(
                eq(schema.progresoTemaUsuario.usuarioId, usuarioId),
                eq(schema.progresoTemaUsuario.temaId, data.temaId)
              ));
          } else {
            await db.insert(schema.progresoTemaUsuario)
              .values({
                usuarioId,
                temaId: data.temaId,
                porcentaje,
                estado: porcentaje >= 100 ? "completado" : "en_progreso",
                ultimoPasoId: data.pasoId,
                completadoEn: porcentaje >= 100 ? new Date() : undefined
              });
          }
        }
      } else if (data && data.tipoEvento === "tema_completado" && data.temaId) {
        // Fallback/Fail-safe: Si se completa el tema por completo y se da XP, forzar el 100%
        console.log(`\n[PROGRESO] Usuario: ${usuarioId} | Tema: ${data.temaId}`);
        console.log(`[PROGRESO] Tema completado (Evento tema_completado detectado)`);
        console.log(`[PROGRESO] Nuevo porcentaje: 100%\n`);

        const [existingProgress] = await db
          .select({ id: schema.progresoTemaUsuario.usuarioId })
          .from(schema.progresoTemaUsuario)
          .where(
            sql`${schema.progresoTemaUsuario.usuarioId} = ${usuarioId} AND 
                ${schema.progresoTemaUsuario.temaId} = ${data.temaId}`
          )
          .limit(1);

        if (existingProgress) {
          await db.update(schema.progresoTemaUsuario)
            .set({
              porcentaje: 100,
              estado: "completado",
              actualizadoEn: new Date(),
              completadoEn: new Date()
            })
            .where(
              sql`${schema.progresoTemaUsuario.usuarioId} = ${usuarioId} AND 
                  ${schema.progresoTemaUsuario.temaId} = ${data.temaId}`
            );
        } else {
          await db.insert(schema.progresoTemaUsuario)
            .values({
              usuarioId,
              temaId: data.temaId,
              porcentaje: 100,
              estado: "completado",
              completadoEn: new Date()
            });
        }
      }

      return data ?? null;
    }
  };
}

export type ProgressRepository = ReturnType<typeof crearProgressRepository>;
