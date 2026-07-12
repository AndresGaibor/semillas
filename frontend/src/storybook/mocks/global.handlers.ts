import { http, HttpResponse } from "msw";

/** Respuestas mínimas compartidas por layouts que consultan el perfil al montarse. */
export const globalStoryHandlers = [
  http.get("*/perfil", () => HttpResponse.json({ usuario: {}, perfil: {} })),
];
