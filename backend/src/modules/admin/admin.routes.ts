import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import type { Database, Json } from "../../db/database.types";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito } from "../../shared/http/respuesta";
import {
  createActivitySchema,
  createThemeSchema,
  updateActivitySchema,
  updateThemeSchema,
  upsertStepContentSchema
} from "./admin.schemas";
import { NotFoundError } from "../../shared/errors/http-error";

function mapTheme(theme: Record<string, unknown>) {
  return {
    id: String(theme.id),
    path_id: String(theme.senda_id ?? theme.path_id ?? ""),
    title: String(theme.titulo ?? theme.title ?? ""),
    slug: String(theme.slug ?? ""),
    objective: String(theme.objetivo ?? theme.objective ?? ""),
    summary: (theme.resumen ?? theme.summary ?? null) as string | null,
    cover_media_id: (theme.portada_recurso_id ?? theme.cover_media_id ?? null) as string | null,
    status: String(theme.estado ?? theme.status ?? ""),
    bible_version_id: (theme.version_biblica_id ?? theme.bible_version_id ?? null) as string | null,
    xp_reward: Number(theme.xp_recompensa ?? theme.xp_reward ?? 0),
    estimated_minutes: Number(theme.minutos_estimados ?? theme.estimated_minutes ?? 0),
    content_version: Number(theme.version_contenido ?? theme.content_version ?? 0),
    published_at: (theme.publicado_en ?? theme.published_at ?? null) as string | null
  };
}

function mapStep(step: Record<string, unknown>) {
  const stepTypeRaw = step.step_type as Record<string, unknown> | undefined;
  const contents = Array.isArray(step.contents)
    ? step.contents.map((content) => ({
        id: String((content as Record<string, unknown>).id),
        age_group_id: String((content as Record<string, unknown>).grupo_edad_id ?? (content as Record<string, unknown>).age_group_id ?? ""),
        title: ((content as Record<string, unknown>).titulo ?? (content as Record<string, unknown>).title ?? null) as string | null,
        body: String((content as Record<string, unknown>).cuerpo ?? (content as Record<string, unknown>).body ?? ""),
        short_instruction: ((content as Record<string, unknown>).instruccion_corta ?? (content as Record<string, unknown>).short_instruction ?? null) as string | null
      }))
    : [];

  return {
    id: String(step.id),
    theme_id: String(step.tema_id ?? step.theme_id ?? ""),
    sort_order: Number(step.orden ?? step.sort_order ?? 0),
    step_type: stepTypeRaw
      ? {
          id: String(stepTypeRaw.id ?? ""),
          code: String(stepTypeRaw.codigo ?? stepTypeRaw.code ?? ""),
          name: String(stepTypeRaw.nombre ?? stepTypeRaw.name ?? ""),
          sort_order: Number(stepTypeRaw.orden ?? stepTypeRaw.sort_order ?? 0),
          color_hex: (stepTypeRaw.color_hex ?? null) as string | null
        }
      : null,
    contents
  };
}

export const adminRoutes = new Hono<AppBindings>();

adminRoutes.use("*", authMiddleware);
adminRoutes.use("*", requireRole("administrador"));

adminRoutes.get("/resumen", async (c) => {
  const db = c.get("db");

  const [themes, users, activities, published] = await Promise.all([
    db.from("tema").select("id", { count: "exact", head: true }),
    db.from("usuario_app").select("id", { count: "exact", head: true }),
    db.from("actividad").select("id", { count: "exact", head: true }),
    db.from("tema").select("id", { count: "exact", head: true }).eq("estado", "publicado")
  ]);

  return responderExito({
    temas: themes.count ?? 0,
    publicados: published.count ?? 0,
    usuarios: users.count ?? 0,
    actividades: activities.count ?? 0
  });
});

adminRoutes.get("/temas", async (c) => {
  const db = c.get("db");

  const status = c.req.query("status");

  let query = db
    .from("tema")
    .select("*, path:senda_id(id, codigo, nombre, color_hex), created_by:creado_por(id, nombre_visible)")
    .order("actualizado_en", { ascending: false });

  if (status) {
    query = query.eq("estado", status as Database["public"]["Enums"]["estado_publicacion"]);
  }

  const { data, error } = await query;

  if (error) throw error;

  return responderExito((data ?? []).map((theme) => mapTheme(theme as Record<string, unknown>)));
});

adminRoutes.get("/temas/:temaId", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("temaId");

  const { data, error } = await db
    .from("tema")
    .select("*, path:senda_id(*), theme_age_group:tema_grupo_edad(grupo_edad_id)")
    .eq("id", themeId)
    .single();

  if (error || !data) throw new NotFoundError("Tema no encontrado");

  return responderExito(mapTheme(data as Record<string, unknown>));
});

