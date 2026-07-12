import type { ModoTema, TemaResuelto } from "./theme.types";

const MEDIA_QUERY_DARK = "(prefers-color-scheme: dark)";

export function obtenerTemaSistema(): TemaResuelto {
  if (typeof window === "undefined") return "claro";
  return window.matchMedia(MEDIA_QUERY_DARK).matches ? "oscuro" : "claro";
}

export function resolverTema(modo: ModoTema): TemaResuelto {
  return modo === "sistema" ? obtenerTemaSistema() : modo;
}

export function aplicarTemaAlDocumento(modo: ModoTema): TemaResuelto {
  const tema = resolverTema(modo);
  const root = document.documentElement;
  const oscuro = tema === "oscuro";

  root.classList.toggle("dark", oscuro);
  root.dataset.theme = tema;
  root.dataset.themePreference = modo;
  root.style.colorScheme = oscuro ? "dark" : "light";

  return tema;
}

export function observarTemaSistema(callback: () => void) {
  const media = window.matchMedia(MEDIA_QUERY_DARK);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
