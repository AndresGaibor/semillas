import { apiRequest } from "../../shared/api/http";
import type { Theme, ThemeStep } from "../themes/themes.api";

export type CreateThemeRequest = {
  senda_id: string;
  titulo: string;
  slug: string;
  objetivo: string;
  resumen: string;
  version_biblica_id: string;
  minutos_estimados: number;
  xp_recompensa: number;
  grupo_edad_ids: string[];
};

export type UpdateThemeRequest = {
  titulo?: string;
  objetivo?: string;
  resumen?: string;
  minutos_estimados?: number;
  xp_recompensa?: number;
  version_biblica_id?: string;
  grupo_edad_ids?: string[];
};

export type UpsertStepContentRequest = {
  tipo_paso_id: string;
  grupo_edad_id: string;
  titulo: string;
  cuerpo: string;
  instruccion_corta?: string;
};

export type CreateActivityRequest = {
  tema_id: string;
  paso_id?: string | null;
  grupo_edad_id: string;
  tipo_actividad_id: string;
  titulo: string;
  consigna: string;
  retroalimentacion?: string;
  orden: number;
  xp_recompensa: number;
  difficulty: "facil" | "normal" | "dificil";
  obligatorio: boolean;
  configuracion?: Record<string, unknown>;
  opciones: Array<{
    etiqueta: string;
    texto: string;
    correcta: boolean;
    orden: number;
    retroalimentacion?: string;
  }>;
};

export type UpdateActivityRequest = Partial<CreateActivityRequest>;

export function getAdminDashboard() {
  return apiRequest<{
    temas: number;
    publicados: number;
    usuarios: number;
    actividades: number;
  }>("/administracion/resumen");
}

export function getAdminTheme(themeId: string) {
  return apiRequest<Theme>(`/administracion/temas/${themeId}`);
}

export function getAdminThemeSteps(themeId: string) {
  return apiRequest<ThemeStep[]>(`/administracion/temas/${themeId}/pasos`);
}

export function createTheme(payload: CreateThemeRequest) {
  return apiRequest<Theme>("/administracion/temas", {
    method: "POST",
    body: payload
  });
}

export function updateTheme(themeId: string, payload: UpdateThemeRequest) {
  return apiRequest<Theme>(`/administracion/temas/${themeId}`, {
    method: "PATCH",
    body: payload
  });
}

export function upsertThemeStep(themeId: string, payload: UpsertStepContentRequest) {
  return apiRequest(`/administracion/temas/${themeId}/pasos`, {
    method: "POST",
    body: payload
  });
}

export function publishTheme(themeId: string) {
  return apiRequest<Theme>(`/administracion/temas/${themeId}/publicar`, {
    method: "POST"
  });
}

export function unpublishTheme(themeId: string) {
  return apiRequest<Theme>(`/administracion/temas/${themeId}/borrador`, {
    method: "POST"
  });
}

export function createActivity(payload: CreateActivityRequest) {
  return apiRequest("/administracion/actividades", {
    method: "POST",
    body: payload
  });
}

export function updateActivity(activityId: string, payload: UpdateActivityRequest) {
  return apiRequest(`/administracion/actividades/${activityId}`, {
    method: "PATCH",
    body: payload
  });
}

export function deleteActivity(activityId: string) {
  return apiRequest(`/administracion/actividades/${activityId}`, {
    method: "DELETE"
  });
}
