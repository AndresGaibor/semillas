import { z } from "zod";

export const createThemeSchema = z.object({
  pathId: z.string().uuid(),
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(140),
  objective: z.string().min(10),
  summary: z.string().min(10),
  bibleVersionId: z.string().uuid(),
  estimatedMinutes: z.number().int().min(1).max(120).default(10),
  xpReward: z.number().int().min(0).max(500).default(50),
  ageGroupIds: z.array(z.string().uuid()).min(1)
});

export const updateThemeSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  objective: z.string().min(10).optional(),
  summary: z.string().min(10).optional(),
  estimatedMinutes: z.number().int().min(1).max(120).optional(),
  xpReward: z.number().int().min(0).max(500).optional(),
  bibleVersionId: z.string().uuid().optional(),
  ageGroupIds: z.array(z.string().uuid()).min(1).optional()
});

export const upsertStepContentSchema = z.object({
  stepTypeId: z.string().uuid(),
  ageGroupId: z.string().uuid(),
  title: z.string().min(2).max(120),
  body: z.string().min(5),
  shortInstruction: z.string().optional()
});

export const createActivitySchema = z.object({
  themeId: z.string().uuid(),
  stepId: z.string().uuid(),
  ageGroupId: z.string().uuid(),
  activityTypeId: z.string().uuid(),
  title: z.string().min(3),
  prompt: z.string().min(3),
  feedback: z.string().optional(),
  sortOrder: z.number().int().min(1).default(1),
  xpReward: z.number().int().min(0).default(10),
  difficulty: z.enum(["easy", "normal", "hard"]).default("easy"),
  config: z.record(z.string(), z.unknown()).default({}),
  options: z
    .array(
      z.object({
        label: z.string().max(5),
        text: z.string().min(1),
        isCorrect: z.boolean().default(false),
        sortOrder: z.number().int().min(1),
        feedback: z.string().optional()
      })
    )
    .default([])
});
