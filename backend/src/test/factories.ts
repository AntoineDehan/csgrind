import type { Report, Task, Tip } from "../../generated/prisma/client";
import type { StatKey } from "../comparators/report_comparator";
import type { BadgeContext } from "../selectors/badge_catalog";
import type { LeetifyProfile } from "../lib/leetify";

type ReportOverrides = Partial<Record<StatKey | "totalMatches", number | null>> & {
  id?: string;
  createdAt?: Date;
  goalId?: string;
};

const BASE_REPORT = {
  id: "report-1",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  goalId: "goal-1",
  aimRating: null,
  utilityRating: null,
  positioningRating: null,
  leetifyRating: null,
  premierRank: null,
  faceitRank: null,
  accuracyHead: null,
  accuracyEnemySpotted: null,
  sprayAccuracy: null,
  counterStrafingRatio: null,
  preaim: null,
  reactionTimeMs: null,
  flashHitPerFlash: null,
  flashAvgDuration: null,
  flashLeadingToKill: null,
  heFoesDamageAvg: null,
  utilityOnDeathAvg: null,
  ctOpeningSuccess: null,
  tOpeningSuccess: null,
  tradeKillsSuccess: null,
  tradeDeathsSuccess: null,
  winrate: null,
  totalMatches: null,
};

export function makeReport(overrides: ReportOverrides = {}): Report {
  return { ...BASE_REPORT, ...overrides } as unknown as Report;
}

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    content: "Play a deathmatch warm-up",
    isTrackable: false,
    taskStat: null,
    trackMap: null,
    ...overrides,
  };
}

export function makeTip(overrides: Partial<Tip> = {}): Tip {
  return {
    id: "tip-1",
    category: "aimRating",
    priority: 1,
    content: "Warm up before playing",
    ...overrides,
  };
}

export function makeBadgeContext(
  overrides: Partial<BadgeContext> = {},
): BadgeContext {
  return {
    previous: makeReport(),
    report: makeReport(),
    percent: 0,
    completedCount: 0,
    ...overrides,
  };
}

export function makeLeetifyProfile(): LeetifyProfile {
  return {
    privacy_mode: "public",
    winrate: 0.61,
    total_matches: 142,
    first_match_date: "2025-02-11T18:04:00.000Z",
    name: "player",
    bans: [],
    steam64_id: "76561198000000001",
    id: "leetify-1",
    ranks: {
      leetify: 1.11,
      premier: 12345,
      faceit: 8,
      faceit_elo: 1987,
      wingman: 9,
      renown: 3,
      competitive: [],
    },
    rating: {
      aim: 61.1,
      positioning: 62.2,
      utility: 63.3,
      clutch: 64.4,
      opening: 65.5,
      ct_leetify: 66.6,
      t_leetify: 67.7,
    },
    stats: {
      accuracy_enemy_spotted: 31.1,
      accuracy_head: 32.2,
      counter_strafing_good_shots_ratio: 33.3,
      ct_opening_aggression_success_rate: 34.4,
      ct_opening_duel_success_percentage: 35.5,
      flashbang_hit_foe_avg_duration: 1.36,
      flashbang_hit_foe_per_flashbang: 0.37,
      flashbang_hit_friend_per_flashbang: 0.38,
      flashbang_leading_to_kill: 39.9,
      flashbang_thrown: 40,
      he_foes_damage_avg: 41.1,
      he_friends_damage_avg: 42.2,
      preaim: 4.33,
      reaction_time_ms: 544,
      spray_accuracy: 45.5,
      t_opening_aggression_success_rate: 46.6,
      t_opening_duel_success_percentage: 47.7,
      traded_deaths_success_percentage: 48.8,
      trade_kill_opportunities_per_round: 0.49,
      trade_kills_success_percentage: 50.5,
      utility_on_death_avg: 151,
    },
    recent_matches: [],
    recent_teammates: [],
  };
}
