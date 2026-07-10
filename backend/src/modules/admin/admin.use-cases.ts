import type { AdminUser, crearAdminRepository } from "./admin.repository";

type RepositorioAdmin = ReturnType<typeof crearAdminRepository>;

export function crearCasosUsoAdmin(repositorio: RepositorioAdmin) {
  return {
    obtenerResumen: () => repositorio.obtenerResumen(),
    listarActividades: (filtros: Parameters<RepositorioAdmin["listarActividades"]>[0]) => repositorio.listarActividades(filtros),
    listarTemas: (status?: string) => repositorio.listarTemas(status),
    obtenerTema: (temaId: string) => repositorio.obtenerTema(temaId),
    crearTema: (body: Parameters<RepositorioAdmin["crearTema"]>[0], userId: string) => repositorio.crearTema(body, userId),
    actualizarTema: (temaId: string, body: Parameters<RepositorioAdmin["actualizarTema"]>[1]) => repositorio.actualizarTema(temaId, body),
    borrarTema: (temaId: string) => repositorio.borrarTema(temaId),
    crearPasoTema: (temaId: string, body: Parameters<RepositorioAdmin["crearPasoTema"]>[1]) => repositorio.crearPasoTema(temaId, body),
    listarPasosTema: (temaId: string) => repositorio.listarPasosTema(temaId),
    borrarPasoTema: (temaId: string, tipoPasoId: string) => repositorio.borrarPasoTema(temaId, tipoPasoId),
    crearActividad: (body: Parameters<RepositorioAdmin["crearActividad"]>[0]) => repositorio.crearActividad(body),
    actualizarActividad: (actividadId: string, body: Parameters<RepositorioAdmin["actualizarActividad"]>[1]) => repositorio.actualizarActividad(actividadId, body),
    borrarActividad: (actividadId: string) => repositorio.borrarActividad(actividadId),
    publicarTema: (temaId: string, userId: string) => repositorio.publicarTema(temaId, userId),
    guardarBorradorTema: (temaId: string) => repositorio.guardarBorradorTema(temaId),
    archivarTema: (temaId: string) => repositorio.archivarTema(temaId),
    duplicarTema: (temaId: string, user: AdminUser) => repositorio.duplicarTema(temaId, user),
    listarUsuarios: (params: Parameters<RepositorioAdmin["listarUsuarios"]>[0]) => repositorio.listarUsuarios(params),
    obtenerUsuario: (usuarioId: string) => repositorio.obtenerUsuario(usuarioId),
    actualizarUsuario: (usuarioId: string, body: Parameters<RepositorioAdmin["actualizarUsuario"]>[1]) => repositorio.actualizarUsuario(usuarioId, body),
    eliminarUsuario: (usuarioId: string) => repositorio.eliminarUsuario(usuarioId)
  };
}
