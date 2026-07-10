import type { AdminUser, crearAdminRepository } from "../admin.repository";

type RepositorioAdmin = ReturnType<typeof crearAdminRepository>;

export function crearCasosUsoTemas(repositorio: RepositorioAdmin) {
  return {
    listar: (status?: string) => repositorio.listarTemas(status),
    obtener: (temaId: string) => repositorio.obtenerTema(temaId),
    crear: (body: Parameters<RepositorioAdmin["crearTema"]>[0], userId: string) => repositorio.crearTema(body, userId),
    actualizar: (temaId: string, body: Parameters<RepositorioAdmin["actualizarTema"]>[1]) => repositorio.actualizarTema(temaId, body),
    eliminar: (temaId: string) => repositorio.borrarTema(temaId),
    crearPaso: (temaId: string, body: Parameters<RepositorioAdmin["crearPasoTema"]>[1]) => repositorio.crearPasoTema(temaId, body),
    listarPasos: (temaId: string) => repositorio.listarPasosTema(temaId),
    eliminarPaso: (temaId: string, tipoPasoId: string) => repositorio.borrarPasoTema(temaId, tipoPasoId),
    publicar: (temaId: string, userId: string) => repositorio.publicarTema(temaId, userId),
    guardarBorrador: (temaId: string) => repositorio.guardarBorradorTema(temaId),
    archivar: (temaId: string) => repositorio.archivarTema(temaId),
    duplicar: (temaId: string, user: AdminUser) => repositorio.duplicarTema(temaId, user)
  };
}
