import { peticion } from "../../shared/api/api";
import type { Actividad, Paso, Tema } from "../../shared/api/api";

/**
 * Obtiene la lista de temas (lecciones) del catálogo general, filtrados opcionalmente por senda.
 *
 * HTTP Verb: GET
 * Endpoint: /temas?senda_id=...
 * Auth: No requerido
 */
export function obtenerTemas(params?: { senda_id?: string }) {
  const busqueda = new URLSearchParams();
  if (params?.senda_id) busqueda.set("senda_id", params.senda_id);
  const query = busqueda.toString();
  return peticion<Tema[]>(`/temas${query ? `?${query}` : ""}`, {
    autenticar: false,
  });
}

/**
 * Obtiene la información detallada de un tema específico por su ID.
 *
 * HTTP Verb: GET
 * Endpoint: /temas/:id
 * Auth: No requerido
 */
export function obtenerTema(idTema: string) {
  return peticion<Tema>(`/temas/${idTema}`, { autenticar: false });
}

/**
 * Genera una URL firmada (300s) para mostrar la portada del tema.
 * Endpoint público; la imagen vive en bucket privado.
 */
export function obtenerUrlPortadaTema(idTema: string) {
  return peticion<{ url: string; expira_en_segundos: number }>(
    `/temas/${idTema}/portada`,
    { autenticar: false },
  );
}

/**
 * Obtiene los pasos (momentos CRECER) asociados a un tema, filtrados opcionalmente por grupo de edad.
 *
 * HTTP Verb: GET
 * Endpoint: /temas/:id/pasos?grupo_edad_id=...
 * Auth: No requerido
 */
export function obtenerPasos(idTema: string, idGrupoEdad?: string) {
  const busqueda = new URLSearchParams();
  if (idGrupoEdad) busqueda.set("grupo_edad_id", idGrupoEdad);
  const query = busqueda.toString();
  return peticion<Paso[]>(
    `/temas/${idTema}/pasos${query ? `?${query}` : ""}`,
    { autenticar: false }
  );
}

/**
 * Obtiene las actividades prácticas asociadas a un tema, filtradas opcionalmente por grupo de edad.
 *
 * HTTP Verb: GET
 * Endpoint: /temas/:id/actividades?grupo_edad_id=...
 * Auth: No requerido
 */
export function obtenerActividades(idTema: string, idGrupoEdad?: string) {
  const busqueda = new URLSearchParams();
  if (idGrupoEdad) busqueda.set("grupo_edad_id", idGrupoEdad);
  const query = busqueda.toString();
  return peticion<Actividad[]>(
    `/temas/${idTema}/actividades${query ? `?${query}` : ""}`,
    { autenticar: false }
  );
}