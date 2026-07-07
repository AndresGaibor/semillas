import { apiRequest } from "../../shared/api/http";
import {
  construirAltaInvitado,
  type AltaInvitadoInput,
  type AutenticacionApi,
  type PerfilApi,
  type UsuarioApi
} from "../../shared/api/contrato";

export type SesionInvitadoRespuesta = {
  usuario: UsuarioApi;
  perfil: PerfilApi;
  autenticacion: AutenticacionApi;
};

export function createGuestSession(payload: AltaInvitadoInput) {
  return apiRequest<SesionInvitadoRespuesta>("/autenticacion/invitado", {
    method: "POST",
    body: construirAltaInvitado(payload),
    auth: false
  });
}

export type ConfiguracionDevRespuesta = {
  usuario: UsuarioApi;
  perfil: PerfilApi;
  mensaje: string;
};

export function setupDevAdmin() {
  return apiRequest<ConfiguracionDevRespuesta>("/autenticacion/configuracion-dev", {
    method: "POST",
    auth: false
  });
}
