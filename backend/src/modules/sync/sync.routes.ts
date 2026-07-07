import { Hono } from "hono";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppBindings } from "../../config/env";
import type { Database, Json } from "../../db/database.types";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito, responderError } from "../../shared/http/respuesta";
import { syncPullQuerySchema, syncPushBodySchema } from "./sync.schemas";
import type { SyncPushEvent } from "./sync.schemas";

export const syncRoutes = new Hono<AppBindings>();

syncRoutes.use("*", authMiddleware);

syncRoutes.get(
  "/pull",
  zValidator("query", syncPullQuerySchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const { since } = c.req.valid("query");

    let query = db
      .from("evento_progreso")
      .select("*")
      .eq("usuario_id", user.id)
      .order("recibido_en_servidor", { ascending: false });

    if (since) {
      query = query.gte("recibido_en_servidor", since);
    }

    const { data: eventos, error: eventosError } = await query;
    if (eventosError) throw eventosError;

    const { data: temas, error: temasError } = await db
      .from("progreso_tema_usuario")
      .select("*")
      .eq("usuario_id", user.id);
    if (temasError) throw temasError;

    const { data: actividades, error: actividadesError } = await db
      .from("progreso_actividad_usuario")
      .select("*")
      .eq("usuario_id", user.id);
    if (actividadesError) throw actividadesError;

    return responderExito({
      eventos: eventos ?? [],
      progreso: {
        temas: temas ?? [],
        actividades: actividades ?? []
      }
    });
  }
);

syncRoutes.post(
  "/push",
  zValidator("json", syncPushBodySchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const { eventos } = c.req.valid("json");

    let procesados = 0;
    let omitidos = 0;
    const errores: { evento_id_cliente: string; error: string }[] = [];

    for (const evento of eventos) {
      try {
        const { data: existente } = await db
          .from("evento_progreso")
          .select("id")
          .eq("id_evento_cliente", evento.evento_id_cliente)
          .eq("usuario_id", user.id)
          .maybeSingle();

        if (existente) {
          omitidos++;
          continue;
        }

        const { data: nuevo, error: insertError } = await db
          .from("evento_progreso")
          .insert({
            usuario_id: user.id,
            id_evento_cliente: evento.evento_id_cliente,
            tipo_evento: evento.tipo_evento,
            tema_id: evento.tema_id ?? null,
            paso_id: evento.paso_id ?? null,
            actividad_id: evento.actividad_id ?? null,
            correcta: evento.correcta ?? null,
            puntaje: evento.puntaje ?? null,
            xp_otorgada: evento.xp_otorgada,
            datos: evento.datos as Json,
            ocurrido_en_cliente: evento.creado_en_cliente ?? new Date().toISOString(),
            dispositivo_id: evento.dispositivo_id ?? null
          })
          .select("*")
          .single();

        if (insertError) {
          if (insertError.code === "23505") {
            omitidos++;
            continue;
          }
          errores.push({
            evento_id_cliente: evento.evento_id_cliente,
            error: insertError.message
          });
          continue;
        }

        procesados++;

        if (evento.tema_id) {
          await actualizarProgresoTema(db, user.id, evento);
        }

        if (evento.actividad_id) {
          await actualizarProgresoActividad(db, user.id, evento);
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
  db: SupabaseClient<Database>,
  usuarioId: string,
  evento: SyncPushEvent
) {
  const now = new Date().toISOString();

  const { data: existing } = await db
    .from("progreso_tema_usuario")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("tema_id", evento.tema_id!)
    .maybeSingle();

  if (existing) {
    if (evento.tipo_evento === "tema_iniciado" && !existing.iniciado_en) {
      await db
        .from("progreso_tema_usuario")
        .update({ iniciado_en: evento.creado_en_cliente ?? now, actualizado_en: now })
        .eq("usuario_id", usuarioId)
        .eq("tema_id", evento.tema_id!);
    }

    if (evento.tipo_evento === "tema_completado") {
      await db
        .from("progreso_tema_usuario")
        .update({
          estado: "completado",
          porcentaje: 100,
          completado_en: evento.creado_en_cliente ?? now,
          actualizado_en: now
        })
        .eq("usuario_id", usuarioId)
        .eq("tema_id", evento.tema_id!);
    }

    if (
      (evento.tipo_evento === "actividad_completada" || evento.tipo_evento === "actividad_respondida") &&
      existing.porcentaje < 100
    ) {
      const nuevoPorcentaje = Math.min(existing.porcentaje + 10, 99);
      await db
        .from("progreso_tema_usuario")
        .update({ porcentaje: nuevoPorcentaje, actualizado_en: now })
        .eq("usuario_id", usuarioId)
        .eq("tema_id", evento.tema_id!);
    }
  } else {
    await db
      .from("progreso_tema_usuario")
      .insert({
        usuario_id: usuarioId,
        tema_id: evento.tema_id!,
        estado: evento.tipo_evento === "tema_completado" ? "completado" : "en_progreso",
        porcentaje: evento.tipo_evento === "tema_completado" ? 100 : 0,
        iniciado_en: evento.creado_en_cliente ?? now,
        completado_en: evento.tipo_evento === "tema_completado" ? (evento.creado_en_cliente ?? now) : null,
        actualizado_en: now
      });
  }
}

async function actualizarProgresoActividad(
  db: SupabaseClient<Database>,
  usuarioId: string,
  evento: SyncPushEvent
) {
  const now = new Date().toISOString();

  const { data: existing } = await db
    .from("progreso_actividad_usuario")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("actividad_id", evento.actividad_id!)
    .maybeSingle();

  if (existing) {
    const nuevoMejorPuntaje =
      evento.puntaje !== undefined && evento.puntaje > existing.mejor_puntaje
        ? evento.puntaje
        : existing.mejor_puntaje;

    const nuevoCompletado =
      (evento.tipo_evento === "actividad_completada" || evento.correcta === true) && !existing.completado;

    await db
      .from("progreso_actividad_usuario")
      .update({
        intentos: existing.intentos + 1,
        mejor_puntaje: nuevoMejorPuntaje,
        completado: nuevoCompletado ? true : existing.completado,
        completado_en: nuevoCompletado ? now : existing.completado_en,
        actualizado_en: now
      })
      .eq("usuario_id", usuarioId)
      .eq("actividad_id", evento.actividad_id!);
  } else {
    const completado = evento.correcta === true || evento.tipo_evento === "actividad_completada";

    await db
      .from("progreso_actividad_usuario")
      .insert({
        usuario_id: usuarioId,
        actividad_id: evento.actividad_id!,
        intentos: 1,
        mejor_puntaje: evento.puntaje ?? 0,
        completado,
        completado_en: completado ? now : null,
        actualizado_en: now
      });
  }
}
