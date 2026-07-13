import { z } from 'zod';

export const OpcionSchema = z.object({
  id: z.string(),
  texto: z.string(),
  esCorrecta: z.boolean(),
});

export const ActividadBaseSchema = z.object({
  id: z.string(),
  tipo: z.enum([
    'quiz',
    'flashcard',
    'completar-versiculo',
    'relacionar-conceptos',
    'rompecabezas',
    'arrastrar-soltar',
    'verdadero-falso',
    'audio',
    'cancion',
  ]),
  enunciado: z.string(),
  opciones: z.array(OpcionSchema).optional(),
  imagen: z.string().optional(),
  audio: z.string().optional(),
  letra: z.string().optional(),
  instrucciones: z.string().optional(),
  dificultad: z.enum(['facil', 'medio', 'dificil']).optional(),
  tiempoEstimado: z.number().optional(),
});

export type Actividad = z.infer<typeof ActividadBaseSchema>;
export type Opcion = z.infer<typeof OpcionSchema>;
export type TipoActividad = Actividad['tipo'];

// Schemas por tipo
export const QuizActividadSchema = ActividadBaseSchema.extend({
  tipo: z.literal('quiz'),
});
export const FlashcardActividadSchema = ActividadBaseSchema.extend({
  tipo: z.literal('flashcard'),
});
export const CompletarVersiculoSchema = ActividadBaseSchema.extend({
  tipo: z.literal('completar-versiculo'),
  versoCompletar: z.string(),
  opciones: z.array(OpcionSchema),
});
export const RelacionarConceptosSchema = ActividadBaseSchema.extend({
  tipo: z.literal('relacionar-conceptos'),
  pares: z.array(z.object({ concepto: z.string(), definicion: z.string() })),
});
export const AudioActividadSchema = ActividadBaseSchema.extend({
  tipo: z.literal('audio'),
  audio: z.string(),
  letra: z.string().optional(),
  quizOpciones: z.array(OpcionSchema).optional(),
});
export const CancionActividadSchema = ActividadBaseSchema.extend({
  tipo: z.literal('cancion'),
  audio: z.string(),
  letra: z.string(),
});
