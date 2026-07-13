import { peticion } from "../../shared/api/api";

export type FiltrosClubesAdmin = {
  q?: string;
  estado: "activo" | "archivado" | "todos";
  limit: number;
  offset: number;
};

export type ClubAdminResumen = {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  creado_en: string;
  miembros: number;
  retos_abiertos: number;
  lider: { usuario_id: string; apodo: string } | null;
};

export type ListadoClubesAdmin = {
  clubes: ClubAdminResumen[];
  meta: { total: number; limit: number; offset: number };
};

export type DetalleClubAdmin = {
  club: ClubAdminDetalle;
  miembros: MiembroClubAdmin[];
  retos: RetoClubAdmin[];
};

export type ClubAdminDetalle = {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  creado_en: string;
};

export type MiembroClubAdmin = {
  usuario_id: string;
  apodo: string;
  rol_miembro: string | null;
  unido_en: string | null;
};

export type RetoClubAdmin = {
  id: string;
  nombre: string;
  descripcion: string | null;
  codigo_metrica: "xp_grupal" | "actividades_completadas" | "temas_completados";
  valor_objetivo: number;
  xp_reto: number;
  fecha_inicio: string;
  fecha_fin: string;
};

export type CrearRetoClubAdminSolicitud = {
  nombre: string;
  descripcion?: string;
  codigo_metrica: "xp_grupal" | "actividades_completadas" | "temas_completados";
  valor_objetivo: number;
  xp_reto?: number;
  fecha_inicio: string;
  fecha_fin: string;
};

export function listarClubesAdmin(filtros: FiltrosClubesAdmin) {
  const parametros = new URLSearchParams({
    estado: filtros.estado,
    limit: String(filtros.limit),
    offset: String(filtros.offset),
  });
  if (filtros.q) parametros.set("q", filtros.q);
  const ruta = `/administracion/clubes?${parametros}`;
  return peticion<ListadoClubesAdmin>(ruta);
}

export function obtenerClubAdmin(idClub: string) {
  const ruta = `/administracion/clubes/${idClub}`;
  return peticion<DetalleClubAdmin>(ruta);
}

export function archivarClubAdmin(idClub: string) {
  return peticion<{ archived: true }>(`/administracion/clubes/${idClub}/archivar`, { metodo: "POST" });
}

export function reactivarClubAdmin(idClub: string) {
  return peticion<{ reactivated: true }>(`/administracion/clubes/${idClub}/reactivar`, { metodo: "POST" });
}

export function expulsarMiembroClubAdmin(idClub: string, usuarioId: string) {
  return peticion<{ removed: true }>(`/administracion/clubes/${idClub}/miembros/${usuarioId}`, { metodo: "DELETE" });
}

export function transferirLiderazgoClubAdmin(idClub: string, usuarioId: string) {
  return peticion<{ transferred: true; usuario_id: string }>(`/administracion/clubes/${idClub}/transferir-liderazgo`, {
    metodo: "POST",
    cuerpo: { usuario_id: usuarioId },
  });
}

export function crearRetoClubAdmin(idClub: string, datos: CrearRetoClubAdminSolicitud) {
  return peticion<{ id: string }>(`/administracion/clubes/${idClub}/retos`, {
    metodo: "POST",
    cuerpo: datos,
  });
}

export function cerrarRetoClubAdmin(idClub: string, retoId: string, motivo: string) {
  return peticion<{ closed: true }>(`/administracion/clubes/${idClub}/retos/${retoId}/cerrar`, {
    metodo: "POST",
    cuerpo: { motivo },
  });
}
