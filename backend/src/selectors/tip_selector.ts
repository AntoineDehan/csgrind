import type { Report } from "../../generated/prisma/client";
import { matches, type Comparator } from "./rule";

type TipRule = {
  stat: keyof Report;
  comparator: Comparator;
  threshold: number;
  tipId: string;
};

const TIP_RULES: TipRule[] = [
  {
    stat: "accuracyHead",
    comparator: "lt",
    threshold: 0.2,
    tipId: "tip-headshot",
  },
  {
    stat: "reactionTimeMs",
    comparator: "gt",
    threshold: 700,
    tipId: "tip-reaction",
  },
];

export function selectTips(report: Report): string[] {
  return TIP_RULES.filter((rule) => {
    const value = report[rule.stat];
    if (value == null) return false;
    return matches(Number(value), rule.comparator, rule.threshold);
  }).map((rule) => rule.tipId);
}
