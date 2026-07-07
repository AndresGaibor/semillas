import { peticion } from "../../shared/api/api";
import type { Perfil, Usuario } from "../../shared/api/api";

export function obtenerMiPerfil() {
  return peticion<{ usuario: Usuario; perfil: Perfil }>("/perfil");
}

export function actualizarPerfil(datos: {
  apodo?: string;
  grupo_edad_id?: string | null;
  url_avatar?: string | null;
  prefiere_audio?: boolean;
  tamano_texto_preferido?: string;
}) {
  return peticion<Perfil>("/perfil/actualizar", {
    metodo: "PATCH",
    cuerpo: datos,
  });
}
