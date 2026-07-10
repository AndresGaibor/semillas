import type { UsuarioRepository } from "../usuario.repository";

type Dependencias = {
  usuarios: UsuarioRepository;
};

type EntradaActualizarPerfil = {
  apodo?: string;
  grupo_edad_id?: string | null;
  url_avatar?: string | null;
  prefiere_audio?: boolean;
  tamano_texto_preferido?: "small" | "medium" | "large";
};

export function crearCasoActualizarPerfil({ usuarios }: Dependencias) {
  return async function actualizarPerfil(usuarioId: string, entrada: EntradaActualizarPerfil) {
    return usuarios.actualizarPerfilPorUsuarioId(usuarioId, {
      apodo: entrada.apodo,
      grupoEdadId: entrada.grupo_edad_id,
      urlAvatar: entrada.url_avatar,
      prefiereAudio: entrada.prefiere_audio,
      tamanoTextoPreferido: entrada.tamano_texto_preferido
    });
  };
}
