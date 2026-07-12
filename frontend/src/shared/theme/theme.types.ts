export const MODOS_TEMA = ["sistema", "claro", "oscuro"] as const;

export type ModoTema = (typeof MODOS_TEMA)[number];
export type TemaResuelto = "claro" | "oscuro";

export const THEME_STORAGE_KEY = "semillas-pref-tema";
