import { z } from "zod";

export const updateProfileSchema = z.object({
  nickname: z.string().min(2).max(40).optional(),
  ageGroupId: z.string().uuid().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  preferredAudio: z.boolean().optional(),
  preferredTextSize: z.enum(["small", "medium", "large"]).optional()
});
