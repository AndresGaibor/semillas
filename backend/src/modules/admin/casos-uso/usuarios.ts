import type { crearAdminRepository } from "../admin.repository";

type RepositorioAdmin = ReturnType<typeof crearAdminRepository>;

export function crearCasosUsoUsuarios(repositorio: RepositorioAdmin) {
  return {
    listar: (params: Parameters<RepositorioAdmin["listarUsuarios"]>[0]) => repositorio.listarUsuarios(params),
    obtener: (usuarioId: string) => repositorio.obtenerUsuario(usuarioId),
    actualizar: (usuarioId: string, body: Parameters<RepositorioAdmin["actualizarUsuario"]>[1], actorId?: string) => repositorio.actualizarUsuario(usuarioId, body, actorId),
    eliminar: (usuarioId: string, actorId?: string) => repositorio.eliminarUsuario(usuarioId, actorId)
  };
}
