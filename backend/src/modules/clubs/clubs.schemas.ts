import { z } from "zod";

export const createClubSchema = z.object({
  nombre: z.string().trim().min(3).max(80),
  descripcion: z.string().trim().max(300).optional()
});

export const joinClubSchema = z.object({
  codigo_acceso: z.string().trim().min(4).max(20).transform((codigo) => codigo.toUpperCase())
});

export const createChallengeSchema = z.object({
  nombre: z.string().trim().min(3).max(120),
  descripcion: z.string().trim().max(300).optional(),
  codigo_metrica: z.string().trim().min(2).max(50),
  valor_objetivo: z.number().int().min(1),
  xp_reto: z.number().int().min(0).default(100),
  fecha_inicio: z.string().datetime(),
  fecha_fin: z.string().datetime()
}).superRefine((datos, contexto) => {
  if (new Date(datos.fecha_fin) <= new Date(datos.fecha_inicio)) {
    contexto.addIssue({
      code: "custom",
      path: ["fecha_fin"],
      message: "La fecha de fin debe ser posterior a la fecha de inicio"
    });
  }
});
