import { peticion } from "../../shared/api/api";
import type { Autenticacion, Perfil, Usuario } from "../../shared/api/api";
import { iniciarSesionGoogle as iniciarSesionGoogleSupabase } from "../../shared/auth/supabase";

export type SesionInvitadoRespuesta = {
  usuario: Usuario;
  perfil: Perfil;
  autenticacion: Autenticacion;
};

export function crearSesionInvitado(datos: {
  apodo: string;
  grupo_edad_id?: string;
  url_avatar?: string;
}) {
  return peticion<SesionInvitadoRespuesta>("/autenticacion/invitado", {
    metodo: "POST",
    cuerpo: datos,
    autenticar: false,
  });
}

export type ConfiguracionDevRespuesta = {
  usuario: Usuario;
  perfil: Perfil;
  mensaje: string;
};

export function configurarDevAdmin() {
  return peticion<ConfiguracionDevRespuesta>(
    "/autenticacion/configuracion-dev",
    { metodo: "POST", autenticar: false }
  );
}

export function iniciarSesionGoogle(redirectTo: string) {
  return iniciarSesionGoogleSupabase(redirectTo);
}
