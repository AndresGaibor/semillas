import { Hono } from "hono";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import type { Database, Json } from "../../db/database.types";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderError, responderExito } from "../../shared/http/respuesta";
import {
  createActivitySchema,
  createThemeSchema,
  updateActivitySchema,
  updateThemeSchema,
  updateUserSchema,
  upsertStepContentSchema
} from "./admin.schemas";
import { NotFoundError } from "../../shared/errors/http-error";
import { db, schema } from "../../db/client";

function mapTheme(theme: Record<string, unknown>) {
  const sendaRaw = theme.path as Record<string, unknown> | undefined;
  const createdByRaw = theme.created_by as Record<string, unknown> | undefined;
  const portadaRaw = theme.portada_recurso as Record<string, unknown> | undefined;
  const ageGroupsRaw = theme.grupos_edad as Array<Record<string, unknown>> | undefined;
  const gruposEdad = Array.isArray(ageGroupsRaw)
    ? ageGroupsRaw.map((ag) => {
        const grupoEdadRaw = (ag.grupo_edad as Record<string, unknown> | undefined) ?? ag;

        return {
          id: String(grupoEdadRaw.id ?? ""),
          codigo: String(grupoEdadRaw.codigo ?? ""),
          nombre: String(grupoEdadRaw.nombre ?? "")
        };
      })
    : [];

  return {
    id: String(theme.id),
    senda_id: String(theme.senda_id ?? ""),
    titulo: String(theme.titulo ?? ""),
    slug: String(theme.slug ?? ""),
    objetivo: String(theme.objetivo ?? ""),
    resumen: (theme.resumen ?? null) as string | null,
    portada_recurso_id: (theme.portada_recurso_id ?? null) as string | null,
    estado: String(theme.estado ?? ""),
    version_biblica_id: (theme.version_biblica_id ?? null) as string | null,
    xp_recompensa: Number(theme.xp_recompensa ?? 0),
    minutos_estimados: Number(theme.minutos_estimados ?? 0),
    version_contenido: Number(theme.version_contenido ?? 0),
    publicado_en: (theme.publicado_en ?? null) as string | null,
    creado_en: (theme.creado_en ?? null) as string | null,
    actualizado_en: (theme.actualizado_en ?? null) as string | null,
    creado_por: createdByRaw
      ? {
          id: String(createdByRaw.id ?? ""),
          nombre_visible: String(createdByRaw.nombre_visible ?? ""),
        }
      : null,
    senda: sendaRaw
      ? {
          id: String(sendaRaw.id ?? ""),
          codigo: String(sendaRaw.codigo ?? ""),
          nombre: String(sendaRaw.nombre ?? ""),
          color_hex: String(sendaRaw.color_hex ?? ""),
        }
      : null,
    portada_recurso: portadaRaw
      ? {
          id: String(portadaRaw.id ?? ""),
          url_publica: String(portadaRaw.url_publica ?? ""),
          texto_alternativo: (portadaRaw.texto_alternativo ?? null) as string | null,
          titulo: (portadaRaw.titulo ?? null) as string | null,
        }
      : null,
    grupos_edad: gruposEdad,
  };
}

function crearSlugCopia(slug: string) {
  const sufijo = `-copia-${crypto.randomUUID().replaceAll("-", "").slice(0, 8)}`;
  const maximo = 140;
  const base = slug.slice(0, Math.max(1, maximo - sufijo.length));

  return `${base}${sufijo}`;
}

function crearTituloCopia(titulo: string) {
  const sufijo = " (copia)";
  const maximo = 120;
  const base = titulo.slice(0, Math.max(1, maximo - sufijo.length));

  return `${base}${sufijo}`;
}

