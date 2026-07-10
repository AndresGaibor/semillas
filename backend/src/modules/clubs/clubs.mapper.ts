import type { ClubsRepository } from "./clubs.repository";

export function serializarClub(fila: { id: string; nombre: string; descripcion: string | null; codigoInvitacion: string; creadoPor: string; activo: boolean; creadoEn: Date }) {
  return { id: fila.id, nombre: fila.nombre, descripcion: fila.descripcion, codigo_invitacion: fila.codigoInvitacion, creado_por: fila.creadoPor, activo: fila.activo, creado_en: fila.creadoEn.toISOString() };
}

export function serializarMiembroClub(fila: { clubId: string; usuarioId: string; rolMiembro: string; unidoEn: Date }) {
  return { club_id: fila.clubId, usuario_id: fila.usuarioId, rol_miembro: fila.rolMiembro, unido_en: fila.unidoEn.toISOString() };
}

export function serializarRetoClub(fila: { id: string; clubId: string | null; nombre: string; descripcion: string | null; codigoMetrica: string; valorObjetivo: number; xpReto: number; fechaInicio: Date; fechaFin: Date; creadoPor: string | null; creadoEn: Date }) {
  return { id: fila.id, club_id: fila.clubId, nombre: fila.nombre, descripcion: fila.descripcion, codigo_metrica: fila.codigoMetrica, valor_objetivo: fila.valorObjetivo, xp_reto: fila.xpReto, fecha_inicio: fila.fechaInicio.toISOString(), fecha_fin: fila.fechaFin.toISOString(), creado_por: fila.creadoPor, creado_en: fila.creadoEn.toISOString() };
}
