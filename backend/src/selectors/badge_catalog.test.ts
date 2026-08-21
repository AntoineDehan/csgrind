import { describe, it, expect } from "vitest";
import { BADGE_DEFS, type BadgeContext } from "./badge_catalog";
import { makeBadgeContext, makeReport } from "../test/factories";

function ruleFor(name: string) {
  const badge = BADGE_DEFS.find((def) => def.name === name);
  if (!badge) throw new Error(`No badge named "${name}" in the catalog`);
  return (ctx: BadgeContext) => badge.rule(ctx);
}

describe("BADGE_DEFS", () => {
  describe("catalog integrity", () => {
    it("declares 36 badges", () => {
      expect(BADGE_DEFS).toHaveLength(36);
    });

    it("gives every badge a unique name", () => {
      const names = BADGE_DEFS.map((def) => def.name);

      expect(new Set(names).size).toBe(names.length);
    });

    it("gives every badge a description and an icon", () => {
      const incomplete = BADGE_DEFS.filter(
        (def) => def.description.length === 0 || def.icon.length === 0,
      );

      expect(incomplete).toEqual([]);
    });

    it("awards nothing on a pair of empty reports", () => {
      const earned = BADGE_DEFS.filter((def) => def.rule(makeBadgeContext()));

      expect(earned).toEqual([]);
    });
  });

  describe("improvement badges", () => {
    const rule = ruleFor("Improved Aim by 20%");

    it("is earned when a higher-is-better stat gains exactly 20%", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ aimRating: 50 }),
        report: makeReport({ aimRating: 60 }),
      });

      expect(rule(ctx)).toBe(true);
    });

    it("is not earned just below the 20% mark", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ aimRating: 50 }),
        report: makeReport({ aimRating: 59.9 }),
      });

      expect(rule(ctx)).toBe(false);
    });

    it("is not earned on a regression", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ aimRating: 60 }),
        report: makeReport({ aimRating: 50 }),
      });

      expect(rule(ctx)).toBe(false);
    });

    it("reads a lower-is-better stat in the right direction", () => {
      const reactionRule = ruleFor("Improved Reaction time by 20%");
      const ctx = makeBadgeContext({
        previous: makeReport({ reactionTimeMs: 500 }),
        report: makeReport({ reactionTimeMs: 400 }),
      });

      expect(reactionRule(ctx)).toBe(true);
    });

    it("is not earned when a lower-is-better stat rises", () => {
      const reactionRule = ruleFor("Improved Reaction time by 20%");
      const ctx = makeBadgeContext({
        previous: makeReport({ reactionTimeMs: 400 }),
        report: makeReport({ reactionTimeMs: 500 }),
      });

      expect(reactionRule(ctx)).toBe(false);
    });

    it("is not earned when the previous value is zero", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ aimRating: 0 }),
        report: makeReport({ aimRating: 40 }),
      });

      expect(rule(ctx)).toBe(false);
    });

    it("is not earned when either report lacks the stat", () => {
      const missingPrevious = makeBadgeContext({
        previous: makeReport(),
        report: makeReport({ aimRating: 60 }),
      });
      const missingCurrent = makeBadgeContext({
        previous: makeReport({ aimRating: 50 }),
        report: makeReport(),
      });

      expect(rule(missingPrevious)).toBe(false);
      expect(rule(missingCurrent)).toBe(false);
    });

    it("covers 18 stats", () => {
      const improvement = BADGE_DEFS.filter((def) =>
        def.name.startsWith("Improved "),
      );

      expect(improvement).toHaveLength(18);
    });
  });

  describe("winrate badges", () => {
    const rule = ruleFor("Increased winrate by 3 points");

    it("reads points against a winrate stored between 0 and 1", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ winrate: 0.5 }),
        report: makeReport({ winrate: 0.53 }),
      });

      expect(rule(ctx)).toBe(true);
    });

    it("is not earned below the announced number of points", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ winrate: 0.5 }),
        report: makeReport({ winrate: 0.52 }),
      });

      expect(rule(ctx)).toBe(false);
    });

    it("awards every lower tier at the same time as the highest one reached", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ winrate: 0.3 }),
        report: makeReport({ winrate: 0.4 }),
      });
      const earned = BADGE_DEFS.filter(
        (def) => def.name.startsWith("Increased winrate") && def.rule(ctx),
      );

      expect(earned).toHaveLength(3);
    });

    it("is earned when the gain equals the announced points exactly", () => {
      const rule5 = ruleFor("Increased winrate by 5 points");
      const ctx = makeBadgeContext({
        previous: makeReport({ winrate: 0.56 }),
        report: makeReport({ winrate: 0.61 }),
      });

      expect(rule5(ctx)).toBe(true);
    });
  });

  describe("games played badges", () => {
    const rule = ruleFor("Played 10 games");

    it("counts the games played between the two reports", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ totalMatches: 100 }),
        report: makeReport({ totalMatches: 110 }),
      });

      expect(rule(ctx)).toBe(true);
    });

    it("is not earned on a lifetime total alone", () => {
      const ctx = makeBadgeContext({
        previous: makeReport({ totalMatches: 500 }),
        report: makeReport({ totalMatches: 505 }),
      });

      expect(rule(ctx)).toBe(false);
    });
  });

  describe("reaction time badges", () => {
    it("is earned on an absolute value, not on a progression", () => {
      const rule = ruleFor("Reaction time under 600 ms");
      const ctx = makeBadgeContext({
        previous: makeReport({ reactionTimeMs: 590 }),
        report: makeReport({ reactionTimeMs: 599 }),
      });

      expect(rule(ctx)).toBe(true);
    });

    it("is not earned exactly on the threshold", () => {
      const rule = ruleFor("Reaction time under 600 ms");
      const ctx = makeBadgeContext({ report: makeReport({ reactionTimeMs: 600 }) });

      expect(rule(ctx)).toBe(false);
    });

    it("awards all five tiers at once to a fast enough player", () => {
      const ctx = makeBadgeContext({ report: makeReport({ reactionTimeMs: 390 }) });
      const earned = BADGE_DEFS.filter(
        (def) => def.name.startsWith("Reaction time under") && def.rule(ctx),
      );

      expect(earned).toHaveLength(5);
    });
  });

  describe("objective badges", () => {
    it("names the first objective differently from the others", () => {
      const names = BADGE_DEFS.filter((def) =>
        def.name.toLowerCase().includes("objective"),
      ).map((def) => def.name);

      expect(names).toContain("Completed your 1st objective");
      expect(names).not.toContain("Completed 1 objectives");
    });

    it("is earned from the completed objective count", () => {
      const rule = ruleFor("Completed 5 objectives");

      expect(rule(makeBadgeContext({ completedCount: 5 }))).toBe(true);
      expect(rule(makeBadgeContext({ completedCount: 4 }))).toBe(false);
    });

    it("is earned at half of the current objective", () => {
      const rule = ruleFor("Halfway to your objective");

      expect(rule(makeBadgeContext({ percent: 50 }))).toBe(true);
      expect(rule(makeBadgeContext({ percent: 49 }))).toBe(false);
    });
  });

  describe("headshot badge", () => {
    const rule = ruleFor("Reached 50% headshots");

    it("reads the headshot accuracy as a percentage", () => {
      expect(rule(makeBadgeContext({ report: makeReport({ accuracyHead: 50 }) }))).toBe(
        true,
      );
      expect(rule(makeBadgeContext({ report: makeReport({ accuracyHead: 49 }) }))).toBe(
        false,
      );
    });
  });
});
