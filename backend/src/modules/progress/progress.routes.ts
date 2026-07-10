import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito } from "../../shared/http/respuesta";
import { serializarProgresoActividad, serializarProgresoTema } from "../../shared/serializers/progreso.serializer";
import { progressEventSchema } from "./progress.schemas";
import { db, schema } from "../../db/client";

export const progressRoutes = new Hono<AppBindings>();

progressRoutes.use("*", authMiddleware);

progressRoutes.get("/mi", async (c) => {
  const user = c.get("user");

  const themes = await db
    .select()
    .from(schema.progresoTemaUsuario)
    .where(eq(schema.progresoTemaUsuario.usuarioId, user.id));

  const activities = await db
    .select()
    .from(schema.progresoActividadUsuario)
    .where(eq(schema.progresoActividadUsuario.usuarioId, user.id));

  return responderExito({
    progresos_tema: themes.map((tema) =>
      serializarProgresoTema({
        usuario_id: tema.usuarioId,
        tema_id: tema.temaId,
        estado: tema.estado,
        porcentaje: tema.porcentaje,
        iniciado_en: tema.iniciadoEn ? tema.iniciadoEn.toISOString() : null,
        completado_en: tema.completadoEn ? tema.completadoEn.toISOString() : null,
        ultimo_paso_id: tema.ultimoPasoId,
        actualizado_en: tema.actualizadoEn.toISOString()
      })
    ),
    progresos_actividad: activities.map((actividad) =>
      serializarProgresoActividad({
        usuario_id: actividad.usuarioId,
        actividad_id: actividad.actividadId,
        intentos: actividad.intentos,
        mejor_puntaje: actividad.mejorPuntaje,
        completado: actividad.completado,
        completado_en: actividad.completadoEn ? actividad.completadoEn.toISOString() : null,
        actualizado_en: actividad.actualizadoEn.toISOString()
      })
    )
  });
});

progressRoutes.post(
  "/eventos",
  zValidator("json", progressEventSchema),
async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json");

    const [data] = await db
      .insert(schema.eventoProgreso)
      .values({
        usuarioId: user.id,
        idEventoCliente: body.evento_id_cliente,
        tipoEvento: body.tipo_evento,
        temaId: body.tema_id ?? null,
        pasoId: body.paso_id ?? null,
        actividadId: body.actividad_id ?? null,
        correcta: body.correcta ?? null,
        puntaje: body.puntaje ?? null,
        xpOtorgada: body.xp_otorgada,
        datos: body.datos,
        ocurridoEnCliente: body.ocurrido_en_cliente ? new Date(body.ocurrido_en_cliente) : new Date(),
        dispositivoId: body.dispositivo_id ?? null
      })
      .onConflictDoNothing({ target: schema.eventoProgreso.idEventoCliente })
      .returning();

    if (!data) {
      return responderExito({ duplicado: true, mensaje: "Evento ya procesado" });
    }

    return responderExito({ duplicado: false, evento: data }, 201);
  }
);
