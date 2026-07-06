import { sessionStorageApi } from "./session";

export function hasSession() {
  return Boolean(
    sessionStorageApi.getGuestUserId() ||
    sessionStorageApi.getAccessToken()
  );
}
