import { z } from "zod";

export const tipoRecursoEnum = z.enum(["imagen", "audio", "video", "documento"]);

export const crearRecursoSchema = z.object({
  tipo: tipoRecursoEnum,
  textoAlternativo: z.string().max(300).optional(),
  titulo: z.string().trim().min(2).max(120).optional(),
});
