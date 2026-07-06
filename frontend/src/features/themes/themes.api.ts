import { apiRequest } from "../../shared/api/http";

export type Theme = {
  id: string;
  path_id: string;
  title: string;
  slug: string;
  objective: string;
  summary: string | null;
  cover_media_id: string | null;
  status: string;
  bible_version_id?: string;
  xp_reward: number;
  estimated_minutes: number;
  content_version?: number;
  published_at: string | null;
};

export type ThemeStep = {
  id: string;
  theme_id: string;
  sort_order: number;
  step_type: {
    id: string;
    code: string;
    name: string;
    sort_order: number;
    color_hex?: string | null;
  };
  contents: Array<{
    id: string;
    age_group_id: string;
    title: string | null;
    body: string;
    short_instruction: string | null;
  }>;
};

export type Activity = {
  id: string;
  theme_id: string;
  step_id: string | null;
  title: string;
  prompt: string;
  feedback: string | null;
  xp_reward: number;
  config: unknown;
  options: Array<{
    id: string;
    label: string;
    text: string;
    is_correct: boolean;
    sort_order: number;
    feedback: string | null;
  }>;
};

export function getThemes(params?: { pathId?: string }) {
  const search = new URLSearchParams();

  if (params?.pathId) {
    search.set("pathId", params.pathId);
  }

  const query = search.toString();

  return apiRequest<Theme[]>(`/themes${query ? `?${query}` : ""}`, {
    auth: false
  });
}

export function getTheme(themeId: string) {
  return apiRequest<Theme>(`/themes/${themeId}`, {
    auth: false
  });
}

export function getThemeSteps(themeId: string, ageGroupId?: string) {
  const search = new URLSearchParams();

  if (ageGroupId) {
    search.set("ageGroupId", ageGroupId);
  }

  const query = search.toString();

  return apiRequest<ThemeStep[]>(
    `/themes/${themeId}/steps${query ? `?${query}` : ""}`,
    {
      auth: false
    }
  );
}

export function getThemeActivities(themeId: string, ageGroupId?: string) {
  const search = new URLSearchParams();

  if (ageGroupId) {
    search.set("ageGroupId", ageGroupId);
  }

  const query = search.toString();

  return apiRequest<Activity[]>(
    `/themes/${themeId}/activities${query ? `?${query}` : ""}`,
    {
      auth: false
    }
  );
}
