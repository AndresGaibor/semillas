import { ApiError } from "./api-error";

export type RespuestaApi<T> =
  | {
      exito: true;
      datos: T;
    }
  | {
      exito: false;
      error: string;
      codigo?: string;
    };

export type UsuarioApi = {
  id: string;
  rol: string;
  proveedor: string;
  nombre_visible: string;
  correo: string | null;
};

export type PerfilApi = {
  id: string;
  usuario_id: string;
  apodo: string;
  grupo_edad_id: string | null;
  url_avatar: string | null;
  clave_avatar: string | null;
  prefiere_audio: boolean;
  tamano_texto_preferido: string;
  creado_en?: string;
  actualizado_en?: string;
};

export type AutenticacionApi = {
  tipo: "invitado";
  encabezado: string;
  valor: string;
};

export type AltaInvitadoInput = {
  apodo: string;
  grupo_edad_id?: string;
  url_avatar?: string;
};

export type ActualizacionPerfilInput = {
  apodo?: string;
  grupo_edad_id?: string | null;
  url_avatar?: string | null;
  prefiere_audio?: boolean;
  tamano_texto_preferido?: "small" | "medium" | "large";
};

export type SendaApi = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  color_hex: string;
  nombre_icono: string | null;
  orden: number;
};

export type GrupoEdadApi = {
  id: string;
  codigo: string;
  nombre: string;
  edad_minima: number;
  edad_maxima: number;
  descripcion: string | null;
  orden: number;
};

export type VersionBiblicaApi = {
  id: string;
  codigo: string;
  nombre: string;
  dominio_publico: boolean;
};

export type PasoCrecerCatalogoApi = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  color_hex: string | null;
};

export type TipoActividadCatalogoApi = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  es_juego: boolean;
};

export type TemaApi = {
  id: string;
  senda_id: string;
  titulo: string;
  slug: string;
  objetivo: string;
  resumen: string | null;
  portada_recurso_id: string | null;
  estado: string;
  version_biblica_id: string | null;
  xp_recompensa: number;
  minutos_estimados: number;
  version_contenido: number;
  publicado_en: string | null;
  senda?: SendaApi | null;
  portada_recurso?: {
    id: string;
    tipo: string;
    url_publica: string;
    texto_alternativo: string | null;
    titulo: string | null;
    tipo_mime: string | null;
    tamano_bytes: number | null;
    duracion_seg: number | null;
    ancho_px: number | null;
    alto_px: number | null;
  } | null;
  versiculo_clave?: {
    id: string;
    tema_id: string;
    texto: string;
    libro_id: number;
    capitulo: number;
    versiculo: number;
  } | null;
  referencia_biblica?: {
    id: string;
    tema_id: string;
    libro_id: number;
    capitulo: number;
    versiculo_inicio: number;
    versiculo_fin: number;
    principal: boolean;
  } | null;
};

export type TemaPasoApi = {
  id: string;
  tema_id: string;
  orden: number;
  tipo_paso: {
    id: string;
    codigo: string;
    nombre: string;
    orden: number;
    color_hex: string | null;
  } | null;
  contenidos: Array<{
    id: string;
    grupo_edad_id: string;
    titulo: string;
    cuerpo: string;
    instruccion_corta: string | null;
  }>;
};

export type ActividadApi = {
  id: string;
  tema_id: string;
  paso_id: string | null;
  grupo_edad_id: string;
  tipo_actividad_id: string;
  titulo: string;
  consigna: string;
  orden: number;
  xp_recompensa: number;
  dificultad: string;
  limite_tiempo_seg: number | null;
  obligatorio: boolean;
  retroalimentacion: string | null;
  configuracion: Record<string, unknown>;
  creado_en?: string;
  actualizado_en?: string;
  tipo_actividad: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    es_juego: boolean;
    activo: boolean;
    creado_en: string;
  } | null;
  opciones: Array<{
    id: string;
    actividad_id: string;
    etiqueta: string | null;
    texto: string;
    correcta: boolean;
    orden: number;
    retroalimentacion: string | null;
  }>;
};

export type EventoProgresoApi = {
  evento_id_cliente: string;
  tipo_evento:
    | "tema_iniciado"
    | "tema_completado"
    | "bloque_iniciado"
    | "bloque_completado"
    | "actividad_iniciada"
    | "actividad_respondida"
    | "actividad_completada"
    | "recompensa_reclamada"
    | "tema_descargado"
    | "marcador_sincronizacion";
  tema_id?: string;
  paso_id?: string;
  actividad_id?: string;
  correcta?: boolean;
  puntaje?: number;
  xp_otorgada?: number;
  datos?: Record<string, unknown>;
  ocurrido_en_cliente?: string;
  dispositivo_id?: string;
};

export function desenvolverRespuesta<T>(respuesta: RespuestaApi<T>): T {
  if (!respuesta.exito) {
    throw new ApiError(400, respuesta.error, respuesta);
  }

  return respuesta.datos;
}

export function construirAltaInvitado(input: AltaInvitadoInput): AltaInvitadoInput {
  return {
    apodo: input.apodo,
    grupo_edad_id: input.grupo_edad_id,
    url_avatar: input.url_avatar
  };
}

export function construirActualizacionPerfil(input: ActualizacionPerfilInput): ActualizacionPerfilInput {
  return {
    apodo: input.apodo,
    grupo_edad_id: input.grupo_edad_id,
    url_avatar: input.url_avatar,
    prefiere_audio: input.prefiere_audio,
    tamano_texto_preferido: input.tamano_texto_preferido
  };
}

export function normalizarUsuario(usuario: UsuarioApi): UsuarioApi {
  return { ...usuario };
}

export function normalizarPerfil(perfil: PerfilApi): PerfilApi {
  return { ...perfil };
}
