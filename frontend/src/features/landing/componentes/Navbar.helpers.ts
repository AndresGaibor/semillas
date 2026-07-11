export function obtenerHrefLandingInicial(): string {
  if (typeof window === "undefined") return "#top";

  return window.location.hash || "#top";
}

export function esEnlaceLandingActivo(hrefActivo: string, hrefEnlace: string): boolean {
  return hrefActivo === hrefEnlace;
}
