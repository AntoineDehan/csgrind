import type { Report } from "../../generated/prisma/client";
import { STAT_DIRECTION, type StatKey } from "../comparators/report_comparator";

export type BadgeContext = {
  report: Report;
  previous: Report;
  percent: number;
  completedCount: number;
};

export type BadgeDef = {
  name: string;
  description: string;
  icon: string;
  rule: (ctx: BadgeContext) => boolean;
};

const IMPROVEMENT_PCT = 0.2;

const IMPROVEMENT_STATS: { stat: StatKey; label: string; icon: string }[] = [
  { stat: "aimRating", label: "Aim", icon: "🎯" },
  { stat: "utilityRating", label: "Utility", icon: "🧨" },
  { stat: "positioningRating", label: "Positioning", icon: "🧭" },
  { stat: "accuracyHead", label: "Headshot accuracy", icon: "💥" },
  { stat: "accuracyEnemySpotted", label: "Spotted accuracy", icon: "👁️" },
  { stat: "sprayAccuracy", label: "Spray accuracy", icon: "🔫" },
  { stat: "counterStrafingRatio", label: "Counter-strafing", icon: "🦶" },
  { stat: "preaim", label: "Pre-aim", icon: "➕" },
  { stat: "reactionTimeMs", label: "Reaction time", icon: "⚡" },
  { stat: "flashHitPerFlash", label: "Flash efficiency", icon: "💡" },
  { stat: "flashAvgDuration", label: "Flash duration", icon: "🔦" },
  { stat: "flashLeadingToKill", label: "Flash assists", icon: "🤝" },
  { stat: "heFoesDamageAvg", label: "HE damage", icon: "💣" },
  { stat: "utilityOnDeathAvg", label: "Utility usage", icon: "💰" },
  { stat: "ctOpeningSuccess", label: "CT opening duels", icon: "🛡️" },
  { stat: "tOpeningSuccess", label: "T opening duels", icon: "⚔️" },
  { stat: "tradeKillsSuccess", label: "Trade kills", icon: "🔁" },
  { stat: "tradeDeathsSuccess", label: "Traded deaths", icon: "♻️" },
];

const WINRATE_TIERS = [3, 5, 10];
const GAMES_TIERS = [10, 20, 30, 50];
const REACTION_TIERS = [600, 550, 500, 450, 400];
const OBJECTIVE_TIERS = [1, 2, 5, 10];

function num(value: unknown): number | null {
  return value == null ? null : Number(value);
}

const WINRATE_DECIMALS = 4;

function winrateUnits(value: number): number {
  return Math.round(value * 10 ** WINRATE_DECIMALS);
}

function improved(stat: StatKey, ctx: BadgeContext): boolean {
  const prev = num(ctx.previous[stat]);
  const curr = num(ctx.report[stat]);
  if (prev == null || curr == null || prev === 0) return false;
  const change =
    STAT_DIRECTION[stat] === "higher"
      ? (curr - prev) / prev
      : (prev - curr) / prev;
  return change >= IMPROVEMENT_PCT;
}

export const BADGE_DEFS: BadgeDef[] = [
  ...IMPROVEMENT_STATS.map((entry) => ({
    name: `Improved ${entry.label} by 20%`,
    description: `Improve your ${entry.label} by 20% since your last report.`,
    icon: entry.icon,
    rule: (ctx: BadgeContext) => improved(entry.stat, ctx),
  })),
  ...WINRATE_TIERS.map((points) => ({
    name: `Increased winrate by ${points} points`,
    description: `Increase your win rate by ${points} points since your last report.`,
    icon: "📈",
    rule: (ctx: BadgeContext) => {
      const prev = num(ctx.previous.winrate);
      const curr = num(ctx.report.winrate);
      if (prev == null || curr == null) return false;
      return winrateUnits(curr) - winrateUnits(prev) >= winrateUnits(points / 100);
    },
  })),
  ...GAMES_TIERS.map((count) => ({
    name: `Played ${count} games`,
    description: `Play ${count} games between two reports.`,
    icon: "🎮",
    rule: (ctx: BadgeContext) => {
      const prev = num(ctx.previous.totalMatches);
      const curr = num(ctx.report.totalMatches);
      if (prev == null || curr == null) return false;
      return curr - prev >= count;
    },
  })),
  ...REACTION_TIERS.map((ms) => ({
    name: `Reaction time under ${ms} ms`,
    description: `Get your reaction time under ${ms} ms.`,
    icon: "⚡",
    rule: (ctx: BadgeContext) => {
      const curr = num(ctx.report.reactionTimeMs);
      return curr != null && curr < ms;
    },
  })),
  ...OBJECTIVE_TIERS.map((count) => ({
    name:
      count === 1 ? "Completed your 1st objective" : `Completed ${count} objectives`,
    description:
      count === 1 ? "Complete your first objective." : `Complete ${count} objectives.`,
    icon: "🏆",
    rule: (ctx: BadgeContext) => ctx.completedCount >= count,
  })),
  {
    name: "Reached 50% headshots",
    description: "Reach 50% headshot accuracy.",
    icon: "💥",
    rule: (ctx: BadgeContext) => {
      const hs = num(ctx.report.accuracyHead);
      return hs != null && hs >= 50;
    },
  },
  {
    name: "Halfway to your objective",
    description: "Reach 50% of your objective.",
    icon: "🚀",
    rule: (ctx: BadgeContext) => ctx.percent >= 50,
  },
];
