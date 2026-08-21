import { describe, it, expect } from "vitest";
import { mapProfileToReport } from "./report_mapper";
import { makeLeetifyProfile } from "../test/factories";

describe("mapProfileToReport", () => {
  it("maps every stored field to its Leetify source", () => {
    const profile = makeLeetifyProfile();

    const input = mapProfileToReport(profile, "goal-42");

    expect(input).toEqual({
      goalId: "goal-42",
      aimRating: 61.1,
      utilityRating: 63.3,
      positioningRating: 62.2,
      leetifyRating: 1.11,
      premierRank: 12345,
      faceitRank: 1987,
      accuracyHead: 32.2,
      accuracyEnemySpotted: 31.1,
      sprayAccuracy: 45.5,
      counterStrafingRatio: 33.3,
      preaim: 4.33,
      reactionTimeMs: 544,
      flashHitPerFlash: 0.37,
      flashAvgDuration: 1.36,
      flashLeadingToKill: 39.9,
      heFoesDamageAvg: 41.1,
      utilityOnDeathAvg: 151,
      ctOpeningSuccess: 35.5,
      tOpeningSuccess: 47.7,
      tradeKillsSuccess: 50.5,
      tradeDeathsSuccess: 48.8,
      winrate: 0.61,
      totalMatches: 142,
    });
  });

  it("produces the 23 stored stats plus the goal reference", () => {
    const input = mapProfileToReport(makeLeetifyProfile(), "goal-1");

    expect(Object.keys(input)).toHaveLength(24);
  });

  it("leaves the faceit rank undefined for a player without faceit elo", () => {
    const profile = makeLeetifyProfile();
    profile.ranks.faceit_elo = null;

    const input = mapProfileToReport(profile, "goal-1");

    expect(input.faceitRank).toBeUndefined();
  });

  it("does not read the leetify rating from the rating block", () => {
    const profile = makeLeetifyProfile();
    profile.ranks.leetify = 1.5;

    const input = mapProfileToReport(profile, "goal-1");

    expect(input.leetifyRating).toBe(1.5);
  });
});
