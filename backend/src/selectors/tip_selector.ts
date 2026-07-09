import type { Report, Tip } from "../../generated/prisma/client";
import { matches, type Comparator } from "./rule";

type TipRule = {
  stat: keyof Report;
  comparator: Comparator;
  threshold: number;
};

const TIP_RULES: TipRule[] = [
  { stat: "aimRating", comparator: "lt", threshold: 55 },
  { stat: "utilityRating", comparator: "lt", threshold: 55 },
  { stat: "positioningRating", comparator: "lt", threshold: 55 },
  { stat: "accuracyHead", comparator: "lt", threshold: 20 },
  { stat: "accuracyEnemySpotted", comparator: "lt", threshold: 30 },
  { stat: "sprayAccuracy", comparator: "lt", threshold: 30 },
  { stat: "counterStrafingRatio", comparator: "lt", threshold: 50 },
  { stat: "preaim", comparator: "gt", threshold: 8 },
  { stat: "reactionTimeMs", comparator: "gt", threshold: 700 },
  { stat: "flashHitPerFlash", comparator: "lt", threshold: 0.5 },
  { stat: "flashAvgDuration", comparator: "lt", threshold: 1 },
  { stat: "flashLeadingToKill", comparator: "lt", threshold: 10 },
  { stat: "heFoesDamageAvg", comparator: "lt", threshold: 10 },
  { stat: "utilityOnDeathAvg", comparator: "gt", threshold: 200 },
  { stat: "ctOpeningSuccess", comparator: "lt", threshold: 50 },
  { stat: "tOpeningSuccess", comparator: "lt", threshold: 50 },
  { stat: "tradeKillsSuccess", comparator: "lt", threshold: 20 },
  { stat: "tradeDeathsSuccess", comparator: "lt", threshold: 50 },
];

export function selectTips(report: Report, tips: Tip[]): string[] {
  return TIP_RULES.filter((rule) => {
    const value = report[rule.stat];
    if (value == null) return false;
    return matches(Number(value), rule.comparator, rule.threshold);
  })
    .map((rule) => {
      const candidates = tips.filter((tip) => tip.category === rule.stat);
      if (candidates.length === 0) return null;
      return candidates[Math.floor(Math.random() * candidates.length)]!.id;
    })
    .filter((id): id is string => id !== null);
}