function mapStep(step: Record<string, unknown>) {
  const tipoPasoRaw = step.tipo_paso as Record<string, unknown> | undefined;
  const contenidos = Array.isArray(step.contenidos)
    ? step.contenidos.map((content) => ({
        id: String((content as Record<string, unknown>).id),
        grupo_edad_id: String((content as Record<string, unknown>).grupo_edad_id ?? ""),
        titulo: String((content as Record<string, unknown>).titulo ?? ""),
        cuerpo: String((content as Record<string, unknown>).cuerpo ?? ""),
        instruccion_corta: ((content as Record<string, unknown>).instruccion_corta ?? null) as string | null
      }))
    : [];

  return {
    id: String(step.id),
    tema_id: String(step.tema_id ?? ""),
    orden: Number(step.orden ?? 0),
    tipo_paso: tipoPasoRaw
      ? {
          id: String(tipoPasoRaw.id ?? ""),
          codigo: String(tipoPasoRaw.codigo ?? ""),
          nombre: String(tipoPasoRaw.nombre ?? ""),
          orden: Number(tipoPasoRaw.orden ?? 0),
          color_hex: (tipoPasoRaw.color_hex ?? null) as string | null
        }
      : null,
    contenidos
  };
}

export const adminRoutes = new Hono<AppBindings>();

// Seguridad deshabilitada temporalmente para pruebas
// adminRoutes.use("*", authMiddleware);
// adminRoutes.use("*", requireRole("administrador"));

function mapActivity(activity: Record<string, unknown>) {
  const tipoActividadRaw = activity.tipo_actividad as Record<string, unknown> | undefined;
  const temaRaw = activity.tema as Record<string, unknown> | undefined;
  const temaSendaRaw = temaRaw?.senda as Record<string, unknown> | undefined;
  const grupoEdadRaw = activity.grupo_edad as Record<string, unknown> | undefined;

  return {
    id: String(activity.id),
    tema_id: String(activity.tema_id ?? ""),
    paso_id: activity.paso_id ? String(activity.paso_id) : null,
    grupo_edad_id: String(activity.grupo_edad_id ?? ""),
    tipo_actividad_id: String(activity.tipo_actividad_id ?? ""),
    titulo: String(activity.titulo ?? ""),
    consigna: String(activity.consigna ?? ""),
    retroalimentacion: (activity.retroalimentacion ?? null) as string | null,
    orden: Number(activity.orden ?? 0),
    xp_recompensa: Number(activity.xp_recompensa ?? 0),
    limite_tiempo_seg: activity.limite_tiempo_seg ? Number(activity.limite_tiempo_seg) : null,
    dificultad: String(activity.dificultad ?? "facil"),
    obligatorio: Boolean(activity.obligatorio),
    configuracion: (activity.configuracion ?? {}) as Record<string, unknown>,
    estado: String(activity.estado ?? "borrador"),
    creado_en: (activity.creado_en ?? null) as string | null,
    actualizado_en: (activity.actualizado_en ?? null) as string | null,
    tipo_actividad: tipoActividadRaw
      ? {
          id: String(tipoActividadRaw.id ?? ""),
          codigo: String(tipoActividadRaw.codigo ?? ""),
          nombre: String(tipoActividadRaw.nombre ?? ""),
        }
      : null,
    tema: temaRaw
      ? {
          id: String(temaRaw.id ?? ""),
          titulo: String(temaRaw.titulo ?? ""),
          slug: String(temaRaw.slug ?? ""),
          senda: temaSendaRaw
            ? {
                id: String(temaSendaRaw.id ?? ""),
                codigo: String(temaSendaRaw.codigo ?? ""),
                nombre: String(temaSendaRaw.nombre ?? ""),
                color_hex: String(temaSendaRaw.color_hex ?? ""),
              }
            : null,
        }
      : null,
    grupo_edad: grupoEdadRaw
      ? {
          id: String(grupoEdadRaw.id ?? ""),
          codigo: String(grupoEdadRaw.codigo ?? ""),
          nombre: String(grupoEdadRaw.nombre ?? ""),
        }
      : null,
  };
}


adminRoutes.get("/resumen", async (c) => {
  const [themes, users, activities, published] = await Promise.all([
    db.select({ total: sql<number>`count(*)` }).from(schema.tema),
    db.select({ total: sql<number>`count(*)` }).from(schema.usuarioApp),
    db.select({ total: sql<number>`count(*)` }).from(schema.actividad),
    db.select({ total: sql<number>`count(*)` }).from(schema.tema).where(eq(schema.tema.estado, "publicado"))
  ]);

  return responderExito({
    temas: Number(themes[0]?.total ?? 0),
    publicados: Number(published[0]?.total ?? 0),
    usuarios: Number(users[0]?.total ?? 0),
    actividades: Number(activities[0]?.total ?? 0)
  });
});

