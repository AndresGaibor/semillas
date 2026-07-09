import { z } from "zod";

export const createClubSchema = z.object({
  name: z.string().min(3).max(80),
  description: z.string().max(300).optional()
});

export const joinClubSchema = z.object({
  inviteCode: z.string().min(4).max(20)
});

export const createChallengeSchema = z.object({
  name: z.string().min(3).max(120),
  description: z.string().max(300).optional(),
  metricCode: z.string().min(2),
  targetValue: z.number().int().min(1),
  rewardXp: z.number().int().min(0).default(100),
  startsOn: z.string().datetime(),
  endsOn: z.string().datetime()
});