adminRoutes.post(
  "/temas",
  zValidator("json", createThemeSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const body = c.req.valid("json");

    const { data: theme, error } = await db
      .from("tema")
      .insert({
        senda_id: body.pathId,
        titulo: body.title,
        slug: body.slug,
        objetivo: body.objective,
        resumen: body.summary,
        version_biblica_id: body.bibleVersionId,
        estado: "borrador",
        xp_recompensa: body.xpReward,
        minutos_estimados: body.estimatedMinutes,
        creado_por: user.id
      })
      .select("*")
      .single();

    if (error || !theme) throw error;

    const rows = body.ageGroupIds.map((ageGroupId) => ({
      tema_id: theme.id,
      grupo_edad_id: ageGroupId
    }));

    const { error: ageError } = await db.from("tema_grupo_edad").insert(rows);
    if (ageError) throw ageError;

    return responderExito(mapTheme(theme as Record<string, unknown>), 201);
  }
);

adminRoutes.patch(
  "/temas/:temaId",
  zValidator("json", updateThemeSchema),
  async (c) => {
    const db = c.get("db");
    const themeId = c.req.param("temaId");
    const body = c.req.valid("json");

    const { data: theme, error } = await db
      .from("tema")
      .update({
        titulo: body.title,
        objetivo: body.objective,
        resumen: body.summary,
        minutos_estimados: body.estimatedMinutes,
        xp_recompensa: body.xpReward,
        version_biblica_id: body.bibleVersionId,
        actualizado_en: new Date().toISOString()
      })
      .eq("id", themeId)
      .select("*")
      .single();

    if (error || !theme) throw new NotFoundError("Tema no encontrado");

    if (body.ageGroupIds) {
      await db.from("tema_grupo_edad").delete().eq("tema_id", themeId);
      const rows = body.ageGroupIds.map((ageGroupId) => ({
        tema_id: themeId,
        grupo_edad_id: ageGroupId
      }));
      await db.from("tema_grupo_edad").insert(rows);
    }

    return responderExito(mapTheme(theme as Record<string, unknown>));
  }
);

adminRoutes.delete("/temas/:temaId", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("temaId");

  const { error } = await db.from("tema").delete().eq("id", themeId);
  if (error) throw error;

  return responderExito({ deleted: true });
});

adminRoutes.post(
  "/temas/:temaId/pasos",
  zValidator("json", upsertStepContentSchema),
  async (c) => {
    const db = c.get("db");
    const themeId = c.req.param("temaId");
    const body = c.req.valid("json");

    const { data: stepType } = await db
      .from("tipo_paso_crecer")
      .select("orden")
      .eq("id", body.stepTypeId)
      .single();

    const sortOrder = stepType?.orden ?? 1;

    const { data: step, error: stepError } = await db
      .from("paso_tema")
      .upsert(
        {
          tema_id: themeId,
          tipo_paso_id: body.stepTypeId,
          orden: sortOrder,
          obligatorio: true
        },
        { onConflict: "tema_id,tipo_paso_id" }
      )
      .select("*")
      .single();

    if (stepError || !step) throw stepError;

    const { data: content, error: contentError } = await db
      .from("contenido_paso_tema")
      .upsert(
        {
          paso_id: step.id,
          grupo_edad_id: body.ageGroupId,
          titulo: body.title,
          cuerpo: body.body,
          instruccion_corta: body.shortInstruction ?? null
        },
        { onConflict: "paso_id,grupo_edad_id" }
      )
      .select("*")
      .single();

    if (contentError) throw contentError;

    return responderExito({
      step: mapStep(step as Record<string, unknown>),
      content: {
        id: String(content.id),
        step_id: String(content.paso_id),
        age_group_id: String(content.grupo_edad_id),
        title: String(content.titulo),
        body: String(content.cuerpo),
        short_instruction: (content.instruccion_corta ?? null) as string | null
      }
    });
  }
);

adminRoutes.get("/temas/:temaId/pasos", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("temaId");

  const { data: steps, error } = await db
    .from("paso_tema")
    .select(`
      *,
      step_type:tipo_paso_id(*),
      contents:contenido_paso_tema(*)
    `)
    .eq("tema_id", themeId)
    .order("orden", { ascending: true });

  if (error) throw error;

    return responderExito((steps ?? []).map((step) => mapStep(step as Record<string, unknown>)));
});

adminRoutes.delete("/temas/:temaId/pasos/:tipoPasoId", async (c) => {
  const db = c.get("db");
  const { temaId: themeId, tipoPasoId: stepTypeId } = c.req.param();

  const { data: step } = await db
    .from("paso_tema")
    .select("id")
    .eq("tema_id", themeId)
    .eq("tipo_paso_id", stepTypeId)
    .single();

  if (!step) throw new NotFoundError("Paso no encontrado");

  await db.from("contenido_paso_tema").delete().eq("paso_id", step.id);
  await db.from("paso_tema").delete().eq("id", step.id);

  return responderExito({ deleted: true });
});

