import { z } from "zod";

const reportFrequencyValues = [
  "DAYS_2",
  "DAYS_5",
  "DAYS_7",
  "DAYS_14",
  "DAYS_30",
] as const;

export const createGoalSchema = z.object({
  matchmaking: z.enum(["FACEIT", "PREMIER"]),
  eloGoal: z.number().int(),
  endDate: z.coerce.date().optional(),
  reportFrequency: z.enum(reportFrequencyValues).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = z.object({
  matchmaking: z.enum(["FACEIT", "PREMIER"]).optional(),
  eloGoal: z.number().int().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(["in_progress", "completed", "abandoned"]).optional(),
  reportFrequency: z.enum(reportFrequencyValues).optional(),
});

export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export const goalSchema = z.object({
  id: z.uuid(),
  matchmaking: z.enum(["FACEIT", "PREMIER"]),
  eloGoal: z.number().int(),
  endDate: z.iso.datetime().nullable(),
  status: z.enum(["in_progress", "completed", "abandoned"]),
  reportFrequency: z.enum(reportFrequencyValues),
  userId: z.uuid(),
  createdAt: z.iso.datetime(),
});

export type Goal = z.infer<typeof goalSchema>;

export const goalStatsSchema = z.object({
  startElo: z.number().nullable(),
  currentElo: z.number().nullable(),
  objectiveElo: z.number(),
  percent: z.number(),
  nextReportAt: z.iso.datetime(),
});

export type GoalStats = z.infer<typeof goalStatsSchema>;
