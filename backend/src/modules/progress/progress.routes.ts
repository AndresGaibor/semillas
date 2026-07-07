import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import type { Json } from "../../db/database.types";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito } from "../../shared/http/respuesta";
import { serializarProgresoActividad, serializarProgresoTema } from "../../shared/serializers/progreso.serializer";
import { progressEventSchema } from "./progress.schemas";

export const progressRoutes = new Hono<AppBindings>();

progressRoutes.use("*", authMiddleware);

progressRoutes.get("/mi", async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const { data: themes, error: themesError } = await db
    .from("progreso_tema_usuario")
    .select("*")
    .eq("usuario_id", user.id);

  if (themesError) {
    throw themesError;
  }

  const { data: activities, error: activitiesError } = await db
    .from("progreso_actividad_usuario")
    .select("*")
    .eq("usuario_id", user.id);

  if (activitiesError) {
    throw activitiesError;
  }

  return responderExito({
    progresos_tema: (themes ?? []).map((tema) => serializarProgresoTema(tema as Parameters<typeof serializarProgresoTema>[0])),
    progresos_actividad: (activities ?? []).map((actividad) => serializarProgresoActividad(actividad as Parameters<typeof serializarProgresoActividad>[0]))
  });
});

progressRoutes.post(
  "/eventos",
  zValidator("json", progressEventSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const body = c.req.valid("json");

    const { data, error } = await db
      .from("evento_progreso")
      .insert({
        usuario_id: user.id,
        id_evento_cliente: body.evento_id_cliente,
        tipo_evento: body.tipo_evento,
        tema_id: body.tema_id ?? null,
        paso_id: body.paso_id ?? null,
        actividad_id: body.actividad_id ?? null,
        correcta: body.correcta ?? null,
        puntaje: body.puntaje ?? null,
        xp_otorgada: body.xp_otorgada,
        datos: body.datos as Json,
        ocurrido_en_cliente: body.ocurrido_en_cliente ?? new Date().toISOString(),
        dispositivo_id: body.dispositivo_id ?? null
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return responderExito({ duplicado: true, mensaje: "Evento ya procesado" });
      }

      throw error;
    }

    return responderExito({ duplicado: false, evento: data }, 201);
  }
);
