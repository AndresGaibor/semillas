import type { ThemesRepository } from "./themes.repository";
import type { createSupabaseAdmin } from "../../db/client";

const URL_FIRMA_EXPIRADA_SEGUNDOS = 300;

type Dependencias = {
  themes: ThemesRepository;
  crearSupabaseAdmin: typeof createSupabaseAdmin;
};

type TemaListadoRespuesta = {
  id: string;
  titulo: string;
  slug: string;
  resumen: string | null;
  objetivo: string;
  xpRecompensa: number;
  minutosEstimados: number;
  versionContenido: number;
  estado: string;
  publicadoEn: string | null;
  senda: { id: string; nombre: string; codigo: string; colorHex: string } | null;
  portada: {
    id: string;
    tipo: string | null;
    urlPublica: string;
    textoAlternativo: string | null;
    tipoMime: string | null;
    tamanoBytes: number | null;
    duracionSeg: number | null;
    anchoPx: number | null;
    altoPx: number | null;
  } | null;
};

function serializarTemaListado({ tema, enda, portada }: Awaited<ReturnType<ThemesRepository["listarTemasPublicos"]>>[number]): TemaListadoRespuesta {
  return {
    id: tema.id,
    titulo: tema.titulo,
    slug: tema.slug,
    resumen: tema.resumen,
    objetivo: tema.objetivo,
    xpRecompensa: tema.xpRecompensa,
    minutosEstimados: tema.minutosEstimados,
    versionContenido: tema.versionContenido,
    estado: tema.estado,
    publicadoEn: tema.publicadoEn?.toISOString() ?? null,
    senda: enda
      ? { id: enda.id, nombre: enda.nombre, codigo: enda.codigo, colorHex: enda.colorHex }
      : null,
    portada: portada
      ? {
          id: portada.id,
          tipo: portada.tipo,
          urlPublica: portada.urlPublica,
          textoAlternativo: portada.textoAlternativo,
          tipoMime: portada.tipoMime,
          tamanoBytes: portada.tamanoBytes,
          duracionSeg: portada.duracionSeg,
          anchoPx: portada.anchoPx,
          altoPx: portada.altoPx
        }
      : null
  };
}

function serializarPaso(registro: Awaited<ReturnType<ThemesRepository["listarPasosTema"]>>[number]) {
  return {
    id: registro.paso.id,
    temaId: registro.paso.temaId,
    orden: registro.paso.orden,
    obligatorio: registro.paso.obligatorio,
    tipoPaso: registro.tipoPaso
      ? {
          id: registro.tipoPaso.id,
          codigo: registro.tipoPaso.codigo,
          nombre: registro.tipoPaso.nombre,
          orden: registro.tipoPaso.orden,
          colorHex: registro.tipoPaso.colorHex
        }
      : null,
    contenidos: registro.contenidos,
    preguntas: registro.preguntas
  };
}

function serializarActividad(registro: Awaited<ReturnType<ThemesRepository["listarActividadesTema"]>>[number]) {
  return {
    id: registro.actividad.id,
    titulo: registro.actividad.titulo,
    consigna: registro.actividad.consigna,
    dificultad: registro.actividad.dificultad,
    xpRecompensa: registro.actividad.xpRecompensa,
    obligatorio: registro.actividad.obligatorio,
    limiteTiempoSeg: registro.actividad.limiteTiempoSeg,
    retroalimentacion: registro.actividad.retroalimentacion,
    configuracion: registro.actividad.configuracion,
    orden: registro.actividad.orden,
    tipoActividad: registro.tipoActividad
      ? {
          id: registro.tipoActividad.id,
          codigo: registro.tipoActividad.codigo,
          nombre: registro.tipoActividad.nombre,
          esJuego: registro.tipoActividad.esJuego
        }
      : null,
    opciones: registro.opciones
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

      return { url: data.signedUrl, expiraEnSegundos: URL_FIRMA_EXPIRADA_SEGUNDOS };
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
