import { MODOS_TEMA, THEME_STORAGE_KEY, type ModoTema } from "./theme.types";

export function esModoTema(value: string | null): value is ModoTema {
  return MODOS_TEMA.includes(value as ModoTema);
}

export function leerModoTema(): ModoTema {
  if (typeof window === "undefined") return "sistema";
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return esModoTema(value) ? value : "sistema";
}

export function guardarModoTema(modo: ModoTema) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, modo);
}
