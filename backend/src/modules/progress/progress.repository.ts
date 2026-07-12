import { eq, sql, and, count } from "drizzle-orm";
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

      // ────────────────────────────────────────────────────────
      // MOTOR DE LOGROS: Verificar y otorgar logros automáticamente
      // ────────────────────────────────────────────────────────
      const logrosGanados = data ? await verificarYOtorgarLogros(db, usuarioId, data.tipoEvento) : [];

      return { data: data ?? null, logrosGanados };
    }
  };
}

/**
 * Verifica si el usuario cumple los criterios de algún logro y los otorga.
 * Solo evalúa logros relevantes al tipo de evento ocurrido para optimizar consultas.
 * Es completamente seguro: usa doble validación anti-duplicado.
 */
async function verificarYOtorgarLogros(
  db: DbClient,
  usuarioId: string,
  tipoEvento: string
): Promise<Array<{ id: string; nombre: string; codigo: string; descripcion: string | null; bono_xp: number; url_icono: string | null }>> {

  // Solo ejecutar el motor en eventos que pueden desbloquear logros
  const eventosRelevantes = ["tema_completado", "actividad_completada", "bloque_completado"];
  if (!eventosRelevantes.includes(tipoEvento)) return [];

  // 1. Traer todos los logros activos de la BD
  const todosLosLogros = await db
    .select()
    .from(schema.logro)
    .where(eq(schema.logro.activo, true));

  if (todosLosLogros.length === 0) return [];

  // 2. Traer los logros que el usuario YA tiene (para no volver a darlos)
  const logrosYaGanados = await db
    .select({ logroId: schema.logroUsuario.logroId })
    .from(schema.logroUsuario)
    .where(eq(schema.logroUsuario.usuarioId, usuarioId));

  const idsYaGanados = new Set(logrosYaGanados.map((l) => l.logroId));

  // 3. Calcular métricas del usuario (solo las que necesitamos)
  const logrosNoPoseidos = todosLosLogros.filter((l) => !idsYaGanados.has(l.id));
  if (logrosNoPoseidos.length === 0) return [];

  // Determinar qué criterios necesitamos calcular
  const criteriosNecesarios = new Set(logrosNoPoseidos.map((l) => l.codigoCriterio));
  const metricas: Record<string, number> = {};

  if (criteriosNecesarios.has("temas_completados")) {
    const [res] = await db
      .select({ total: sql<number>`count(*)` })
      .from(schema.progresoTemaUsuario)
      .where(and(
        eq(schema.progresoTemaUsuario.usuarioId, usuarioId),
        eq(schema.progresoTemaUsuario.estado, "completado")
      ));
    metricas["temas_completados"] = Number(res?.total ?? 0);
    console.log(`[LOGROS] temas_completados = ${metricas["temas_completados"]}`);
  }

  if (criteriosNecesarios.has("actividades_completadas")) {
    const [res] = await db
      .select({ total: sql<number>`count(distinct ${schema.eventoProgreso.actividadId})` })
      .from(schema.eventoProgreso)
      .where(and(
        eq(schema.eventoProgreso.usuarioId, usuarioId),
        eq(schema.eventoProgreso.tipoEvento, "actividad_completada"),
        sql`${schema.eventoProgreso.actividadId} IS NOT NULL`
      ));
    metricas["actividades_completadas"] = Number(res?.total ?? 0);
    console.log(`[LOGROS] actividades_completadas = ${metricas["actividades_completadas"]}`);
  }

  // dias_racha: se salta por ahora (requiere tabla de rachas dedicada)

  // 4. Verificar qué logros cumple y otorgarlos
  const logrosGanados: Array<{ id: string; nombre: string; codigo: string; descripcion: string | null; bono_xp: number; url_icono: string | null }> = [];

  for (const logro of logrosNoPoseidos) {
    const criterio = logro.codigoCriterio;
    const valorRequerido = logro.valorCriterio ?? 0;

    if (criterio === "dias_racha") continue; // Pendiente de implementar

    const valorActual = metricas[criterio] ?? 0;

    if (valorActual >= valorRequerido) {
      console.log(`[LOGROS] ¡Logro desbloqueado! ${logro.nombre} (criterio: ${criterio} = ${valorActual}/${valorRequerido})`);

      // Insertar en logro_usuario (ON CONFLICT DO NOTHING como segunda capa anti-duplicado)
      await db
        .insert(schema.logroUsuario)
        .values({ logroId: logro.id, usuarioId, ganadoEn: new Date() })
        .onConflictDoNothing();

      logrosGanados.push({
        id: logro.id,
        nombre: logro.nombre,
        codigo: logro.codigo,
        descripcion: logro.descripcion ?? null,
        bono_xp: logro.bonoXp,
        url_icono: logro.urlIcono ?? null,
      });
    }
  }

  return logrosGanados;
}

export type ProgressRepository = ReturnType<typeof crearProgressRepository>;
