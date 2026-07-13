import { z } from "zod";

const opcionActividadSchema = z.object({
  etiqueta: z.string().max(5),
  texto: z.string().min(1),
  correcta: z.boolean().default(false),
  orden: z.number().int().min(1),
  retroalimentacion: z.string().optional()
});

const preguntaReflexionSchema = z.object({
  pregunta: z.string().min(3).max(500),
  orden: z.number().int().min(1)
});

export const createThemeSchema = z.object({
  senda_id: z.string().uuid(),
  titulo: z.string().min(3).max(120),
  slug: z.string().min(3).max(140),
  objetivo: z.string().min(10),
  resumen: z.string().min(10),
  version_biblica_id: z.string().uuid(),
  minutos_estimados: z.number().int().min(1).max(120).default(10),
  xp_recompensa: z.number().int().min(0).max(500).default(50),
  grupo_edad_ids: z.array(z.string().uuid()).min(1),
  portada_recurso_id: z.string().uuid().nullable().optional()
});

export const updateThemeSchema = z.object({
  senda_id: z.string().uuid().optional(),
  titulo: z.string().min(3).max(120).optional(),
  slug: z.string().min(3).max(140).optional(),
  objetivo: z.string().min(10).optional(),
  resumen: z.string().min(10).optional(),
  minutos_estimados: z.number().int().min(1).max(120).optional(),
  xp_recompensa: z.number().int().min(0).max(500).optional(),
  version_biblica_id: z.string().uuid().optional(),
  grupo_edad_ids: z.array(z.string().uuid()).min(1).optional(),
  portada_recurso_id: z.string().uuid().nullable().optional(),
});

export const upsertStepContentSchema = z.object({
  tipo_paso_id: z.string().uuid(),
  grupo_edad_id: z.string().uuid(),
  titulo: z.string().min(2).max(120),
  cuerpo: z.string().min(5),
  instruccion_corta: z.string().max(240).optional(),
  recurso_id: z.string().uuid().nullable().optional(),
  recurso_audio_id: z.string().uuid().nullable().optional(),
  datos_extra: z.record(z.string(), z.unknown()).optional(),
  preguntas: z.array(preguntaReflexionSchema).max(12).optional()
});

export const updateActivitySchema = z.object({
  tema_id: z.string().uuid().optional(),
  paso_id: z.string().uuid().nullable().optional(),
  grupo_edad_id: z.string().uuid().optional(),
  tipo_actividad_id: z.string().uuid().optional(),
  titulo: z.string().min(3).optional(),
  consigna: z.string().min(3).optional(),
  retroalimentacion: z.string().optional(),
  orden: z.number().int().min(1).optional(),
  xp_recompensa: z.number().int().min(0).optional(),
  limite_tiempo_seg: z.number().int().positive().nullable().optional(),
  dificultad: z.enum(["facil", "normal", "dificil"]).optional(),
  obligatorio: z.boolean().optional(),
  configuracion: z.record(z.string(), z.unknown()).optional(),
  opciones: z.array(opcionActividadSchema).optional()
});

const userRoleSchema = z.enum(["administrador", "usuario", "invitado", "padre"]);

export const updateUserSchema = z.object({
  rol: userRoleSchema.optional(),
  nombre_visible: z.string().trim().min(2).max(120).optional(),
  activo: z.boolean().optional(),
  apodo: z.string().trim().min(2).max(100).optional(),
  grupo_edad_id: z.string().uuid().nullable().optional(),
  avatar_url: z.string().url().max(500).nullable().optional(),
  prefiere_audio: z.boolean().optional(),
  tamano_texto_preferido: z.enum(["pequeno", "mediano", "grande"]).optional(),
  club_ids: z.array(z.string().uuid()).max(20).optional()
}).refine((body) => Object.keys(body).length > 0, {
  message: "Envía al menos un cambio"
});

export const inviteUserSchema = z.object({
  correo: z.string().trim().email().max(255),
  nombre_visible: z.string().trim().min(2).max(120),
  rol: userRoleSchema.exclude(["invitado"]).default("usuario"),
  apodo: z.string().trim().min(2).max(100).optional(),
  grupo_edad_id: z.string().uuid().nullable().optional(),
  club_id: z.string().uuid().nullable().optional(),
  redirect_to: z.string().url().optional()
});

export const createChildUserSchema = z.object({
  nombre_visible: z.string().trim().min(2).max(120),
  apodo: z.string().trim().min(2).max(100),
  grupo_edad_id: z.string().uuid(),
  tutor_id: z.string().uuid().nullable().optional(),
  relacion: z.string().trim().min(2).max(50).optional(),
  club_id: z.string().uuid().nullable().optional(),
  prefiere_audio: z.boolean().optional(),
  tamano_texto_preferido: z.enum(["pequeno", "mediano", "grande"]).optional()
});

export const bulkUserActionSchema = z.object({
  usuario_ids: z.array(z.string().uuid()).min(1).max(100),
  accion: z.enum(["activar", "desactivar"])
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type CreateChildUserInput = z.infer<typeof createChildUserSchema>;
export type BulkUserActionInput = z.infer<typeof bulkUserActionSchema>;

export const createActivitySchema = z.object({
  tema_id: z.string().uuid(),
  paso_id: z.string().uuid().nullable().optional(),
  grupo_edad_id: z.string().uuid(),
  tipo_actividad_id: z.string().uuid(),
  titulo: z.string().min(3),
  consigna: z.string().min(3),
  retroalimentacion: z.string().optional(),
  orden: z.number().int().min(1).default(1),
  xp_recompensa: z.number().int().min(0).default(10),
  limite_tiempo_seg: z.number().int().positive().nullable().optional(),
  dificultad: z.enum(["facil", "normal", "dificil"]).default("facil"),
  obligatorio: z.boolean().default(true),
  configuracion: z.record(z.string(), z.unknown()).default({}),
  opciones: z.array(opcionActividadSchema).default([])
});

export const reorderActivitiesSchema = z.object({
  actividad_ids: z.array(z.string().uuid()).min(1).max(200)
});

export const submitReviewSchema = z.object({
  notas: z.string().max(2000).optional()
});

export const resolveReviewSchema = z.object({
  estado: z.enum(["aprobado", "cambios_solicitados", "rechazado"]),
  notas: z.string().max(2000).optional()
});

export const createSendaSchema = z.object({
  codigo: z.string().min(2).max(50),
  nombre: z.string().min(2).max(100),
  descripcion: z.string().optional(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  nombre_icono: z.string().optional(),
  imagen_recurso_id: z.string().uuid().nullable().optional(),
  orden: z.number().int().min(1),
  activo: z.boolean().default(false)
});

export const updateSendaSchema = z.object({
  codigo: z.string().min(2).max(50).optional(),
  nombre: z.string().min(2).max(100).optional(),
  descripcion: z.string().optional(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  nombre_icono: z.string().optional(),
  imagen_recurso_id: z.string().uuid().nullable().optional(),
  orden: z.number().int().min(1).optional(),
  activo: z.boolean().optional()
});