adminRoutes.get("/actividades", async (c) => {
  const db = c.get("db");

  const temaId = c.req.query("tema_id");
  const tipoId = c.req.query("tipo_actividad_id");
  const grupoEdadId = c.req.query("grupo_edad_id");
  const estado = c.req.query("estado");
  const limit = Math.min(Math.max(Number(c.req.query("limit") ?? "100"), 1), 500);
  const offset = Math.max(Number(c.req.query("offset") ?? "0"), 0);

  let query = db
    .from("actividad")
    .select(`
      *,
      tipo_actividad:tipo_actividad_id(id, codigo, nombre),
      tema:tema_id(id, titulo, slug, estado, senda:senda_id(id, codigo, nombre, color_hex)),
      grupo_edad:grupo_edad_id(id, codigo, nombre)
    `, { count: "exact" })
    .order("creado_en", { ascending: false })
    .range(offset, offset + limit - 1);

  if (temaId) query = query.eq("tema_id", temaId);
  if (tipoId) query = query.eq("tipo_actividad_id", tipoId);
  if (grupoEdadId) query = query.eq("grupo_edad_id", grupoEdadId);
  if (estado) query = query.eq("obligatorio", estado === "publicada");

  const { data, error, count } = await query;

  if (error) throw error;

  return responderExito({
    actividades: (data ?? []).map((a) => mapActivity(a as Record<string, unknown>)),
    total: count ?? 0
  });
});

adminRoutes.get("/temas", async (c) => {
  const db = c.get("db");

  const status = c.req.query("status");

  let query = db
    .from("tema")
    .select("*, path:senda_id(id, codigo, nombre, color_hex), created_by:creado_por(id, nombre_visible), portada_recurso:portada_recurso_id(id, url_publica, texto_alternativo, titulo), grupos_edad:tema_grupo_edad(grupo_edad:grupo_edad_id(id, codigo, nombre))")
    .order("actualizado_en", { ascending: false });

  if (status) {
    query = query.eq("estado", status as Database["public"]["Enums"]["estado_publicacion"]);
  }

  const { data, error } = await query;

  if (error) throw error;

  return responderExito((data ?? []).map((theme) => mapTheme(theme as Record<string, unknown>)));
});

adminRoutes.get("/temas/:tema_id", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("tema_id");

  const { data, error } = await db
    .from("tema")
    .select("*, path:senda_id(id, codigo, nombre, color_hex), created_by:creado_por(id, nombre_visible), portada_recurso:portada_recurso_id(id, url_publica, texto_alternativo, titulo), grupos_edad:tema_grupo_edad(grupo_edad:grupo_edad_id(id, codigo, nombre))")
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
        senda_id: body.senda_id,
        titulo: body.titulo,
        slug: body.slug,
        objetivo: body.objetivo,
        resumen: body.resumen,
        version_biblica_id: body.version_biblica_id,
        estado: "borrador",
        xp_recompensa: body.xp_recompensa,
        minutos_estimados: body.minutos_estimados,
        creado_por: user.id
      })
      .select("*")
      .single();

    if (error || !theme) throw error;

    const rows = body.grupo_edad_ids.map((grupoEdadId) => ({
      tema_id: theme.id,
      grupo_edad_id: grupoEdadId
    }));

    const { error: ageError } = await db.from("tema_grupo_edad").insert(rows);
    if (ageError) throw ageError;

    return responderExito(mapTheme(theme as Record<string, unknown>), 201);
  }
);

