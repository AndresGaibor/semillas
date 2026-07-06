import { apiRequest } from "../../shared/api/http";

export type AgeGroup = {
  id: string;
  code: string;
  name: string;
  min_age: number;
  max_age: number;
  description: string | null;
  sort_order: number;
};

export type BibleVersion = {
  id: string;
  code: string;
  name: string;
  is_public_domain: boolean;
};

export type CrecerStepType = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  color_hex: string | null;
};

export type ActivityType = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_game: boolean;
};

export function getAgeGroups() {
  return apiRequest<AgeGroup[]>("/catalog/age-groups", {
    auth: false
  });
}

export function getBibleVersions() {
  return apiRequest<BibleVersion[]>("/catalog/bible-versions", {
    auth: false
  });
}

export function getCrecerSteps() {
  return apiRequest<CrecerStepType[]>("/catalog/crecer-steps", {
    auth: false
  });
}

export function getActivityTypes() {
  return apiRequest<ActivityType[]>("/catalog/activity-types", {
    auth: false
  });
}
