import { env } from "../config/env";
import { sessionStorageApi } from "./session";
import { ErrorApi } from "./error-api";

export function obtenerMensajeErrorApi(error: unknown): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object") {
    const detalle = error as { mensaje?: unknown; message?: unknown };
    if (typeof detalle.mensaje === "string" && detalle.mensaje.trim()) return detalle.mensaje;
    if (typeof detalle.message === "string" && detalle.message.trim()) return detalle.message;
  }
  return "Error de conexión";
}

export async function peticion<T>(
  ruta: string,
  opciones?: {
    metodo?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    cuerpo?: unknown;
    autenticar?: boolean;
  }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (opciones?.autenticar !== false) {
    const idInvitado = sessionStorageApi.getGuestUserId();
    const tokenInvitado = sessionStorageApi.getGuestToken();
    const token = sessionStorageApi.getAccessToken();
    if (idInvitado) headers["X-Guest-User-Id"] = idInvitado;
    if (tokenInvitado) headers["X-Guest-Token"] = tokenInvitado;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${env.apiUrl}${ruta}`, {
    method: opciones?.metodo ?? "GET",
    headers,
    body: opciones?.cuerpo ? JSON.stringify(opciones.cuerpo) : undefined,
  });

  const resultado = await res.json().catch(() => null);

  if (!res.ok || !resultado?.exito) {
    const mensaje = obtenerMensajeErrorApi(resultado?.error);
    const codigo = resultado?.codigo;
    throw new ErrorApi(mensaje, res.status, codigo);
  }

  return resultado.datos as T;
}

// --- Tipos de la API (todos en español, como el backend) ---

export interface Usuario {
  id: string;
  rol: string;
  proveedor: string;
  nombre_visible: string;
  correo: string | null;
}

export interface Perfil {
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
}

export interface Autenticacion {
  tipo: "invitado";
  encabezado: "x-guest-user-id";
  valor: string;
  encabezado_token: "x-guest-token";
  token: string;
}

export interface Senda {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  color_hex: string;
  nombre_icono: string | null;
  orden: number;
}

export interface GrupoEdad {
  id: string;
  codigo: string;
  nombre: string;
  edad_minima: number;
  edad_maxima: number;
  descripcion: string | null;
  orden: number;
  imagen_url?: string | null;
}

export interface Tema {
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
  creado_en?: string | null;
  actualizado_en?: string | null;
  senda?: Senda | null;
  creado_por?: {
    id: string;
    nombre_visible: string;
  } | null;
  grupos_edad?: Array<{
    id: string;
    codigo: string;
    nombre: string;
  }>;
  portada_recurso?: {
    id: string;
    tipo?: string;
    url_publica: string;
    texto_alternativo: string | null;
    titulo: string | null;
    tipo_mime?: string | null;
    tamano_bytes?: number | null;
    duracion_seg?: number | null;
    ancho_px?: number | null;
    alto_px?: number | null;
  } | null;
  portada?: {
    id: string;
    tipo?: string;
    url_publica: string;
    texto_alternativo: string | null;
    titulo: string | null;
    tipo_mime?: string | null;
    tamano_bytes?: number | null;
    duracion_seg?: number | null;
    ancho_px?: number | null;
    alto_px?: number | null;
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
}

export interface Paso {
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
    recurso_id?: string | null;
    recurso_audio_id?: string | null;
    datos_extra?: Record<string, unknown> | null;
  }>;
  preguntas?: Array<{
    id: string;
    grupo_edad_id: string;
    pregunta: string;
    orden: number;
  }>;
}

export interface Actividad {
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
    orden: number;
    correcta?: boolean;
    retroalimentacion?: string | null;
  }>;
}

export const RUTAS_API = {
  CLUBES: {
    LISTAR: "/clubes",
    MIOS: "/clubes/mios",
    CREAR: "/clubes",
    UNIRSE: "/clubes/unirse",
    DETALLE: (id: string) => `/clubes/${id}`,
    SALIR: (id: string) => `/clubes/${id}/salir`,
    REGENERAR_CODIGO: (id: string) => `/clubes/${id}/regenerar-codigo`,
    TRANSFERIR: (id: string) => `/clubes/${id}/transferir-liderazgo`,
    MIEMBRO: (id: string, usuarioId: string) => `/clubes/${id}/miembros/${usuarioId}`,
    RANKING: (id: string) => `/clubes/${id}/ranking`,
    RETOS: (id: string) => `/clubes/${id}/retos`,
    RECLAMAR_RETO: (id: string, retoId: string) => `/clubes/${id}/retos/${retoId}/reclamar`,
  },
  SYNC: {
    PUSH: "/sync/push",
    PULL: "/sync/pull",
  },
  PROGRESO: {
    REGISTRAR: "/progreso/eventos",
    MI: "/progreso/mi",
  },
  MEDIA: {
    SUBIR: "/media/subir",
    VER: (id: string) => `/media/${id}`,
    URL_FIRMADA: (id: string) => `/media/${id}/url`,
    ELIMINAR: (id: string) => `/media/${id}`,
  },
} as const;

export interface EventoProgreso {
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
}
