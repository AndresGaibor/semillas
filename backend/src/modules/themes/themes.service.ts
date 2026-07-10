import type { ThemesRepository } from "./themes.repository";
import type { createSupabaseAdmin } from "../../db/client";

const URL_FIRMA_EXPIRADA_SEGUNDOS = 300;

type Dependencias = {
  themes: ThemesRepository;
  crearSupabaseAdmin: typeof createSupabaseAdmin;
};

type RegistroTema = Awaited<ReturnType<ThemesRepository["listarTemasPublicos"]>>[number];

function serializarPortada(portada: RegistroTema["portada"]) {
  if (!portada) return null;

  return {
    id: portada.id,
    titulo: portada.titulo,
    tipo: portada.tipo,
    url_publica: portada.urlPublica,
    texto_alternativo: portada.textoAlternativo,
    tipo_mime: portada.tipoMime,
    tamano_bytes: portada.tamanoBytes,
    duracion_seg: portada.duracionSeg,
    ancho_px: portada.anchoPx,
    alto_px: portada.altoPx
  };
}

function serializarTemaListado({ tema, senda, portada }: RegistroTema) {
  return {
    id: tema.id,
    senda_id: tema.sendaId,
    titulo: tema.titulo,
    slug: tema.slug,
    objetivo: tema.objetivo,
    resumen: tema.resumen,
    portada_recurso_id: tema.portadaRecursoId,
    estado: tema.estado,
    version_biblica_id: tema.versionBiblicaId,
    xp_recompensa: tema.xpRecompensa,
    minutos_estimados: tema.minutosEstimados,
    version_contenido: tema.versionContenido,
    publicado_en: tema.publicadoEn?.toISOString() ?? null,
    creado_en: tema.creadoEn?.toISOString() ?? null,
    actualizado_en: tema.actualizadoEn?.toISOString() ?? null,
    senda: senda
      ? {
          id: senda.id,
          codigo: senda.codigo,
          nombre: senda.nombre,
          descripcion: senda.descripcion,
          color_hex: senda.colorHex,
          nombre_icono: senda.nombreIcono,
          orden: senda.orden
        }
      : null,
    portada_recurso: serializarPortada(portada)
  };
}

function serializarPaso(registro: Awaited<ReturnType<ThemesRepository["listarPasosTema"]>>[number]) {
  return {
    id: registro.paso.id,
    tema_id: registro.paso.temaId,
    orden: registro.paso.orden,
    obligatorio: registro.paso.obligatorio,
    tipo_paso: registro.tipoPaso
      ? {
          id: registro.tipoPaso.id,
          codigo: registro.tipoPaso.codigo,
          nombre: registro.tipoPaso.nombre,
          descripcion: registro.tipoPaso.descripcion,
          orden: registro.tipoPaso.orden,
          color_hex: registro.tipoPaso.colorHex
        }
      : null,
    contenidos: registro.contenidos.map((contenido) => ({
      id: contenido.id,
      paso_id: contenido.pasoId,
      grupo_edad_id: contenido.grupoEdadId,
      titulo: contenido.titulo,
      cuerpo: contenido.cuerpo,
      instruccion_corta: contenido.instruccionCorta,
      recurso_id: contenido.recursoId,
      recurso_audio_id: contenido.recursoAudioId,
      datos_extra: contenido.datosExtra
    })),
    preguntas: registro.preguntas.map((pregunta) => ({
      id: pregunta.id,
      paso_id: pregunta.pasoId,
      grupo_edad_id: pregunta.grupoEdadId,
      pregunta: pregunta.pregunta,
      orden: pregunta.orden
    }))
  };
}

function serializarActividad(registro: Awaited<ReturnType<ThemesRepository["listarActividadesTema"]>>[number]) {
  return {
    id: registro.actividad.id,
    tema_id: registro.actividad.temaId,
    paso_id: registro.actividad.pasoId,
    grupo_edad_id: registro.actividad.grupoEdadId,
    tipo_actividad_id: registro.actividad.tipoActividadId,
    titulo: registro.actividad.titulo,
    consigna: registro.actividad.consigna,
    orden: registro.actividad.orden,
    xp_recompensa: registro.actividad.xpRecompensa,
    dificultad: registro.actividad.dificultad,
    limite_tiempo_seg: registro.actividad.limiteTiempoSeg,
    obligatorio: registro.actividad.obligatorio,
    retroalimentacion: registro.actividad.retroalimentacion,
    configuracion: registro.actividad.configuracion ?? {},
    creado_en: registro.actividad.creadoEn.toISOString(),
    actualizado_en: registro.actividad.actualizadoEn.toISOString(),
    tipo_actividad: registro.tipoActividad
      ? {
          id: registro.tipoActividad.id,
          codigo: registro.tipoActividad.codigo,
          nombre: registro.tipoActividad.nombre,
          descripcion: registro.tipoActividad.descripcion,
          es_juego: registro.tipoActividad.esJuego,
          activo: registro.tipoActividad.activo,
          creado_en: registro.tipoActividad.creadoEn.toISOString()
        }
      : null,
    opciones: registro.opciones.map((opcion) => ({
      id: opcion.id,
      actividad_id: opcion.actividadId,
      etiqueta: opcion.etiqueta,
      texto: opcion.texto,
      orden: opcion.orden
    }))
  };
}

export function crearThemesService({ themes, crearSupabaseAdmin }: Dependencias) {
  return {
    async listarTemasPublicos(sendaId?: string) {
      const data = await themes.listarTemasPublicos(sendaId);
      return data.map(serializarTemaListado);
    },

    async obtenerTemaPublico(temaId: string) {
      const data = await themes.obtenerTemaPublico(temaId);
      return data ? serializarTemaListado(data) : null;
    },

    async obtenerPortadaTema(env: Parameters<typeof createSupabaseAdmin>[0], temaId: string) {
      const resultado = await themes.obtenerPortadaTema(temaId);

      if (!resultado) return null;
      if (!resultado.portada?.claveAlmacenamiento || !resultado.portada.activo) return null;

      const supabaseAdmin = crearSupabaseAdmin(env);
      const bucket = resultado.portada.bucketAlmacenamiento ?? "media";
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(resultado.portada.claveAlmacenamiento, URL_FIRMA_EXPIRADA_SEGUNDOS);

      if (error || !data?.signedUrl) {
        throw error ?? new Error("No se pudo generar URL firmada de la portada");
      }

      return { url: data.signedUrl, expira_en_segundos: URL_FIRMA_EXPIRADA_SEGUNDOS };
    },

    async listarPasosTema(temaId: string, grupoEdadId?: string) {
      const data = await themes.listarPasosTema(temaId, grupoEdadId);
      return data.map(serializarPaso);
    },

    async listarActividadesTema(temaId: string, grupoEdadId?: string) {
      const data = await themes.listarActividadesTema(temaId, grupoEdadId);
      return data.map(serializarActividad);
    }
  };
}

export type ThemesService = ReturnType<typeof crearThemesService>;
