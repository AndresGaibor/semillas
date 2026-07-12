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
  nombre_visible: string;
  correo: string | null;
  activo: boolean;
  rol: "administrador" | "usuario" | "invitado" | "padre";
  proveedor: string;
  creado_en: string;
  actualizado_en: string;
  ultimo_login_en: string | null;
  perfil: {
    id: string;
    apodo: string;
    avatar_url: string | null;
    clave_avatar: string | null;
    grupo_edad_id: string | null;
    prefiere_audio: boolean;
    tamano_texto_preferido: string;
    nivel_actual: number;
    nivel_nombre: string;
    xp_acumulada: number;
    temas_completados: number;
    actividades_completadas: number;
    logros: number;
    grupo_edad: {
      id: string;
      codigo: string;
      nombre: string;
      edad_minima: number;
      edad_maxima: number;
    } | null;
  } | null;
  clubes: Array<{ id: string; nombre: string; rol: string; activo: boolean }>;
};

export type ListadoUsuariosAdmin = {
  usuarios: UsuarioAdmin[];
  total: number;
  limit: number;
  offset: number;
};

export function obtenerUsuariosAdmin(params: {
  q?: string;
  rol?: string;
  activo?: boolean;
  limit?: number;
  offset?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.rol) query.set("rol", params.rol);
  if (params.activo !== undefined) query.set("activo", String(params.activo));
  query.set("limit", String(params.limit ?? 20));
  query.set("offset", String(params.offset ?? 0));
  return peticion<ListadoUsuariosAdmin>(`/administracion/usuarios?${query.toString()}`);
}

export function obtenerUsuarioAdmin(id: string) {
  return peticion<UsuarioAdmin>(`/administracion/usuarios/${id}`);
}

export function actualizarUsuarioAdmin(
  id: string,
  datos: Partial<Pick<UsuarioAdmin, "nombre_visible" | "rol" | "activo">>,
) {
  return peticion<UsuarioAdmin>(`/administracion/usuarios/${id}`, {
    metodo: "PATCH",
    cuerpo: datos,
  });
}

export function desactivarUsuarioAdmin(id: string) {
  return peticion<{ desactivado: boolean }>(`/administracion/usuarios/${id}`, {
    metodo: "DELETE",
  });
}

export function ajustarXpUsuarioAdmin(id: string, datos: { cantidad: number; motivo: string }) {
  return peticion<{ movimiento_id: string; usuario_id: string; cantidad: number; xp_total: number }>(
    `/administracion/usuarios/${id}/ajustar-xp`,
    { metodo: "POST", cuerpo: datos },
  );
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
  nombre: string;
  codigo: string;
  descripcion: string | null;
  color_hex: string;
  nombre_icono: string | null;
  orden: number;
  activo: boolean;
  creado_en: string;
  temas: number;
  publicados: number;
};

export type GuardarSendaAdmin = {
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  color_hex: string;
  nombre_icono?: string | null;
  activo: boolean;
};

export function obtenerSendasAdmin() {
  return peticion<SendaAdmin[]>("/administracion/sendas");
}

export function crearSendaAdmin(datos: GuardarSendaAdmin) {
  return peticion<SendaAdmin>("/administracion/sendas", { metodo: "POST", cuerpo: datos });
}

export function actualizarSendaAdmin(id: string, datos: Partial<GuardarSendaAdmin>) {
  return peticion<SendaAdmin>(`/administracion/sendas/${id}`, { metodo: "PATCH", cuerpo: datos });
}

export function reordenarSendasAdmin(ids: string[]) {
  return peticion<SendaAdmin[]>("/administracion/sendas/reordenar", {
    metodo: "POST",
    cuerpo: { senda_ids: ids },
  });
}

export function eliminarSendaAdmin(id: string) {
  return peticion<{ eliminada: boolean }>(`/administracion/sendas/${id}`, { metodo: "DELETE" });
}

export type ClubAdminResumen = {
  id: string;
  nombre: string;
  descripcion: string | null;
  codigo_invitacion: string;
  creado_por: string;
  activo: boolean;
  creado_en: string;
  creador: string;
  miembros: number;
};

export type ClubAdminDetalle = {
  club: ClubAdminResumen;
  miembros: Array<{
    usuarioId: string;
    rol: string;
    unidoEn: string;
    nombre: string | null;
    correo: string | null;
    activo: boolean;
  }>;
  retos: Array<{
    id: string;
    nombre: string;
    descripcion: string | null;
    codigoMetrica: string;
    valorObjetivo: number;
    xpReto: number;
    fechaInicio: string;
    fechaFin: string;
  }>;
};

