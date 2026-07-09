import { z } from "zod";

export const updateProfileSchema = z.object({
  apodo: z.string().min(2).max(40).optional(),
  grupo_edad_id: z.string().uuid().nullable().optional(),
  url_avatar: z.string().nullable().optional(),
  prefiere_audio: z.boolean().optional(),
  tamano_texto_preferido: z.enum(["small", "medium", "large"]).optional()
});
