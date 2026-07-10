import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { Database, Json } from "../../db/database.types";
import { NotFoundError } from "../../shared/errors/http-error";
import { schema } from "../../db/client";
import { crearSlugCopia, crearTituloCopia, mapActivity, mapStep, mapTheme } from "./admin.formatters";

export type AdminUser = {
  id: string;
  role: string;
  displayName: string;
};

export function crearAdminRepository(db: any) {
  return {
    async obtenerResumen() {
      const [themes, users, activities, published] = await Promise.all([
        db.from("tema").select("id"),
        db.from("usuario_app").select("id"),
        db.from("actividad").select("id"),
        db.from("tema").select("id").eq("estado", "publicado")
      ]);

      return {
        temas: themes.data?.length ?? 0,
        publicados: published.data?.length ?? 0,
        usuarios: users.data?.length ?? 0,
        actividades: activities.data?.length ?? 0
      };
    },

    async listarActividades(filtros: { temaId?: string; tipoId?: string; grupoEdadId?: string; estado?: string; limit: number; offset: number }) {
      let query = db
        .from("actividad")
        .select(`
      *,
      tipo_actividad:tipo_actividad_id(id, codigo, nombre),
      tema:tema_id(id, titulo, slug, estado, senda:senda_id(id, codigo, nombre, color_hex)),
      grupo_edad:grupo_edad_id(id, codigo, nombre)
    `, { count: "exact" })
        .order("creado_en", { ascending: false })
        .range(filtros.offset, filtros.offset + filtros.limit - 1);

      if (filtros.temaId) query = query.eq("tema_id", filtros.temaId);
      if (filtros.tipoId) query = query.eq("tipo_actividad_id", filtros.tipoId);
      if (filtros.grupoEdadId) query = query.eq("grupo_edad_id", filtros.grupoEdadId);
      if (filtros.estado) query = query.eq("obligatorio", filtros.estado === "publicada");

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        actividades: (data ?? []).map((a: Record<string, unknown>) => mapActivity(a)),
        total: count ?? 0
      };
    },

    async listarTemas(status?: string) {
      let query = db
        .from("tema")
        .select("*, path:senda_id(id, codigo, nombre, color_hex), created_by:creado_por(id, nombre_visible), portada_recurso:portada_recurso_id(id, url_publica, texto_alternativo, titulo), grupos_edad:tema_grupo_edad(grupo_edad:grupo_edad_id(id, codigo, nombre))")
        .order("actualizado_en", { ascending: false });

      if (status) query = query.eq("estado", status as Database["public"]["Enums"]["estado_publicacion"]);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((theme: Record<string, unknown>) => mapTheme(theme));
    },

    async obtenerTema(temaId: string) {
      const { data, error } = await db
        .from("tema")
        .select("*, path:senda_id(id, codigo, nombre, color_hex), created_by:creado_por(id, nombre_visible), portada_recurso:portada_recurso_id(id, url_publica, texto_alternativo, titulo), grupos_edad:tema_grupo_edad(grupo_edad:grupo_edad_id(id, codigo, nombre))")
        .eq("id", temaId)
        .single();
      if (error || !data) throw new NotFoundError("Tema no encontrado");
      return mapTheme(data as Record<string, unknown>);
    },

    async crearTema(body: any, userId: string) {
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
          creado_por: userId
        })
        .select("*")
        .single();

      if (error || !theme) throw error;
      const rows = body.grupo_edad_ids.map((grupoEdadId: string) => ({ tema_id: theme.id, grupo_edad_id: grupoEdadId }));
      const { error: ageError } = await db.from("tema_grupo_edad").insert(rows);
      if (ageError) throw ageError;
      return mapTheme(theme as Record<string, unknown>);
    },

    async actualizarTema(temaId: string, body: any) {
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
        .eq("id", temaId)
        .select("*")
        .single();
      if (error || !theme) throw new NotFoundError("Tema no encontrado");
      if (body.grupo_edad_ids) {
        await db.from("tema_grupo_edad").delete().eq("tema_id", temaId);
        await db.from("tema_grupo_edad").insert(body.grupo_edad_ids.map((grupoEdadId: string) => ({ tema_id: temaId, grupo_edad_id: grupoEdadId })));
      }
      return mapTheme(theme as Record<string, unknown>);
    },

    async borrarTema(temaId: string) {
      const { error } = await db.from("tema").delete().eq("id", temaId);
      if (error) throw error;
      return { deleted: true };
    },

    async crearPasoTema(temaId: string, body: any) {
      const { data: stepType } = await db.from("tipo_paso_crecer").select("orden").eq("id", body.tipo_paso_id).single();
      const sortOrder = stepType?.orden ?? 1;
      const { data: step, error: stepError } = await db.from("paso_tema").upsert({ tema_id: temaId, tipo_paso_id: body.tipo_paso_id, orden: sortOrder, obligatorio: true }, { onConflict: "tema_id,tipo_paso_id" }).select("*").single();
      if (stepError || !step) throw stepError;
      const { data: content, error: contentError } = await db.from("contenido_paso_tema").upsert({ paso_id: step.id, grupo_edad_id: body.grupo_edad_id, titulo: body.titulo, cuerpo: body.cuerpo, instruccion_corta: body.instruccion_corta ?? null }, { onConflict: "paso_id,grupo_edad_id" }).select("*").single();
      if (contentError) throw contentError;
      return { paso: mapStep(step as Record<string, unknown>), contenido: { id: String(content.id), paso_id: String(content.paso_id), grupo_edad_id: String(content.grupo_edad_id), titulo: String(content.titulo), cuerpo: String(content.cuerpo), instruccion_corta: (content.instruccion_corta ?? null) as string | null } };
    },

    async listarPasosTema(temaId: string) {
      const { data: steps, error } = await db.from("paso_tema").select(`*, tipo_paso:tipo_paso_id(*), contenidos:contenido_paso_tema(*)`).eq("tema_id", temaId).order("orden", { ascending: true });
      if (error) throw error;
      return (steps ?? []).map((step: Record<string, unknown>) => mapStep(step));
    },

    async borrarPasoTema(temaId: string, tipoPasoId: string) {
      const { data: step } = await db.from("paso_tema").select("id").eq("tema_id", temaId).eq("tipo_paso_id", tipoPasoId).single();
      if (!step) throw new NotFoundError("Paso no encontrado");
      await db.from("contenido_paso_tema").delete().eq("paso_id", step.id);
      await db.from("paso_tema").delete().eq("id", step.id);
      return { deleted: true };
    },

    async crearActividad(body: any) {
      const { data: activity, error } = await db.from("actividad").insert({ tema_id: body.tema_id, paso_id: body.paso_id ?? null, grupo_edad_id: body.grupo_edad_id, tipo_actividad_id: body.tipo_actividad_id, titulo: body.titulo, consigna: body.consigna, retroalimentacion: body.retroalimentacion ?? null, orden: body.orden, xp_recompensa: body.xp_recompensa, limite_tiempo_seg: body.limite_tiempo_seg ?? null, dificultad: body.dificultad, obligatorio: body.obligatorio, configuracion: body.configuracion as Json }).select("*").single();
      if (error || !activity) throw error;
      if (body.opciones.length > 0) {
        const rows = body.opciones.map((opcion: any) => ({ actividad_id: activity.id, etiqueta: opcion.etiqueta, texto: opcion.texto, correcta: opcion.correcta, orden: opcion.orden, retroalimentacion: opcion.retroalimentacion ?? null }));
        const { error: optionsError } = await db.from("opcion_actividad").insert(rows);
        if (optionsError) throw optionsError;
      }
      return activity;
    },

    async actualizarActividad(actividadId: string, body: any) {
      const { data: activity, error } = await db.from("actividad").update({ ...(body.tema_id && { tema_id: body.tema_id }), ...(body.paso_id !== undefined && { paso_id: body.paso_id }), ...(body.grupo_edad_id && { grupo_edad_id: body.grupo_edad_id }), ...(body.tipo_actividad_id && { tipo_actividad_id: body.tipo_actividad_id }), ...(body.titulo && { titulo: body.titulo }), ...(body.consigna && { consigna: body.consigna }), ...(body.retroalimentacion !== undefined && { retroalimentacion: body.retroalimentacion }), ...(body.orden && { orden: body.orden }), ...(body.xp_recompensa && { xp_recompensa: body.xp_recompensa }), ...(body.limite_tiempo_seg !== undefined && { limite_tiempo_seg: body.limite_tiempo_seg }), ...(body.dificultad && { dificultad: body.dificultad }), ...(body.obligatorio !== undefined && { obligatorio: body.obligatorio }), ...(body.configuracion && { configuracion: body.configuracion as Json }), actualizado_en: new Date().toISOString() } as Database["public"]["Tables"]["actividad"]["Update"]).eq("id", actividadId).select("*").single();
      if (error || !activity) throw new NotFoundError("Actividad no encontrada");
      if (body.opciones) {
        const { error: delError } = await db.from("opcion_actividad").delete().eq("actividad_id", actividadId); if (delError) throw delError;
        const rows = body.opciones.map((opcion: any) => ({ actividad_id: actividadId, etiqueta: opcion.etiqueta, texto: opcion.texto, correcta: opcion.correcta, orden: opcion.orden, retroalimentacion: opcion.retroalimentacion ?? null }));
        const { error: insError } = await db.from("opcion_actividad").insert(rows); if (insError) throw insError;
      }
      return activity;
    },

    async borrarActividad(actividadId: string) {
      await db.from("opcion_actividad").delete().eq("actividad_id", actividadId);
      await db.from("progreso_actividad_usuario").delete().eq("actividad_id", actividadId);
      const { error } = await db.from("actividad").delete().eq("id", actividadId);
      if (error) throw error;
      return { deleted: true };
    },

    async publicarTema(temaId: string, userId: string) {
      const { data: theme, error: themeError } = await db.from("tema").select("id, version_contenido").eq("id", temaId).single();
      if (themeError || !theme) throw new NotFoundError("Tema no encontrado");
      const currentVersion = theme.version_contenido ?? 0;
      const { data, error } = await db.from("tema").update({ estado: "publicado", version_contenido: currentVersion + 1, publicado_por: userId, publicado_en: new Date().toISOString(), actualizado_en: new Date().toISOString() }).eq("id", temaId).select("*").single();
      if (error) throw error;
      return mapTheme(data as Record<string, unknown>);
    },

    async guardarBorradorTema(temaId: string) {
      const { data, error } = await db.from("tema").update({ estado: "borrador", actualizado_en: new Date().toISOString() }).eq("id", temaId).select("*").single();
      if (error) throw error;
      return mapTheme(data as Record<string, unknown>);
    },

    async archivarTema(temaId: string) {
      const { error } = await db.from("tema").update({ estado: "archivado", actualizado_en: new Date().toISOString() }).eq("id", temaId);
      if (error) throw error;
      return this.obtenerTema(temaId);
    },

    async duplicarTema(temaId: string, user: AdminUser) {
      const { data: temaOrigen, error: temaOrigenError } = await db.from("tema").select("*, path:senda_id(id, codigo, nombre, color_hex), created_by:creado_por(id, nombre_visible), portada_recurso:portada_recurso_id(id, url_publica, texto_alternativo, titulo), grupos_edad:tema_grupo_edad(grupo_edad:grupo_edad_id(id, codigo, nombre))").eq("id", temaId).single();
      if (temaOrigenError || !temaOrigen) throw new NotFoundError("Tema no encontrado");
      const temaBase = temaOrigen as Record<string, unknown>;
      const { data: temaDuplicado, error: duplicadoError } = await db.from("tema").insert({ senda_id: String(temaBase.senda_id ?? ""), titulo: crearTituloCopia(String(temaBase.titulo ?? "Tema")), slug: crearSlugCopia(String(temaBase.slug ?? "tema")), objetivo: String(temaBase.objetivo ?? ""), resumen: (temaBase.resumen ?? null) as string | null, portada_recurso_id: (temaBase.portada_recurso_id ?? null) as string | null, estado: "borrador", version_biblica_id: (temaBase.version_biblica_id ?? null) as string | null, xp_recompensa: Number(temaBase.xp_recompensa ?? 0), minutos_estimados: Number(temaBase.minutos_estimados ?? 0), version_contenido: 0, creado_por: user.id, actualizado_en: new Date().toISOString() }).single();
      if (duplicadoError || !temaDuplicado) throw duplicadoError ?? new NotFoundError("Tema duplicado no encontrado");
      const gruposEdad = Array.isArray(temaBase.grupos_edad) ? temaBase.grupos_edad.map((grupo) => { const grupoEdadRaw = (grupo as Record<string, unknown>).grupo_edad as Record<string, unknown> | undefined; const grupoEdad = grupoEdadRaw ?? (grupo as Record<string, unknown>); return { tema_id: String((temaDuplicado as Record<string, unknown>).id ?? ""), grupo_edad_id: String(grupoEdad.id ?? "") }; }) : [];
      if (gruposEdad.length > 0) {
        const { error: gruposError } = await db.from("tema_grupo_edad").insert(gruposEdad); if (gruposError) throw gruposError;
      }
      return mapTheme({ ...(temaBase as Record<string, unknown>), ...(temaDuplicado as Record<string, unknown>), path: temaBase.path, created_by: { id: user.id, nombre_visible: user.displayName }, portada_recurso: temaBase.portada_recurso, grupos_edad: temaBase.grupos_edad });
    },

    async listarUsuarios(params: { q?: string; rol?: string; limit: number; offset: number }) {
      const condiciones = [] as Array<ReturnType<typeof eq> | ReturnType<typeof or>>;
      if (params.q) condiciones.push(or(ilike(schema.usuarioApp.nombreVisible, `%${params.q}%`), ilike(schema.usuarioApp.correo, `%${params.q}%`))!);
      if (params.rol) condiciones.push(eq(schema.usuarioApp.rol, params.rol as Database["public"]["Enums"]["rol_usuario"]));
      const whereClause = condiciones.length > 0 ? and(...condiciones) : undefined;
      const usuarios = await db.select({ usuario: schema.usuarioApp, perfil: schema.perfil }).from(schema.usuarioApp).leftJoin(schema.perfil, eq(schema.usuarioApp.id, schema.perfil.usuarioId)).where(whereClause).orderBy(desc(schema.usuarioApp.creadoEn)).limit(params.limit).offset(params.offset);
      const [countRow] = await db.select({ total: sql<number>`count(*)` }).from(schema.usuarioApp).where(whereClause);
      return { usuarios: usuarios.map((fila: any) => ({ id: fila.usuario.id, rol: fila.usuario.rol, proveedor: fila.usuario.proveedor, nombre_visible: fila.usuario.nombreVisible, correo: fila.usuario.correo, activo: fila.usuario.activo, creado_en: fila.usuario.creadoEn.toISOString(), actualizado_en: fila.usuario.actualizadoEn.toISOString(), ultimo_login_en: fila.usuario.ultimoLoginEn ? fila.usuario.ultimoLoginEn.toISOString() : null, perfil: fila.perfil })), total: Number(countRow?.total ?? 0) };
    },

    async obtenerUsuario(usuarioId: string) {
      const [usuario] = await db.select({ usuario: schema.usuarioApp, perfil: schema.perfil }).from(schema.usuarioApp).leftJoin(schema.perfil, eq(schema.usuarioApp.id, schema.perfil.usuarioId)).where(eq(schema.usuarioApp.id, usuarioId)).limit(1);
      if (!usuario) throw new NotFoundError("Usuario no encontrado");
      return { id: usuario.usuario.id, rol: usuario.usuario.rol, proveedor: usuario.usuario.proveedor, nombre_visible: usuario.usuario.nombreVisible, correo: usuario.usuario.correo, activo: usuario.usuario.activo, creado_en: usuario.usuario.creadoEn.toISOString(), actualizado_en: usuario.usuario.actualizadoEn.toISOString(), ultimo_login_en: usuario.usuario.ultimoLoginEn ? usuario.usuario.ultimoLoginEn.toISOString() : null, perfil: usuario.perfil };
    },

    async actualizarUsuario(usuarioId: string, body: any) {
      const [existing] = await db.select({ id: schema.usuarioApp.id }).from(schema.usuarioApp).where(eq(schema.usuarioApp.id, usuarioId)).limit(1); if (!existing) throw new NotFoundError("Usuario no encontrado");
      await db.update(schema.usuarioApp).set({ ...(body.rol !== undefined ? { rol: body.rol } : {}), ...(body.nombre_visible !== undefined ? { nombreVisible: body.nombre_visible } : {}), actualizadoEn: new Date() }).where(eq(schema.usuarioApp.id, usuarioId));
      return this.obtenerUsuario(usuarioId);
    },

    async eliminarUsuario(usuarioId: string) {
      const [existing] = await db.select({ id: schema.usuarioApp.id }).from(schema.usuarioApp).where(eq(schema.usuarioApp.id, usuarioId)).limit(1); if (!existing) throw new NotFoundError("Usuario no encontrado");
      await db.update(schema.usuarioApp).set({ activo: false, actualizadoEn: new Date() }).where(eq(schema.usuarioApp.id, usuarioId));
      return { eliminado: true };
    }
  };
}
