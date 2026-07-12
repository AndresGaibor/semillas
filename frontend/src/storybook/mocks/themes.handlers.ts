import { http, HttpResponse } from "msw";

const temas = [{ id: "theme-story-001", titulo: "El amor de Dios", descripcion: "Una historia para crecer en fe." }];

export const themesSuccessHandlers = [http.get("*/themes", () => HttpResponse.json(temas))];
export const themesEmptyHandlers = [http.get("*/themes", () => HttpResponse.json([]))];
export const themesErrorHandlers = [http.get("*/themes", () => HttpResponse.json({ message: "No se pudieron cargar los temas" }, { status: 500 }))];
