import { z } from "zod";

export const createGuestSchema = z.object({
  nickname: z.string().min(2).max(40).default("Invitado"),
  ageGroupId: z.string().uuid().optional(),
  avatarUrl: z.string().url().optional()
});
