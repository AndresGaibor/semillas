import { apiRequest } from "../../shared/api/http";

export type GamificationMe = {
  level: {
    user_id: string;
    xp_total: number;
    level_number: number;
    level_name: string;
  } | null;
  achievements: Array<unknown>;
};

export function getMyGamification() {
  return apiRequest<GamificationMe>("/gamification/me");
}
