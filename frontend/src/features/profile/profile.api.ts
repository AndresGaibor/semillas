import { apiRequest } from "../../shared/api/http";

export type MeResponse = {
  user: {
    id: string;
    role: string;
    displayName: string;
    email: string | null;
  };
  profile: {
    id: string;
    user_id: string;
    nickname: string | null;
    age_group_id: string | null;
    avatar_url: string | null;
    preferred_audio: boolean;
    preferred_text_size: string;
  };
};

export type UpdateProfileRequest = {
  nickname?: string;
  ageGroupId?: string | null;
  avatarUrl?: string | null;
  preferredAudio?: boolean;
  preferredTextSize?: "small" | "medium" | "large";
};

export function getMe() {
  return apiRequest<MeResponse>("/me");
}

export function updateProfile(payload: UpdateProfileRequest) {
  return apiRequest("/me/profile", {
    method: "PATCH",
    body: payload
  });
}
