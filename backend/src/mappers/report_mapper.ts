import type { LeetifyProfile } from "../lib/leetify";
import type { CreateReportInput } from "../schemas/report.schema";

export function mapProfileToReport(
  profile: LeetifyProfile,
  goalId: string,
): CreateReportInput {
  return {
    goalId,

    aimRating: profile.rating.aim,
    utilityRating: profile.rating.utility,
    positioningRating: profile.rating.positioning,
    leetifyRating: profile.ranks.leetify,

    premierRank: profile.ranks.premier,
    faceitRank: profile.ranks.faceit_elo ?? undefined,

    accuracyHead: profile.stats.accuracy_head,
    accuracyEnemySpotted: profile.stats.accuracy_enemy_spotted,
    sprayAccuracy: profile.stats.spray_accuracy,
    counterStrafingRatio: profile.stats.counter_strafing_good_shots_ratio,
    preaim: profile.stats.preaim,
    reactionTimeMs: profile.stats.reaction_time_ms,

    flashHitPerFlash: profile.stats.flashbang_hit_foe_per_flashbang,
    flashAvgDuration: profile.stats.flashbang_hit_foe_avg_duration,
    flashLeadingToKill: profile.stats.flashbang_leading_to_kill,
    heFoesDamageAvg: profile.stats.he_foes_damage_avg,
    utilityOnDeathAvg: profile.stats.utility_on_death_avg,

    ctOpeningSuccess: profile.stats.ct_opening_duel_success_percentage,
    tOpeningSuccess: profile.stats.t_opening_duel_success_percentage,
    tradeKillsSuccess: profile.stats.trade_kills_success_percentage,
    tradeDeathsSuccess: profile.stats.traded_deaths_success_percentage,

    winrate: profile.winrate,
    totalMatches: profile.total_matches,
  };
}
