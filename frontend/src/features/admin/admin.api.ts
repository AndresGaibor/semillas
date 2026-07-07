import { peticion } from "../../shared/api/api";
import type { Actividad, Paso, Tema } from "../../shared/api/api";

export type CrearTemaSolicitud = {
  senda_id: string;
  titulo: string;
  slug: string;
  objetivo: string;
  resumen: string;
  version_biblica_id: string;
  minutos_estimados: number;
  xp_recompensa: number;
  grupo_edad_ids: string[];
};

export type ActualizarTemaSolicitud = {
  titulo?: string;
  objetivo?: string;
  resumen?: string;
  minutos_estimados?: number;
  xp_recompensa?: number;
  version_biblica_id?: string;
  grupo_edad_ids?: string[];
};

export type GuardarParlanteSolicitud = {
  tipo_paso_id: string;
  grupo_edad_id: string;
  titulo: string;
  cuerpo: string;
  instruccion_corta?: string;
};

export type CrearActividadSolicitud = {
  tema_id: string;
  paso_id?: string | null;
  grupo_edad_id: string;
  tipo_actividad_id: string;
  titulo: string;
  consigna: string;
  retroalimentacion?: string;
  orden: number;
  xp_recompensa: number;
  difficulty: "facil" | "normal" | "dificil";
  obligatorio: boolean;
  configuracion?: Record<string, unknown>;
  opciones: Array<{
    etiqueta: string;
    texto: string;
    correcta: boolean;
    orden: number;
    retroalimentacion?: string;
  }>;
};

export function obtenerResumenAdmin() {
  return peticion<{
    temas: number;
    publicados: number;
    usuarios: number;
    actividades: number;
  }>("/administracion/resumen");
}

export function obtenerTemaAdmin(idTema: string) {
  return peticion<Tema>(`/administracion/temas/${idTema}`);
}

export function obtenerPasosAdmin(idTema: string) {
  return peticion<Paso[]>(`/administracion/temas/${idTema}/pasos`);
}

export function crearTema(datos: CrearTemaSolicitud) {
  return peticion<Tema>("/administracion/temas", {
    metodo: "POST",
    cuerpo: datos,
  });
}

export function actualizarTema(
  idTema: string,
  datos: ActualizarTemaSolicitud
) {
  return peticion<Tema>(`/administracion/temas/${idTema}`, {
    metodo: "PATCH",
    cuerpo: datos,
  });
}

export function guardarParlante(
  idTema: string,
  datos: GuardarParlanteSolicitud
) {
  return peticion(`/administracion/temas/${idTema}/pasos`, {
    metodo: "POST",
    cuerpo: datos,
  });
}

export function publicarTema(idTema: string) {
  return peticion<Tema>(`/administracion/temas/${idTema}/publicar`, {
    metodo: "POST",
  });
}

export function despublicarTema(idTema: string) {
  return peticion<Tema>(`/administracion/temas/${idTema}/borrador`, {
    metodo: "POST",
  });
}

export function crearActividad(datos: CrearActividadSolicitud) {
  return peticion("/administracion/actividades", {
    metodo: "POST",
    cuerpo: datos,
  });
}

export function actualizarActividad(
  idActividad: string,
  datos: Partial<CrearActividadSolicitud>
) {
  return peticion(`/administracion/actividades/${idActividad}`, {
    metodo: "PATCH",
    cuerpo: datos,
  });
}

export function eliminarActividad(idActividad: string) {
  return peticion(`/administracion/actividades/${idActividad}`, {
    metodo: "DELETE",
  });
}
