import type { Report } from "../services/reports";

export type StatField = {
  key: keyof Report;
  label: string;
  unit: string;
  decimals: number;
  scale?: number;
  prefix?: string;
};

export const STAT_FIELDS: StatField[] = [
  { key: "leetifyRating", label: "Leetify Rating", unit: "", decimals: 2 },
  { key: "aimRating", label: "Aim", unit: "", decimals: 0 },
  { key: "utilityRating", label: "Utility", unit: "", decimals: 0 },
  { key: "positioningRating", label: "Positioning", unit: "", decimals: 0 },
  { key: "premierRank", label: "Premier", unit: "", decimals: 0 },
  { key: "faceitRank", label: "FACEIT", unit: "", decimals: 0 },
  { key: "accuracyHead", label: "Headshot Accuracy", unit: "%", decimals: 0 },
  {
    key: "accuracyEnemySpotted",
    label: "Spotted Accuracy",
    unit: "%",
    decimals: 0,
  },
  { key: "sprayAccuracy", label: "Spray Accuracy", unit: "%", decimals: 0 },
  {
    key: "counterStrafingRatio",
    label: "Counter-Strafing",
    unit: "%",
    decimals: 0,
  },
  { key: "preaim", label: "Crosshair Placement", unit: "°", decimals: 2 },
  { key: "reactionTimeMs", label: "Time to Damage", unit: " ms", decimals: 0 },
  { key: "flashHitPerFlash", label: "Enemies flashed", unit: "", decimals: 2 },
  {
    key: "flashAvgDuration",
    label: "Average blind time",
    unit: " sec",
    decimals: 1,
  },
  { key: "flashLeadingToKill", label: "Flash Assists", unit: "%", decimals: 0 },
  { key: "heFoesDamageAvg", label: "Average HE damage", unit: "", decimals: 2 },
  {
    key: "utilityOnDeathAvg",
    label: "Average unused utility",
    unit: "",
    prefix: "$",
    decimals: 0,
  },
  {
    key: "ctOpeningSuccess",
    label: "CT Opening Duels Success",
    unit: "%",
    decimals: 0,
  },
  {
    key: "tOpeningSuccess",
    label: "T Opening Duels Success",
    unit: "%",
    decimals: 0,
  },
  {
    key: "tradeKillsSuccess",
    label: "Trade Kills Success",
    unit: "%",
    decimals: 0,
  },
  {
    key: "tradeDeathsSuccess",
    label: "Traded Deaths Success",
    unit: "%",
    decimals: 0,
  },
  { key: "winrate", label: "Win Rate", unit: "%", scale: 100, decimals: 0 },
  { key: "totalMatches", label: "Total matches", unit: "", decimals: 0 },
];

export function formatStat(value: number, field: StatField): string {
  const { decimals, unit, scale = 1, prefix = "" } = field;
  const factor = 10 ** decimals;
  const rounded = Math.round(value * scale * factor) / factor;
  return `${prefix}${rounded}${unit}`;
}

export function formatDelta(value: number, field: StatField): string {
  const formatted = formatStat(value, field);
  return value >= 0 ? `+${formatted}` : formatted;
}
