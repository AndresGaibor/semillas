const GUEST_USER_ID_KEY = "semillas_guest_user_id";
const ACCESS_TOKEN_KEY = "semillas_access_token";

export const sessionStorageApi = {
  getGuestUserId() {
    return localStorage.getItem(GUEST_USER_ID_KEY);
  },

  setGuestUserId(id: string) {
    localStorage.setItem(GUEST_USER_ID_KEY, id);
  },

  clearGuestUserId() {
    localStorage.removeItem(GUEST_USER_ID_KEY);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};
