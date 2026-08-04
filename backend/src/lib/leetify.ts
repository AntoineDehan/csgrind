export type LeetifyBan = {
  platform: string;
  platform_nickname: string;
  banned_since: string;
};

export type LeetifyCompetitiveRank = {
  map_name: string;
  rank: number;
};

export type LeetifyRanks = {
  leetify: number;
  premier: number;
  faceit: number;
  faceit_elo: number | null;
  wingman: number;
  renown: number;
  competitive: LeetifyCompetitiveRank[];
};

export type LeetifyRating = {
  aim: number;
  positioning: number;
  utility: number;
  clutch: number;
  opening: number;
  ct_leetify: number;
  t_leetify: number;
};

export type LeetifyStats = {
  accuracy_enemy_spotted: number;
  accuracy_head: number;
  counter_strafing_good_shots_ratio: number;
  ct_opening_aggression_success_rate: number;
  ct_opening_duel_success_percentage: number;
  flashbang_hit_foe_avg_duration: number;
  flashbang_hit_foe_per_flashbang: number;
  flashbang_hit_friend_per_flashbang: number;
  flashbang_leading_to_kill: number;
  flashbang_thrown: number;
  he_foes_damage_avg: number;
  he_friends_damage_avg: number;
  preaim: number;
  reaction_time_ms: number;
  spray_accuracy: number;
  t_opening_aggression_success_rate: number;
  t_opening_duel_success_percentage: number;
  traded_deaths_success_percentage: number;
  trade_kill_opportunities_per_round: number;
  trade_kills_success_percentage: number;
  utility_on_death_avg: number;
};

export type LeetifyRecentMatch = {
  id: string;
  finished_at: string;
  data_source: string;
  outcome: string;
  rank: number;
  rank_type: string | null;
  map_name: string;
  leetify_rating: number;
  score: number[];
  preaim: number;
  reaction_time_ms: number;
  accuracy_enemy_spotted: number;
  accuracy_head: number;
  spray_accuracy: number;
};

export type LeetifyRecentTeammate = {
  steam64_id: string;
  recent_matches_count: number;
};

export type LeetifyProfile = {
  privacy_mode: "public" | "private";
  winrate: number;
  total_matches: number;
  first_match_date: string;
  name: string;
  bans: LeetifyBan[];
  steam64_id: string;
  id: string;
  ranks: LeetifyRanks;
  rating: LeetifyRating;
  stats: LeetifyStats;
  recent_matches: LeetifyRecentMatch[];
  recent_teammates: LeetifyRecentTeammate[];
};

export type LeetifyTeamScore = {
  team_number: number;
  score: number;
};

export type LeetifyMatchPlayerStats = {
  steam64_id: string;
  name: string;
  mvps: number;
  preaim: number;
  reaction_time: number;
  accuracy: number;
  accuracy_enemy_spotted: number;
  accuracy_head: number;
  shots_fired_enemy_spotted: number;
  shots_fired: number;
  shots_hit_enemy_spotted: number;
  shots_hit_friend: number;
  shots_hit_friend_head: number;
  shots_hit_foe: number;
  shots_hit_foe_head: number;
  utility_on_death_avg: number;
  he_foes_damage_avg: number;
  he_friends_damage_avg: number;
  he_thrown: number;
  molotov_thrown: number;
  smoke_thrown: number;
  counter_strafing_shots_all: number;
  counter_strafing_shots_bad: number;
  counter_strafing_shots_good: number;
  counter_strafing_shots_good_ratio: number;
  flashbang_hit_foe: number;
  flashbang_leading_to_kill: number;
  flashbang_hit_foe_avg_duration: number;
  flashbang_hit_friend: number;
  flashbang_thrown: number;
  flash_assist: number;
  score: number;
  initial_team_number: number;
  spray_accuracy: number;
  total_kills: number;
  total_deaths: number;
  kd_ratio: number;
  rounds_survived: number;
  rounds_survived_percentage: number;
  dpr: number;
  total_assists: number;
  total_damage: number;
  leetify_rating: number;
  ct_leetify_rating: number;
  t_leetify_rating: number;
  multi1k: number;
  multi2k: number;
  multi3k: number;
  multi4k: number;
  multi5k: number;
  rounds_count: number;
  rounds_won: number;
  rounds_lost: number;
  total_hs_kills: number;
  trade_kill_opportunities: number;
  trade_kill_attempts: number;
  trade_kills_succeed: number;
  trade_kill_attempts_percentage: number;
  trade_kills_success_percentage: number;
  trade_kill_opportunities_per_round: number;
  traded_death_opportunities: number;
  traded_death_attempts: number;
  traded_deaths_succeed: number;
  traded_death_attempts_percentage: number;
  traded_deaths_success_percentage: number;
  traded_deaths_opportunities_per_round: number;
};

export type LeetifyMatch = {
  id: string;
  finished_at: string;
  data_source: string;
  data_source_match_id: string;
  map_name: string;
  has_banned_player: boolean;
  team_scores: LeetifyTeamScore[];
  stats: LeetifyMatchPlayerStats[];
};

export async function fetchLeetifyProfile(
  steam64Id: string,
): Promise<LeetifyProfile> {
  const res = await fetch(
    `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steam64Id}`,
  );

  if (!res.ok) throw new Error(`Leetify request failed: ${res.status}`);

  return (await res.json()) as LeetifyProfile;
}

export type LeetifyProfileStatus = "exists" | "gone" | "unknown";

export async function checkLeetifyProfileExists(
  steam64Id: string,
): Promise<LeetifyProfileStatus> {
  try {
    const res = await fetch(
      `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steam64Id}`,
    );
    if (res.ok) return "exists";
    if (res.status === 404) return "gone";
    return "unknown";
  } catch {
    return "unknown";
  }
}

export async function fetchLeetifyMatches(
  steam64Id: string,
): Promise<LeetifyMatch[]> {
  const res = await fetch(
    `https://api-public.cs-prod.leetify.com/v3/profile/matches?steam64_id=${steam64Id}`,
  );

  if (!res.ok) throw new Error(`Leetify request failed: ${res.status}`);

  return (await res.json()) as LeetifyMatch[];
}

export async function fetchLeetifyMatch(gameId: string): Promise<LeetifyMatch> {
  const res = await fetch(
    `https://api-public.cs-prod.leetify.com/v2/matches/${gameId}`,
  );

  if (!res.ok) throw new Error(`Leetify request failed: ${res.status}`);

  return (await res.json()) as LeetifyMatch;
}
