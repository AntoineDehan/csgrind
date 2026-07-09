import type { Report } from "../../generated/prisma/client";

export const STAT_DIRECTION = {
  aimRating: "higher",
  utilityRating: "higher",
  positioningRating: "higher",
  leetifyRating: "higher",
  premierRank: "higher",
  faceitRank: "higher",
  accuracyHead: "higher",
  accuracyEnemySpotted: "higher",
  sprayAccuracy: "higher",
  counterStrafingRatio: "higher",
  preaim: "lower",
  reactionTimeMs: "lower",
  flashHitPerFlash: "higher",
  flashAvgDuration: "higher",
  flashLeadingToKill: "higher",
  heFoesDamageAvg: "higher",
  utilityOnDeathAvg: "lower",
  ctOpeningSuccess: "higher",
  tOpeningSuccess: "higher",
  tradeKillsSuccess: "higher",
  tradeDeathsSuccess: "higher",
  winrate: "higher",
} as const;

export type StatKey = keyof typeof STAT_DIRECTION;

export type StatDelta = {
  stat: StatKey;
  previous: number;
  current: number;
  delta: number;
  improved: boolean;
};

export function compareReports(
  previous: Report,
  current: Report,
): StatDelta[] {
  const deltas: StatDelta[] = [];

  for (const stat of Object.keys(STAT_DIRECTION) as StatKey[]) {
    const prevValue = previous[stat];
    const currValue = current[stat];

    if (prevValue == null || currValue == null) continue;

    const prev = Number(prevValue);
    const curr = Number(currValue);
    const delta = curr - prev;
    const improved =
      STAT_DIRECTION[stat] === "higher" ? delta > 0 : delta < 0;

    deltas.push({ stat, previous: prev, current: curr, delta, improved });
  }

  return deltas;
}
