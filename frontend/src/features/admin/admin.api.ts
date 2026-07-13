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
  portada_recurso_id?: string | null;
};

export type ActualizarTemaSolicitud = {
  senda_id?: string;
  titulo?: string;
  slug?: string;
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
  recurso_id?: string | null;
  recurso_audio_id?: string | null;
  datos_extra?: Record<string, unknown>;
  preguntas?: Array<{ pregunta: string; orden: number }>;
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
  limite_tiempo_seg?: number | null;
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


export type CompletitudTema = {
  porcentaje: number;
  listo_para_revision: boolean;
  criterios: Array<{ codigo: string; etiqueta: string; completo: boolean; detalle?: string }>;
  estadisticas: {
    grupos_edad: number;
    pasos_creados: number;
    contenidos_creados: number;
    contenidos_esperados: number;
    actividades: number;
  };
};

export type TemaListadoAdmin = Tema & { completitud: CompletitudTema };

export type ListadoTemasAdmin = {
  temas: TemaListadoAdmin[];
  total: number;
  limit: number;
  offset: number;
};

export type ResumenAdminDetallado = {
  metricas: {
    temas: number;
    publicados: number;
    usuarios_activos: number;
    actividades: number;
    clubes_activos: number;
    pendientes_revision: number;
  };
  estados: Record<string, number>;
  temas_recientes: Array<{ id: string; titulo: string; estado: string; actualizado_en: string | null; senda: string; autor: string }>;
  revisiones: Array<{ id: string; tema_id: string; titulo: string; senda: string; estado: string; notas: string | null; creado_en: string; enviado_por: string }>;
  actividad_reciente: Array<{ id: string; accion: string; tipo_entidad: string; entidad_id: string | null; creado_en: string; actor: string }>;
  publicaciones_semana: Array<{ fecha: string; etiqueta: string; total: number }>;
};

export type EstudioTemaAdmin = {
  tema: Tema;
  pasos: Paso[];
  actividades: ActividadAdmin[];
  completitud: CompletitudTema;
  revisiones: Array<{ id: string; estado: string; notas: string | null; creado_en: string; revisado_en: string | null }>;
};

export function obtenerResumenAdminDetallado() {
  return peticion<ResumenAdminDetallado>("/administracion/resumen/detallado");
}

export function obtenerTemasAdminPaginados(params: {
  q?: string;
  estado?: string;
  senda_id?: string;
  grupo_edad_id?: string;
  limit?: number;
  offset?: number;
}) {
  const busqueda = new URLSearchParams();
  if (params.q) busqueda.set("q", params.q);
  if (params.estado && params.estado !== "todos") busqueda.set("estado", params.estado);
  if (params.senda_id) busqueda.set("senda_id", params.senda_id);
  if (params.grupo_edad_id) busqueda.set("grupo_edad_id", params.grupo_edad_id);
  busqueda.set("limit", String(params.limit ?? 20));
  busqueda.set("offset", String(params.offset ?? 0));
  return peticion<ListadoTemasAdmin>(`/administracion/temas-listado?${busqueda.toString()}`);
}

export function obtenerEstudioTemaAdmin(idTema: string) {
  return peticion<EstudioTemaAdmin>(`/administracion/temas/${idTema}/estudio`);
}

export function enviarTemaRevision(idTema: string, notas?: string) {
  return peticion(`/administracion/temas/${idTema}/enviar-revision`, {
    metodo: "POST",
    cuerpo: { notas },
  });
}

export function resolverRevisionTema(idTema: string, estado: "aprobado" | "cambios_solicitados" | "rechazado", notas?: string) {
  return peticion(`/administracion/temas/${idTema}/resolver-revision`, {
    metodo: "POST",
    cuerpo: { estado, notas },
  });
}

export function duplicarActividad(idActividad: string) {
  return peticion<ActividadAdmin>(`/administracion/actividades/${idActividad}/duplicar`, { metodo: "POST" });
}

export function reordenarActividades(idTema: string, actividadIds: string[]) {
  return peticion<{ actividades: ActividadAdmin[] }>(`/administracion/temas/${idTema}/actividades/reordenar`, {
    metodo: "POST",
    cuerpo: { actividad_ids: actividadIds },
  });
}

export type SendaAdmin = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  color_hex: string;
  nombre_icono: string | null;
  imagen_recurso_id: string | null;
  orden: number;
  activo: boolean;
  creado_en: string;
};

export type CrearSendaSolicitud = {
  codigo: string;
  nombre: string;
  descripcion?: string;
  color_hex: string;
  nombre_icono?: string;
  imagen_recurso_id: string | null;
  orden: number;
  activo?: boolean;
};

export function obtenerSendasAdmin() {
  return peticion<SendaAdmin[]>("/administracion/sendas");
}

export function obtenerSendaAdmin(id: string) {
  return peticion<SendaAdmin>(`/administracion/sendas/${id}`);
}

export function crearSendaAdmin(datos: CrearSendaSolicitud) {
  return peticion<SendaAdmin>("/administracion/sendas", {
    metodo: "POST",
    cuerpo: datos,
  });
}

export type ActualizarSendaSolicitud = Partial<CrearSendaSolicitud>;

export function actualizarSendaAdmin(id: string, datos: ActualizarSendaSolicitud) {
  return peticion<SendaAdmin>(`/administracion/sendas/${id}`, {
    metodo: "PATCH",
    cuerpo: datos,
  });
}
