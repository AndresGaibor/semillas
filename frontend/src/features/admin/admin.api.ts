import { peticion } from "../../shared/api/api";
import type { Paso, Tema } from "../../shared/api/api";

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
  portada_recurso_id?: string | null;
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
  dificultad: "facil" | "normal" | "dificil";
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

export function obtenerTemasAdmin(params?: { status?: string }) {
  const busqueda = new URLSearchParams();
  if (params?.status) busqueda.set("status", params.status);
  const query = busqueda.toString();
  return peticion<Tema[]>(`/administracion/temas${query ? `?${query}` : ""}`);
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

export function archivarTema(idTema: string) {
  return peticion<Tema>(`/administracion/temas/${idTema}/archivar`, {
    metodo: "POST",
  });
}

export function duplicarTema(idTema: string) {
  return peticion<Tema>(`/administracion/temas/${idTema}/duplicar`, {
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

export type UsuarioAdmin = {
  id: string;
  nombre_visible: string | null;
  correo: string | null;
  activo: boolean | null;
  rol: string;
  ultimo_login_en: string | null;
  perfil: {
    apodo: string | null;
    nivel_actual: number | null;
    xp_acumulada: number | null;
    avatar_url: string | null;
    grupo_edad_id: string | null;
  } | null;
};

export function obtenerUsuariosAdmin() {
  return peticion<{ usuarios: UsuarioAdmin[] }>("/administracion/usuarios");
}

export type ActividadAdmin = {
  id: string;
  tema_id: string;
  paso_id: string | null;
  grupo_edad_id: string;
  tipo_actividad_id: string;
  titulo: string;
  consigna: string;
  retroalimentacion: string | null;
  orden: number;
  xp_recompensa: number;
  limite_tiempo_seg: number | null;
  dificultad: string;
  obligatorio: boolean;
  configuracion: Record<string, unknown>;
  opciones: Array<{
    id: string;
    actividad_id: string;
    etiqueta: string | null;
    texto: string;
    correcta: boolean;
    orden: number;
    retroalimentacion: string | null;
  }>;
  estado: string;
  creado_en: string | null;
  actualizado_en: string | null;
  tipo_actividad: {
    id: string;
    codigo: string;
    nombre: string;
  } | null;
  tema: {
    id: string;
    titulo: string;
    slug: string;
    estado: string;
    senda?: {
      id: string;
      codigo: string;
      nombre: string;
      color_hex: string;
    };
  } | null;
  grupo_edad: {
    id: string;
    codigo: string;
    nombre: string;
  } | null;
};

export type ObtenerActividadesAdminParams = {
  tema_id?: string;
  tipo_actividad_id?: string;
  grupo_edad_id?: string;
  estado?: string;
  limit?: number;
  offset?: number;
};

export function obtenerActividadAdmin(idActividad: string) {
  return peticion<ActividadAdmin>(`/administracion/actividades/${idActividad}`);
}

export function obtenerActividadesAdmin(params?: ObtenerActividadesAdminParams) {
  const busqueda = new URLSearchParams();
  if (params?.tema_id) busqueda.set("tema_id", params.tema_id);
  if (params?.tipo_actividad_id) busqueda.set("tipo_actividad_id", params.tipo_actividad_id);
  if (params?.grupo_edad_id) busqueda.set("grupo_edad_id", params.grupo_edad_id);
  if (params?.estado) busqueda.set("estado", params.estado);
  if (params?.limit) busqueda.set("limit", String(params.limit));
  if (params?.offset) busqueda.set("offset", String(params.offset));
  const query = busqueda.toString();
  return peticion<{ actividades: ActividadAdmin[]; total: number }>(`/administracion/actividades${query ? `?${query}` : ""}`);
}
