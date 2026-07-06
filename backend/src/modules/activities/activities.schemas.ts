import { z } from "zod";

export const answerActivitySchema = z.object({
  clientEventId: z.string().uuid(),
  selectedOptionId: z.string().uuid().optional(),
  answerText: z.string().optional(),
  occurredAtClient: z.string().datetime().optional(),
  deviceId: z.string().optional()
});
