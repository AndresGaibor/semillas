import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { NotFoundError } from "../../shared/errors/http-error";
import { responderExito } from "../../shared/http/respuesta";
import { serializarActividad } from "../../shared/serializers/actividad.serializer";
import { responderActividadSchema } from "./activities.schemas";

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
    actualizado_en: String(actividad.actualizado_en ?? "")
  });
}

activitiesRoutes.get("/", async (c) => {
  const db = c.get("db");

  const { data, error } = await db.from("actividad").select("*").order("orden", { ascending: true });

  if (error) {
    throw error;
  }

  return responderExito((data ?? []).map((actividad) => mapearActividad(actividad as Record<string, unknown>)));
});

activitiesRoutes.get("/:actividad_id", async (c) => {
  const db = c.get("db");
  const actividadId = c.req.param("actividad_id");

  const { data, error } = await db.from("actividad").select("*").eq("id", actividadId).single();

  if (error || !data) {
    throw new NotFoundError("Actividad no encontrada");
  }

  return responderExito(mapearActividad(data as Record<string, unknown>));
});

activitiesRoutes.post(
  "/:actividad_id/responder",
  authMiddleware,
  zValidator("json", responderActividadSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const actividadId = c.req.param("actividad_id");
    const body = c.req.valid("json");

    const { data: actividad, error: actividadError } = await db
      .from("actividad")
      .select("id, tema_id, xp_recompensa")
      .eq("id", actividadId)
      .single();

    if (actividadError || !actividad) {
      throw new NotFoundError("Actividad no encontrada");
    }

    let correcta = false;

    if (body.opcion_id_seleccionada) {
      const { data: opcion, error: opcionError } = await db
        .from("opcion_actividad")
        .select("id, correcta")
        .eq("id", body.opcion_id_seleccionada)
        .eq("actividad_id", actividadId)
        .single();

      if (opcionError || !opcion) {
        throw new NotFoundError("Opción no encontrada");
      }

      correcta = Boolean(opcion.correcta);
    }

    const xpOtorgada = correcta ? Number(actividad.xp_recompensa ?? 0) : 0;

    const { error: eventoError } = await db.from("evento_progreso").insert({
      usuario_id: user.id,
      id_evento_cliente: body.evento_id_cliente,
      tipo_evento: "actividad_respondida",
      tema_id: actividad.tema_id,
      actividad_id: actividadId,
      correcta,
      puntaje: correcta ? 100 : 0,
      xp_otorgada: xpOtorgada,
      datos: {
        opcion_id_seleccionada: body.opcion_id_seleccionada ?? null,
        texto_respuesta: body.texto_respuesta ?? null
      },
      ocurrido_en_cliente: body.ocurrido_en_cliente ?? new Date().toISOString(),
      dispositivo_id: body.dispositivo_id ?? null
    });

    if (eventoError) {
      if (eventoError.code === "23505") {
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

      throw eventoError;
    }

    await db.from("progreso_actividad_usuario").upsert({
      usuario_id: user.id,
      actividad_id: actividadId,
      intentos: 1,
      mejor_puntaje: correcta ? 100 : 0,
      completado: correcta,
      completado_en: correcta ? new Date().toISOString() : null,
      actualizado_en: new Date().toISOString()
    });

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
