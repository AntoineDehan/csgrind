import { z } from "zod";

export const createGoalSchema = z.object({
  matchmaking: z.enum(["FACEIT", "PREMIER"]),
  eloGoal: z.number().int(),
  endDate: z.coerce.date().optional(),
  status: z.enum(["in_progress", "completed", "abandoned"]).optional(),
  userId: z.uuid(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
