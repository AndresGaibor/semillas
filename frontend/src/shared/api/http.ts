import { env } from "../config/env";
import { ApiError } from "./api-error";
import { sessionStorageApi } from "./session";

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  [key: string]: unknown;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (options.auth !== false) {
    const guestUserId = sessionStorageApi.getGuestUserId();
    const accessToken = sessionStorageApi.getAccessToken();

    if (guestUserId) {
      headers["X-Guest-User-Id"] = guestUserId;
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.ok) {
    throw new ApiError(
      response.status,
      payload?.error?.message ?? "Error inesperado",
      payload
    );
  }

  return payload.data as T;
}
