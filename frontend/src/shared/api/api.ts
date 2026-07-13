import { env } from "../config/env";
import { sessionStorageApi } from "./session";
import { ErrorApi } from "./error-api";

export type { Usuario, Perfil, Senda, GrupoEdad, Tema, Paso, Actividad, EventoProgreso } from "./schemas";
import type { EventoProgreso } from "./schemas";

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

export interface Autenticacion {
  tipo: "invitado";
  encabezado: "x-guest-user-id";
  valor: string;
  encabezado_token: "x-guest-token";
  token: string;
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
    LISTAR: "/media",
    SUBIR: "/media/subir",
    VER: (id: string) => `/media/${id}`,
    URL_FIRMADA: (id: string) => `/media/${id}/url`,
    ACTUALIZAR: (id: string) => `/media/${id}`,
    ELIMINAR: (id: string) => `/media/${id}`,
  },
} as const;
