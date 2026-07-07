import { apiRequest } from "../../shared/api/http";
import { construirActualizacionPerfil, type ActualizacionPerfilInput, type PerfilApi, type UsuarioApi } from "../../shared/api/contrato";

export type MeResponse = {
  usuario: UsuarioApi;
  perfil: PerfilApi;
};

export function getMe() {
  return apiRequest<MeResponse>("/perfil");
}

export function updateProfile(payload: ActualizacionPerfilInput) {
  return apiRequest<PerfilApi>("/perfil/actualizar", {
    method: "PATCH",
    body: construirActualizacionPerfil(payload)
  });
}
