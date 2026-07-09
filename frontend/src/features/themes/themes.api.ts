import { peticion } from "../../shared/api/api";
import type { Actividad, Paso, Tema } from "../../shared/api/api";

export function obtenerTemas(params?: { senda_id?: string }) {
  const busqueda = new URLSearchParams();
  if (params?.senda_id) busqueda.set("senda_id", params.senda_id);
  const query = busqueda.toString();
  return peticion<Tema[]>(`/temas${query ? `?${query}` : ""}`, {
    autenticar: false,
  });
}

export function obtenerTema(idTema: string) {
  return peticion<Tema>(`/temas/${idTema}`, { autenticar: false });
}

export function obtenerUrlPortadaTema(idTema: string) {
  return peticion<{ url: string; expira_en_segundos: number }>(
    `/temas/${idTema}/portada`,
    { autenticar: false },
  );
}

export function obtenerPasos(idTema: string, idGrupoEdad?: string) {
  const busqueda = new URLSearchParams();
  if (idGrupoEdad) busqueda.set("grupo_edad_id", idGrupoEdad);
  const query = busqueda.toString();
  return peticion<Paso[]>(
    `/temas/${idTema}/pasos${query ? `?${query}` : ""}`,
    { autenticar: false },
  );
}

export function obtenerActividades(idTema: string, idGrupoEdad?: string) {
  const busqueda = new URLSearchParams();
  if (idGrupoEdad) busqueda.set("grupo_edad_id", idGrupoEdad);
  const query = busqueda.toString();
  return peticion<Actividad[]>(
    `/temas/${idTema}/actividades${query ? `?${query}` : ""}`,
    { autenticar: false },
  );
}