adminRoutes.post(
  "/actividades",
  zValidator("json", createActivitySchema),
  async (c) => {
    const db = c.get("db");
    const body = c.req.valid("json");

    const { data: activity, error } = await db
      .from("actividad")
      .insert({
        tema_id: body.themeId,
        paso_id: body.stepId,
        grupo_edad_id: body.ageGroupId,
        tipo_actividad_id: body.activityTypeId,
        titulo: body.title,
        consigna: body.prompt,
        retroalimentacion: body.feedback ?? null,
        orden: body.sortOrder,
        xp_recompensa: body.xpReward,
        dificultad: body.difficulty,
        configuracion: body.config as Json
      })
      .select("*")
      .single();

    if (error || !activity) throw error;

    if (body.options.length > 0) {
      const rows = body.options.map((option) => ({
        actividad_id: activity.id,
        etiqueta: option.label,
        texto: option.text,
        correcta: option.isCorrect,
        orden: option.sortOrder,
        retroalimentacion: option.feedback ?? null
      }));

      const { error: optionsError } = await db
        .from("opcion_actividad")
        .insert(rows);

      if (optionsError) throw optionsError;
    }

    return responderExito(activity, 201);
  }
);

adminRoutes.patch(
  "/actividades/:actividadId",
  zValidator("json", updateActivitySchema),
  async (c) => {
    const db = c.get("db");
    const activityId = c.req.param("actividadId");
    const body = c.req.valid("json");

    const { data: activity, error } = await db
      .from("actividad")
      .update({
        ...(body.title && { titulo: body.title }),
        ...(body.prompt && { consigna: body.prompt }),
        ...(body.feedback !== undefined && { retroalimentacion: body.feedback }),
        ...(body.sortOrder && { orden: body.sortOrder }),
        ...(body.xpReward && { xp_recompensa: body.xpReward }),
        ...(body.difficulty && { dificultad: body.difficulty }),
        ...(body.config && { configuracion: body.config as Json }),
        actualizado_en: new Date().toISOString()
      } as Database["public"]["Tables"]["actividad"]["Update"])
      .eq("id", activityId)
      .select("*")
      .single();

    if (error || !activity) throw new NotFoundError("Actividad no encontrada");

    if (body.options) {
      const { error: delError } = await db
        .from("opcion_actividad")
        .delete()
        .eq("actividad_id", activityId);
      if (delError) throw delError;

      const rows = body.options.map((option) => ({
        actividad_id: activityId,
        etiqueta: option.label,
        texto: option.text,
        correcta: option.isCorrect,
        orden: option.sortOrder,
        retroalimentacion: option.feedback ?? null
      }));

      const { error: insError } = await db.from("opcion_actividad").insert(rows);
      if (insError) throw insError;
    }

    return responderExito(activity);
  }
);

adminRoutes.delete("/actividades/:actividadId", async (c) => {
  const db = c.get("db");
  const activityId = c.req.param("actividadId");

  await db.from("opcion_actividad").delete().eq("actividad_id", activityId);
  await db.from("progreso_actividad_usuario").delete().eq("actividad_id", activityId);

  const { error } = await db.from("actividad").delete().eq("id", activityId);
  if (error) throw error;

  return responderExito({ deleted: true });
});

adminRoutes.post("/temas/:temaId/publicar", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const themeId = c.req.param("temaId");

  const { data: theme, error: themeError } = await db
    .from("tema")
    .select("id, version_contenido")
    .eq("id", themeId)
    .single();

  if (themeError || !theme) {
    throw new NotFoundError("Tema no encontrado");
  }

  const currentVersion = theme.version_contenido ?? 0;

  const { data, error } = await db
    .from("tema")
    .update({
      estado: "publicado",
      version_contenido: currentVersion + 1,
      publicado_por: user.id,
      publicado_en: new Date().toISOString(),
      actualizado_en: new Date().toISOString()
    })
    .eq("id", themeId)
    .select("*")
    .single();

  if (error) throw error;

    return responderExito(mapTheme(data as Record<string, unknown>));
});

adminRoutes.post("/temas/:temaId/borrador", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("temaId");

  const { data, error } = await db
    .from("tema")
    .update({
      estado: "borrador",
      actualizado_en: new Date().toISOString()
    })
    .eq("id", themeId)
    .select("*")
    .single();

  if (error) throw error;

    return responderExito(mapTheme(data as Record<string, unknown>));
});
