import { apiRequest } from "../../shared/api/http";

export type GuestLoginRequest = {
  nickname: string;
  ageGroupId?: string;
  avatarUrl?: string;
};

export type GuestLoginResponse = {
  user: {
    id: string;
    role: string;
    provider: string;
    display_name: string;
    email: string | null;
  };
  profile: unknown;
  auth: {
    type: "guest";
    headerName: "X-Guest-User-Id";
    headerValue: string;
  };
};

export function createGuestSession(payload: GuestLoginRequest) {
  return apiRequest<GuestLoginResponse>("/auth/guest", {
    method: "POST",
    body: payload,
    auth: false
  });
}