adminRoutes.patch(
  "/temas/:tema_id",
  zValidator("json", updateThemeSchema),
  async (c) => {
    const db = c.get("db");
    const themeId = c.req.param("tema_id");
    const body = c.req.valid("json");

  const { data: theme, error } = await db
    .from("tema")
    .update({
        ...(body.titulo !== undefined ? { titulo: body.titulo } : {}),
        ...(body.objetivo !== undefined ? { objetivo: body.objetivo } : {}),
        ...(body.resumen !== undefined ? { resumen: body.resumen } : {}),
        ...(body.minutos_estimados !== undefined ? { minutos_estimados: body.minutos_estimados } : {}),
        ...(body.xp_recompensa !== undefined ? { xp_recompensa: body.xp_recompensa } : {}),
        ...(body.version_biblica_id !== undefined ? { version_biblica_id: body.version_biblica_id } : {}),
        ...(body.portada_recurso_id !== undefined ? { portada_recurso_id: body.portada_recurso_id } : {}),
        actualizado_en: new Date().toISOString()
      })
      .eq("id", themeId)
      .select("*")
      .single();

    if (error || !theme) throw new NotFoundError("Tema no encontrado");

    if (body.grupo_edad_ids) {
      await db.from("tema_grupo_edad").delete().eq("tema_id", themeId);
      const rows = body.grupo_edad_ids.map((grupoEdadId) => ({
        tema_id: themeId,
        grupo_edad_id: grupoEdadId
      }));
      await db.from("tema_grupo_edad").insert(rows);
    }

    return responderExito(mapTheme(theme as Record<string, unknown>));
  }
);

adminRoutes.delete("/temas/:tema_id", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("tema_id");

  const { error } = await db.from("tema").delete().eq("id", themeId);
  if (error) throw error;

  return responderExito({ deleted: true });
});

adminRoutes.post(
  "/temas/:tema_id/pasos",
  zValidator("json", upsertStepContentSchema),
  async (c) => {
    const db = c.get("db");
    const themeId = c.req.param("tema_id");
    const body = c.req.valid("json");

    const { data: stepType } = await db
      .from("tipo_paso_crecer")
      .select("orden")
      .eq("id", body.tipo_paso_id)
      .single();

    const sortOrder = stepType?.orden ?? 1;

    const { data: step, error: stepError } = await db
      .from("paso_tema")
      .upsert(
        {
          tema_id: themeId,
          tipo_paso_id: body.tipo_paso_id,
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
          grupo_edad_id: body.grupo_edad_id,
          titulo: body.titulo,
          cuerpo: body.cuerpo,
          instruccion_corta: body.instruccion_corta ?? null
        },
        { onConflict: "paso_id,grupo_edad_id" }
      )
      .select("*")
      .single();

    if (contentError) throw contentError;

    return responderExito({
      paso: mapStep(step as Record<string, unknown>),
      contenido: {
        id: String(content.id),
        paso_id: String(content.paso_id),
        grupo_edad_id: String(content.grupo_edad_id),
        titulo: String(content.titulo),
        cuerpo: String(content.cuerpo),
        instruccion_corta: (content.instruccion_corta ?? null) as string | null
      }
    });
  }
);

adminRoutes.get("/temas/:tema_id/pasos", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("tema_id");

  const { data: steps, error } = await db
    .from("paso_tema")
    .select(`
      *,
      tipo_paso:tipo_paso_id(*),
      contenidos:contenido_paso_tema(*)
    `)
    .eq("tema_id", themeId)
    .order("orden", { ascending: true });

  if (error) throw error;

  return responderExito((steps ?? []).map((step) => mapStep(step as Record<string, unknown>)));
});

