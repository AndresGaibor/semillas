import { apiRequest } from "../../shared/api/http";
import type { ActividadApi, TemaApi, TemaPasoApi } from "../../shared/api/contrato";

export type Theme = TemaApi;
export type ThemeStep = TemaPasoApi;
export type Activity = ActividadApi;

export function getThemes(params?: { senda_id?: string }) {
  const search = new URLSearchParams();

  if (params?.senda_id) {
    search.set("senda_id", params.senda_id);
  }

  const query = search.toString();

  return apiRequest<Theme[]>(`/temas${query ? `?${query}` : ""}`, {
    auth: false
  });
}

export function getTheme(themeId: string) {
  return apiRequest<Theme>(`/temas/${themeId}`, {
    auth: false
  });
}

export function getThemeSteps(themeId: string, grupo_edad_id?: string) {
  const search = new URLSearchParams();

  if (grupo_edad_id) {
    search.set("grupo_edad_id", grupo_edad_id);
  }

  const query = search.toString();

  return apiRequest<ThemeStep[]>(
    `/temas/${themeId}/pasos${query ? `?${query}` : ""}`,
    {
      auth: false
    }
  );
}

export function getThemeActivities(themeId: string, grupo_edad_id?: string) {
  const search = new URLSearchParams();

  if (grupo_edad_id) {
    search.set("grupo_edad_id", grupo_edad_id);
  }

  const query = search.toString();

  return apiRequest<Activity[]>(
    `/temas/${themeId}/actividades${query ? `?${query}` : ""}`,
    {
      auth: false
    }
  );
}
