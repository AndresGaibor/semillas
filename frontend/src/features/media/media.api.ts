import { env } from "../../shared/config/env";
import { sessionStorageApi } from "../../shared/api/session";
import { RUTAS_API, peticion } from "../../shared/api/api";

export type RecursoMultimedia = {
  id: string;
  tipo: "imagen" | "audio" | "video" | "documento";
  bucket_almacenamiento: string | null;
  clave_almacenamiento: string | null;
  url_publica: string;
  texto_alternativo: string | null;
  titulo: string;
  tipo_mime: string;
  tamano_bytes: number;
  creado_por: string;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
};

/**
 * Sube un archivo multimedia al servidor (Supabase Storage) y registra sus metadatos.
 * 
 * HTTP Verb: POST
 * Endpoint: /media/subir
 * Auth: Requerido
 */
export async function subirArchivo(
  archivo: File,
  tipo: "imagen" | "audio" | "video" | "documento",
  textoAlternativo?: string
): Promise<RecursoMultimedia> {
  const formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("tipo", tipo);
  if (textoAlternativo) {
    formData.append("texto_alternativo", textoAlternativo);
  }

  const headers: Record<string, string> = {};
  const idInvitado = sessionStorageApi.getGuestUserId();
  const token = sessionStorageApi.getAccessToken();
  if (idInvitado) headers["X-Guest-User-Id"] = idInvitado;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${env.apiUrl}${RUTAS_API.MEDIA.SUBIR}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const resultado = await res.json().catch(() => null);

  if (!res.ok || !resultado?.exito) {
    throw new Error(resultado?.error ?? "Error al subir el archivo");
  }

  return resultado.datos as RecursoMultimedia;
}

/**
 * Obtiene los detalles de un recurso multimedia existente por su ID.
 * 
 * HTTP Verb: GET
 * Endpoint: /media/:id
 * Auth: No requerido
 */
export function obtenerRecursoMultimedia(id: string) {
  return peticion<RecursoMultimedia>(RUTAS_API.MEDIA.VER(id), { autenticar: false });
}

export function obtenerUrlFirmadaRecurso(id: string) {
  return peticion<{ url: string; expira_en_segundos: number }>(RUTAS_API.MEDIA.URL_FIRMADA(id));
}

/**
 * Elimina lógicamente un recurso multimedia (lo marca como inactivo).
 * 
 * HTTP Verb: DELETE
 * Endpoint: /media/:id
 * Auth: Requerido
 */
export function eliminarRecursoMultimedia(id: string) {
  return peticion<{ deleted: boolean }>(RUTAS_API.MEDIA.ELIMINAR(id), {
    metodo: "DELETE",
  });
}

export function obtenerRecursosMultimedia() {
  return peticion<RecursoMultimedia[]>("/media");
}
