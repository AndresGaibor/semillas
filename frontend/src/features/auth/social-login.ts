export function obtenerRedirectGoogle(baseUrl: string) {
  return `${baseUrl}/auth/callback`;
}

export function obtenerRedirectFacebook(baseUrl: string) {
  return `${baseUrl}/auth/callback`;
}

export function esFacebookPermitidoEnOrigen(origin: string) {
  void origin;
  return true;
}
