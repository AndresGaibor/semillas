import { z } from "zod";

export const clubParamsSchema = z.object({
  clubId: z.string().uuid(),
});

export const miembroClubParamsSchema = clubParamsSchema.extend({
  usuarioId: z.string().uuid(),
});

export const retoClubParamsSchema = clubParamsSchema.extend({
  retoId: z.string().uuid(),
});

export const adminClubListSchema = z.object({
  q: z.string().trim().max(120).optional(),
  estado: z.enum(["activo", "archivado", "todos"]).default("todos"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const cerrarRetoAdminSchema = z.object({
  motivo: z.string().trim().min(3).max(500),
});
