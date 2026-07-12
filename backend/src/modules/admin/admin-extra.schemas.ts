import { z } from "zod";

export const sendaCreateSchema = z.object({
  nombre: z.string().trim().min(3).max(100),
  codigo: z.string().trim().min(2).max(50).regex(/^[a-z0-9_-]+$/),
  descripcion: z.string().trim().max(1000).nullable().optional(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  nombre_icono: z.string().trim().max(100).nullable().optional(),
  activo: z.boolean().default(true),
});

export const sendaUpdateSchema = sendaCreateSchema.partial();
export const sendasReorderSchema = z.object({
  senda_ids: z.array(z.string().uuid()).min(1).max(50),
});

export const clubModerationSchema = z.object({
  activo: z.boolean().optional(),
  descripcion: z.string().trim().max(1000).nullable().optional(),
  nombre: z.string().trim().min(3).max(100).optional(),
});

export const settingUpdateSchema = z.object({
  valor: z.unknown(),
  descripcion: z.string().trim().max(1000).nullable().optional(),
});

export const levelCreateSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  numero_nivel: z.number().int().min(1).max(100),
  xp_minima: z.number().int().min(0).max(10_000_000),
  color_insignia: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
});
export const levelUpdateSchema = levelCreateSchema.partial();

export const achievementCreateSchema = z.object({
  nombre: z.string().trim().min(3).max(100),
  codigo: z.string().trim().min(2).max(50).regex(/^[a-z0-9_-]+$/),
  descripcion: z.string().trim().max(1000).nullable().optional(),
  url_icono: z.string().url().nullable().optional(),
  bono_xp: z.number().int().min(0).max(100_000).default(0),
  codigo_criterio: z.enum(["temas_completados", "actividades_completadas", "dias_racha", "xp_total"]),
  valor_criterio: z.number().int().min(1).max(1_000_000),
  activo: z.boolean().default(true),
});
export const achievementUpdateSchema = achievementCreateSchema.partial();

export const xpAdjustmentSchema = z.object({
  cantidad: z.number().int().min(-100_000).max(100_000).refine((value) => value !== 0, "La cantidad no puede ser cero"),
  motivo: z.string().trim().min(5).max(500),
});