adminRoutes.delete("/temas/:tema_id/pasos/:tipo_paso_id", async (c) => {
  const db = c.get("db");
  const { tema_id: themeId, tipo_paso_id: stepTypeId } = c.req.param();

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
        tema_id: body.tema_id,
        paso_id: body.paso_id ?? null,
        grupo_edad_id: body.grupo_edad_id,
        tipo_actividad_id: body.tipo_actividad_id,
        titulo: body.titulo,
        consigna: body.consigna,
        retroalimentacion: body.retroalimentacion ?? null,
        orden: body.orden,
        xp_recompensa: body.xp_recompensa,
        limite_tiempo_seg: body.limite_tiempo_seg ?? null,
        dificultad: body.dificultad,
        obligatorio: body.obligatorio,
        configuracion: body.configuracion as Json
      })
      .select("*")
      .single();

    if (error || !activity) throw error;

    if (body.opciones.length > 0) {
      const rows = body.opciones.map((opcion) => ({
        actividad_id: activity.id,
        etiqueta: opcion.etiqueta,
        texto: opcion.texto,
        correcta: opcion.correcta,
        orden: opcion.orden,
        retroalimentacion: opcion.retroalimentacion ?? null
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
  "/actividades/:actividad_id",
  zValidator("json", updateActivitySchema),
  async (c) => {
    const db = c.get("db");
    const activityId = c.req.param("actividad_id");
    const body = c.req.valid("json");

    const { data: activity, error } = await db
      .from("actividad")
      .update({
        ...(body.tema_id && { tema_id: body.tema_id }),
        ...(body.paso_id !== undefined && { paso_id: body.paso_id }),
        ...(body.grupo_edad_id && { grupo_edad_id: body.grupo_edad_id }),
        ...(body.tipo_actividad_id && { tipo_actividad_id: body.tipo_actividad_id }),
        ...(body.titulo && { titulo: body.titulo }),
        ...(body.consigna && { consigna: body.consigna }),
        ...(body.retroalimentacion !== undefined && { retroalimentacion: body.retroalimentacion }),
        ...(body.orden && { orden: body.orden }),
        ...(body.xp_recompensa && { xp_recompensa: body.xp_recompensa }),
        ...(body.limite_tiempo_seg !== undefined && { limite_tiempo_seg: body.limite_tiempo_seg }),
        ...(body.dificultad && { dificultad: body.dificultad }),
        ...(body.obligatorio !== undefined && { obligatorio: body.obligatorio }),
        ...(body.configuracion && { configuracion: body.configuracion as Json }),
        actualizado_en: new Date().toISOString()
      } as Database["public"]["Tables"]["actividad"]["Update"])
      .eq("id", activityId)
      .select("*")
      .single();

    if (error || !activity) throw new NotFoundError("Actividad no encontrada");

    if (body.opciones) {
      const { error: delError } = await db
        .from("opcion_actividad")
        .delete()
        .eq("actividad_id", activityId);
      if (delError) throw delError;

      const rows = body.opciones.map((opcion) => ({
        actividad_id: activityId,
        etiqueta: opcion.etiqueta,
        texto: opcion.texto,
        correcta: opcion.correcta,
        orden: opcion.orden,
        retroalimentacion: opcion.retroalimentacion ?? null
      }));

      const { error: insError } = await db.from("opcion_actividad").insert(rows);
      if (insError) throw insError;
    }

    return responderExito(activity);
  }
);

adminRoutes.delete("/actividades/:actividad_id", async (c) => {
  const db = c.get("db");
  const activityId = c.req.param("actividad_id");

  await db.from("opcion_actividad").delete().eq("actividad_id", activityId);
  await db.from("progreso_actividad_usuario").delete().eq("actividad_id", activityId);

  const { error } = await db.from("actividad").delete().eq("id", activityId);
  if (error) throw error;

  return responderExito({ deleted: true });
});

adminRoutes.post("/temas/:tema_id/publicar", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const themeId = c.req.param("tema_id");

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

adminRoutes.post("/temas/:tema_id/borrador", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("tema_id");

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

adminRoutes.post("/temas/:tema_id/archivar", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("tema_id");

  const { error } = await db
    .from("tema")
    .update({
      estado: "archivado",
      actualizado_en: new Date().toISOString()
    })
    .eq("id", themeId);

  if (error) throw error;

  const { data, error: lecturaError } = await db
    .from("tema")
    .select("*, path:senda_id(id, codigo, nombre, color_hex), created_by:creado_por(id, nombre_visible), portada_recurso:portada_recurso_id(id, url_publica, texto_alternativo, titulo), grupos_edad:tema_grupo_edad(grupo_edad:grupo_edad_id(id, codigo, nombre))")
    .eq("id", themeId)
    .single();

  if (lecturaError || !data) throw new NotFoundError("Tema no encontrado");

  return responderExito(mapTheme(data as Record<string, unknown>));
});

adminRoutes.post("/temas/:tema_id/duplicar", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const themeId = c.req.param("tema_id");

  const { data: temaOrigen, error: temaOrigenError } = await db
    .from("tema")
    .select("*, path:senda_id(id, codigo, nombre, color_hex), created_by:creado_por(id, nombre_visible), portada_recurso:portada_recurso_id(id, url_publica, texto_alternativo, titulo), grupos_edad:tema_grupo_edad(grupo_edad:grupo_edad_id(id, codigo, nombre))")
    .eq("id", themeId)
    .single();

  if (temaOrigenError || !temaOrigen) {
    throw new NotFoundError("Tema no encontrado");
  }

  const temaBase = temaOrigen as Record<string, unknown>;
  const { data: temaDuplicado, error: duplicadoError } = await db
    .from("tema")
    .insert({
      senda_id: String(temaBase.senda_id ?? ""),
      titulo: crearTituloCopia(String(temaBase.titulo ?? "Tema")),
      slug: crearSlugCopia(String(temaBase.slug ?? "tema")),
      objetivo: String(temaBase.objetivo ?? ""),
      resumen: (temaBase.resumen ?? null) as string | null,
      portada_recurso_id: (temaBase.portada_recurso_id ?? null) as string | null,
      estado: "borrador",
      version_biblica_id: (temaBase.version_biblica_id ?? null) as string | null,
      xp_recompensa: Number(temaBase.xp_recompensa ?? 0),
      minutos_estimados: Number(temaBase.minutos_estimados ?? 0),
      version_contenido: 0,
      creado_por: user.id,
      actualizado_en: new Date().toISOString()
    })
    .single();

  if (duplicadoError || !temaDuplicado) {
    throw duplicadoError ?? new NotFoundError("Tema duplicado no encontrado");
  }

  const gruposEdad = Array.isArray(temaBase.grupos_edad)
    ? temaBase.grupos_edad.map((grupo) => {
        const grupoEdadRaw = (grupo as Record<string, unknown>).grupo_edad as Record<string, unknown> | undefined;
        const grupoEdad = grupoEdadRaw ?? (grupo as Record<string, unknown>);

        return {
          tema_id: String((temaDuplicado as Record<string, unknown>).id ?? ""),
          grupo_edad_id: String(grupoEdad.id ?? "")
        };
      })
    : [];

  if (gruposEdad.length > 0) {
    const { error: gruposError } = await db.from("tema_grupo_edad").insert(gruposEdad);
    if (gruposError) throw gruposError;
  }

  return responderExito(
    mapTheme({
      ...(temaBase as Record<string, unknown>),
      ...(temaDuplicado as Record<string, unknown>),
      path: temaBase.path,
      created_by: {
        id: user.id,
        nombre_visible: user.displayName
      },
      portada_recurso: temaBase.portada_recurso,
      grupos_edad: temaBase.grupos_edad
    }),
    201
  );
});

adminRoutes.get("/usuarios", async (c) => {
  const q = c.req.query("q");
  const rol = c.req.query("rol");
  const limit = Math.min(Math.max(Number(c.req.query("limit") ?? "20"), 1), 100);
  const offset = Math.max(Number(c.req.query("offset") ?? "0"), 0);

  const condiciones = [] as Array<ReturnType<typeof eq> | ReturnType<typeof or>>;

  if (q) {
    condiciones.push(or(ilike(schema.usuarioApp.nombreVisible, `%${q}%`), ilike(schema.usuarioApp.correo, `%${q}%`))!);
  }

  if (rol) {
    condiciones.push(eq(schema.usuarioApp.rol, rol as Database["public"]["Enums"]["rol_usuario"]));
  }

  const whereClause = condiciones.length > 0 ? and(...condiciones) : undefined;

  const usuarios = await db
    .select({
      usuario: schema.usuarioApp,
      perfil: schema.perfil
    })
    .from(schema.usuarioApp)
    .leftJoin(schema.perfil, eq(schema.usuarioApp.id, schema.perfil.usuarioId))
    .where(whereClause)
    .orderBy(desc(schema.usuarioApp.creadoEn))
    .limit(limit)
    .offset(offset);

  const [countRow] = await db
    .select({ total: sql<number>`count(*)` })
    .from(schema.usuarioApp)
    .where(whereClause);

  return responderExito({
    usuarios: usuarios.map((fila) => ({
      id: fila.usuario.id,
      rol: fila.usuario.rol,
      proveedor: fila.usuario.proveedor,
      nombre_visible: fila.usuario.nombreVisible,
      correo: fila.usuario.correo,
      activo: fila.usuario.activo,
      creado_en: fila.usuario.creadoEn.toISOString(),
      actualizado_en: fila.usuario.actualizadoEn.toISOString(),
      ultimo_login_en: fila.usuario.ultimoLoginEn ? fila.usuario.ultimoLoginEn.toISOString() : null,
      perfil: fila.perfil
    })),
    total: Number(countRow?.total ?? 0)
  });
});

adminRoutes.get("/usuarios/:usuario_id", async (c) => {
  const usuarioId = c.req.param("usuario_id");

  const [usuario] = await db
    .select({ usuario: schema.usuarioApp, perfil: schema.perfil })
    .from(schema.usuarioApp)
    .leftJoin(schema.perfil, eq(schema.usuarioApp.id, schema.perfil.usuarioId))
    .where(eq(schema.usuarioApp.id, usuarioId))
    .limit(1);

  if (!usuario) throw new NotFoundError("Usuario no encontrado");

  return responderExito({
    id: usuario.usuario.id,
    rol: usuario.usuario.rol,
    proveedor: usuario.usuario.proveedor,
    nombre_visible: usuario.usuario.nombreVisible,
    correo: usuario.usuario.correo,
    activo: usuario.usuario.activo,
    creado_en: usuario.usuario.creadoEn.toISOString(),
    actualizado_en: usuario.usuario.actualizadoEn.toISOString(),
    ultimo_login_en: usuario.usuario.ultimoLoginEn ? usuario.usuario.ultimoLoginEn.toISOString() : null,
    perfil: usuario.perfil
  });
});

adminRoutes.patch(
  "/usuarios/:usuario_id",
  zValidator("json", updateUserSchema),
  async (c) => {
    const usuarioId = c.req.param("usuario_id");
    const body = c.req.valid("json");

    const [existing] = await db.select({ id: schema.usuarioApp.id }).from(schema.usuarioApp).where(eq(schema.usuarioApp.id, usuarioId)).limit(1);
    if (!existing) throw new NotFoundError("Usuario no encontrado");

    await db
      .update(schema.usuarioApp)
      .set({
        ...(body.rol !== undefined ? { rol: body.rol } : {}),
        ...(body.nombre_visible !== undefined ? { nombreVisible: body.nombre_visible } : {}),
        actualizadoEn: new Date()
      })
      .where(eq(schema.usuarioApp.id, usuarioId));

    const [usuario] = await db
      .select({ usuario: schema.usuarioApp, perfil: schema.perfil })
      .from(schema.usuarioApp)
      .leftJoin(schema.perfil, eq(schema.usuarioApp.id, schema.perfil.usuarioId))
      .where(eq(schema.usuarioApp.id, usuarioId))
      .limit(1);

    return responderExito({
      id: usuario.usuario.id,
      rol: usuario.usuario.rol,
      proveedor: usuario.usuario.proveedor,
      nombre_visible: usuario.usuario.nombreVisible,
      correo: usuario.usuario.correo,
      activo: usuario.usuario.activo,
      creado_en: usuario.usuario.creadoEn.toISOString(),
      actualizado_en: usuario.usuario.actualizadoEn.toISOString(),
      ultimo_login_en: usuario.usuario.ultimoLoginEn ? usuario.usuario.ultimoLoginEn.toISOString() : null,
      perfil: usuario.perfil
    });
  }
);

adminRoutes.delete("/usuarios/:usuario_id", async (c) => {
  const usuarioId = c.req.param("usuario_id");

  const [existing] = await db.select({ id: schema.usuarioApp.id }).from(schema.usuarioApp).where(eq(schema.usuarioApp.id, usuarioId)).limit(1);
  if (!existing) throw new NotFoundError("Usuario no encontrado");

  await db
    .update(schema.usuarioApp)
    .set({ activo: false, actualizadoEn: new Date() })
    .where(eq(schema.usuarioApp.id, usuarioId));

  return responderExito({ eliminado: true });
});
