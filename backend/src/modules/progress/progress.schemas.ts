import { z } from "zod";

export const progressEventSchema = z.object({
  clientEventId: z.string().uuid(),
  eventType: z.enum([
    "theme_started",
    "theme_completed",
    "block_started",
    "block_completed",
    "activity_started",
    "activity_answered",
    "activity_completed",
    "reward_claimed",
    "theme_downloaded",
    "sync_marker"
  ]),
  themeId: z.string().uuid().optional(),
  stepId: z.string().uuid().optional(),
  activityId: z.string().uuid().optional(),
  isCorrect: z.boolean().optional(),
  score: z.number().min(0).max(100).optional(),
  xpAwarded: z.number().int().min(0).default(0),
  payload: z.record(z.string(), z.unknown()).default({}),
  occurredAtClient: z.string().datetime().optional(),
  deviceId: z.string().optional()
});
