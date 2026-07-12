const GUEST_USER_ID_KEY = "semillas_guest_user_id";
const ACCESS_TOKEN_KEY = "semillas_access_token";
const GUEST_TOKEN_KEY = "semillas_guest_token";
const CONFLICTO_MENSAJE_KEY = "semillas_conflicto_vinculacion";

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

  getGuestToken() {
    return localStorage.getItem(GUEST_TOKEN_KEY);
  },

  setGuestToken(token: string) {
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  },

  clearGuestToken() {
    localStorage.removeItem(GUEST_TOKEN_KEY);
  },

  clearGuestSession() {
    localStorage.removeItem(GUEST_USER_ID_KEY);
    localStorage.removeItem(GUEST_TOKEN_KEY);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getConflictoMensaje() {
    return localStorage.getItem(CONFLICTO_MENSAJE_KEY);
  },

  setConflictoMensaje(mensaje: string) {
    localStorage.setItem(CONFLICTO_MENSAJE_KEY, mensaje);
  },

  clearConflictoMensaje() {
    localStorage.removeItem(CONFLICTO_MENSAJE_KEY);
  },
};
