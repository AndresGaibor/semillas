export function obtenerRedirectGoogle(baseUrl: string) {
  return `${baseUrl}/auth/callback`;
}

export function obtenerRedirectFacebook(baseUrl: string) {
  return `${baseUrl}/auth/callback`;
}

export function esFacebookPermitidoEnOrigen(origin: string) {
  const hostname = new URL(origin).hostname;

  return hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "::1";
}
