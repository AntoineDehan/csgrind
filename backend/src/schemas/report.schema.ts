import { z } from "zod";
import { tipSchema } from "./tip.schema";

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

export const reportSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),

  aimRating: z.coerce.number().nullable(),
  utilityRating: z.coerce.number().nullable(),
  positioningRating: z.coerce.number().nullable(),
  leetifyRating: z.coerce.number().nullable(),

  premierRank: z.number().int().nullable(),
  faceitRank: z.number().int().nullable(),

  accuracyHead: z.coerce.number().nullable(),
  accuracyEnemySpotted: z.coerce.number().nullable(),
  sprayAccuracy: z.coerce.number().nullable(),
  counterStrafingRatio: z.coerce.number().nullable(),
  preaim: z.coerce.number().nullable(),
  reactionTimeMs: z.coerce.number().nullable(),

  flashHitPerFlash: z.coerce.number().nullable(),
  flashAvgDuration: z.coerce.number().nullable(),
  flashLeadingToKill: z.coerce.number().nullable(),
  heFoesDamageAvg: z.coerce.number().nullable(),
  utilityOnDeathAvg: z.coerce.number().nullable(),

  ctOpeningSuccess: z.coerce.number().nullable(),
  tOpeningSuccess: z.coerce.number().nullable(),
  tradeKillsSuccess: z.coerce.number().nullable(),
  tradeDeathsSuccess: z.coerce.number().nullable(),

  winrate: z.coerce.number().nullable(),
  totalMatches: z.number().int().nullable(),

  goalId: z.uuid(),
});

export type Report = z.infer<typeof reportSchema>;

export const statDeltaSchema = z.object({
  stat: z.string(),
  previous: z.number(),
  current: z.number(),
  delta: z.number(),
  improved: z.boolean(),
});

export const reportDetailSchema = reportSchema.extend({
  tips: z.array(z.object({ tip: tipSchema })),
  comparison: z.array(statDeltaSchema),
  index: z.number().int(),
});

export type ReportDetail = z.infer<typeof reportDetailSchema>;
