import { z } from "zod";

export const createReportSchema = z.object({
  goalId: z.uuid(),
  aimRating: z.number().optional(),
  utilityRating: z.number().optional(),
  positioningRating: z.number().optional(),
  leetifyRating: z.number().optional(),
  premierRank: z.number().int().optional(),
  faceitRank: z.number().int().optional(),
  accuracyHead: z.number().optional(),
  accuracyEnemySpotted: z.number().optional(),
  sprayAccuracy: z.number().optional(),
  counterStrafingRatio: z.number().optional(),
  preaim: z.number().optional(),
  reactionTimeMs: z.number().optional(),
  flashHitPerFlash: z.number().optional(),
  flashAvgDuration: z.number().optional(),
  flashLeadingToKill: z.number().optional(),
  heFoesDamageAvg: z.number().optional(),
  utilityOnDeathAvg: z.number().optional(),
  ctOpeningSuccess: z.number().optional(),
  tOpeningSuccess: z.number().optional(),
  tradeKillsSuccess: z.number().optional(),
  tradeDeathsSuccess: z.number().optional(),
  winrate: z.number().optional(),
  totalMatches: z.number().int().optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
