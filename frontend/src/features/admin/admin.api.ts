import { apiRequest } from "../../shared/api/http";
import type { Theme, ThemeStep, Activity } from "../themes/themes.api";

export type CreateThemeRequest = {
  pathId: string;
  title: string;
  slug: string;
  objective: string;
  summary: string;
  bibleVersionId: string;
  estimatedMinutes: number;
  xpReward: number;
  ageGroupIds: string[];
};

export type UpdateThemeRequest = {
  title?: string;
  objective?: string;
  summary?: string;
  estimatedMinutes?: number;
  xpReward?: number;
  bibleVersionId?: string;
  ageGroupIds?: string[];
};

export type UpsertStepContentRequest = {
  stepTypeId: string;
  ageGroupId: string;
  title: string;
  body: string;
  shortInstruction?: string;
};

export type CreateActivityRequest = {
  themeId: string;
  stepId: string;
  ageGroupId: string;
  activityTypeId: string;
  title: string;
  prompt: string;
  feedback?: string;
  sortOrder: number;
  xpReward: number;
  difficulty: "easy" | "normal" | "hard";
  config?: Record<string, unknown>;
  options: Array<{
    label: string;
    text: string;
    isCorrect: boolean;
    sortOrder: number;
    feedback?: string;
  }>;
};

export type UpdateActivityRequest = Partial<CreateActivityRequest>;

export function getAdminDashboard() {
  return apiRequest<{
    themes: number;
    published: number;
    users: number;
    activities: number;
  }>("/admin/dashboard");
}

export function getAdminTheme(themeId: string) {
  return apiRequest<Theme>(`/admin/themes/${themeId}`);
}

export function getAdminThemeSteps(themeId: string) {
  return apiRequest<ThemeStep[]>(`/admin/themes/${themeId}/steps`);
}

export function createTheme(payload: CreateThemeRequest) {
  return apiRequest<Theme>("/admin/themes", {
    method: "POST",
    body: payload
  });
}

export function updateTheme(themeId: string, payload: UpdateThemeRequest) {
  return apiRequest<Theme>(`/admin/themes/${themeId}`, {
    method: "PATCH",
    body: payload
  });
}

export function upsertThemeStep(themeId: string, payload: UpsertStepContentRequest) {
  return apiRequest(`/admin/themes/${themeId}/steps`, {
    method: "POST",
    body: payload
  });
}

export function publishTheme(themeId: string) {
  return apiRequest<Theme>(`/admin/themes/${themeId}/publish`, {
    method: "POST"
  });
}

export function unpublishTheme(themeId: string) {
  return apiRequest<Theme>(`/admin/themes/${themeId}/draft`, {
    method: "POST"
  });
}

export function createActivity(payload: CreateActivityRequest) {
  return apiRequest("/admin/activities", {
    method: "POST",
    body: payload
  });
}

export function updateActivity(activityId: string, payload: UpdateActivityRequest) {
  return apiRequest(`/admin/activities/${activityId}`, {
    method: "PATCH",
    body: payload
  });
}

export function deleteActivity(activityId: string) {
  return apiRequest(`/admin/activities/${activityId}`, {
    method: "DELETE"
  });
}
