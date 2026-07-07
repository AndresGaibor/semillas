import { apiRequest } from "../../shared/api/http";
import type {
  GrupoEdadApi,
  PasoCrecerCatalogoApi,
  TipoActividadCatalogoApi,
  VersionBiblicaApi
} from "../../shared/api/contrato";

export type GrupoEdad = GrupoEdadApi;
export type VersionBiblica = VersionBiblicaApi;
export type PasoCrecerCatalogo = PasoCrecerCatalogoApi;
export type TipoActividadCatalogo = TipoActividadCatalogoApi;

export function getAgeGroups() {
  return apiRequest<GrupoEdad[]>('/catalogo/grupos-etarios', {
    auth: false
  });
}

export function getBibleVersions() {
  return apiRequest<VersionBiblica[]>('/catalogo/versiones-biblicas', {
    auth: false
  });
}

export function getCrecerSteps() {
  return apiRequest<PasoCrecerCatalogo[]>('/catalogo/pasos-crecer', {
    auth: false
  });
}

export function getActivityTypes() {
  return apiRequest<TipoActividadCatalogo[]>('/catalogo/tipos-actividad', {
    auth: false
  });
}