export function obtenerClubesAdmin(params: { q?: string; activo?: string; limit?: number; offset?: number }) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.activo && params.activo !== "todos") query.set("activo", params.activo);
  query.set("limit", String(params.limit ?? 20));
  query.set("offset", String(params.offset ?? 0));
  return peticion<{ clubes: ClubAdminResumen[]; total: number; limit: number; offset: number }>(
    `/administracion/clubes?${query.toString()}`,
  );
}

export function obtenerClubAdmin(id: string) {
  return peticion<ClubAdminDetalle>(`/administracion/clubes/${id}`);
}

export function moderarClubAdmin(id: string, datos: { activo?: boolean; nombre?: string; descripcion?: string | null }) {
  return peticion<ClubAdminResumen>(`/administracion/clubes/${id}`, { metodo: "PATCH", cuerpo: datos });
}

export type ReporteAdmin = {
  periodo: { desde: string; hasta: string };
  metricas: {
    usuarios: number;
    usuarios_activos: number;
    temas: number;
    temas_publicados: number;
    actividades: number;
    clubes: number;
    clubes_activos: number;
    xp_otorgada_periodo: number;
    temas_en_progreso: number;
    temas_completados: number;
    progreso_promedio: number;
  };
  actividad_diaria: Array<{ fecha: string; total: number }>;
  temas_por_senda: Array<{ nombre: string; total: number; publicados: number }>;
};

export type AuditoriaAdminItem = {
  id: string;
  tipo_entidad: string;
  entidad_id: string | null;
  accion: string;
  datos_antes: unknown;
  datos_despues: unknown;
  actor_usuario_id: string | null;
  direccion_ip: string | null;
  agente_usuario: string | null;
  creado_en: string;
  actor: string;
};

export function obtenerReportesAdmin(desde: string, hasta: string) {
  const query = new URLSearchParams({ desde, hasta });
  return peticion<ReporteAdmin>(`/administracion/reportes?${query.toString()}`);
}

export function obtenerAuditoriaAdmin(params: { q?: string; entidad?: string; limit?: number; offset?: number }) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.entidad) query.set("entidad", params.entidad);
  query.set("limit", String(params.limit ?? 30));
  query.set("offset", String(params.offset ?? 0));
  return peticion<{ items: AuditoriaAdminItem[]; total: number; limit: number; offset: number }>(
    `/administracion/auditoria?${query.toString()}`,
  );
}

export type AjustePlataformaAdmin = {
  clave: string;
  categoria: string;
  valor: unknown;
  descripcion: string | null;
  actualizado_por: string | null;
  actualizado_en: string;
};

export function obtenerAjustesAdmin() {
  return peticion<AjustePlataformaAdmin[]>("/administracion/ajustes");
}

export function guardarAjusteAdmin(clave: string, valor: unknown, descripcion?: string | null) {
  return peticion<AjustePlataformaAdmin>(`/administracion/ajustes/${encodeURIComponent(clave)}`, {
    metodo: "PUT",
    cuerpo: { valor, descripcion },
  });
}

export type NivelAdmin = {
  id: string;
  nombre: string;
  numero_nivel: number;
  xp_minima: number;
  color_insignia: string | null;
};

export type LogroAdmin = {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string | null;
  url_icono: string | null;
  bono_xp: number;
  codigo_criterio: string;
  valor_criterio: number | null;
  activo: boolean;
  creado_en: string;
};

export type ConfiguracionGamificacionAdmin = {
  niveles: NivelAdmin[];
  logros: LogroAdmin[];
  estadisticas: { xpOtorgada: number; usuariosConXp: number };
};

export function obtenerConfiguracionGamificacionAdmin() {
  return peticion<ConfiguracionGamificacionAdmin>("/administracion/gamificacion");
}

export function crearNivelAdmin(datos: Omit<NivelAdmin, "id">) {
  return peticion<NivelAdmin>("/administracion/gamificacion/niveles", { metodo: "POST", cuerpo: datos });
}

export function actualizarNivelAdmin(id: string, datos: Partial<Omit<NivelAdmin, "id">>) {
  return peticion<NivelAdmin>(`/administracion/gamificacion/niveles/${id}`, { metodo: "PATCH", cuerpo: datos });
}

export function crearLogroAdmin(datos: Omit<LogroAdmin, "id" | "creado_en">) {
  return peticion<LogroAdmin>("/administracion/gamificacion/logros", { metodo: "POST", cuerpo: datos });
}

export function actualizarLogroAdmin(id: string, datos: Partial<Omit<LogroAdmin, "id" | "creado_en">>) {
  return peticion<LogroAdmin>(`/administracion/gamificacion/logros/${id}`, { metodo: "PATCH", cuerpo: datos });
}
