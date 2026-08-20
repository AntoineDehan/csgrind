import { describe, it, expect } from "vitest";
import { selectTips } from "./tip_selector";
import { makeReport, makeTip } from "../test/factories";
import type { StatKey } from "../comparators/report_comparator";

const RULES: { stat: StatKey; threshold: number; triggers: number; ignores: number }[] = [
  { stat: "aimRating", threshold: 55, triggers: 54, ignores: 56 },
  { stat: "utilityRating", threshold: 55, triggers: 54, ignores: 56 },
  { stat: "positioningRating", threshold: 55, triggers: 54, ignores: 56 },
  { stat: "accuracyHead", threshold: 20, triggers: 19, ignores: 21 },
  { stat: "accuracyEnemySpotted", threshold: 30, triggers: 29, ignores: 31 },
  { stat: "sprayAccuracy", threshold: 30, triggers: 29, ignores: 31 },
  { stat: "counterStrafingRatio", threshold: 50, triggers: 49, ignores: 51 },
  { stat: "preaim", threshold: 8, triggers: 9, ignores: 7 },
  { stat: "reactionTimeMs", threshold: 700, triggers: 701, ignores: 699 },
  { stat: "flashHitPerFlash", threshold: 0.5, triggers: 0.4, ignores: 0.6 },
  { stat: "flashAvgDuration", threshold: 1, triggers: 0.9, ignores: 1.1 },
  { stat: "flashLeadingToKill", threshold: 10, triggers: 9, ignores: 11 },
  { stat: "heFoesDamageAvg", threshold: 10, triggers: 9, ignores: 11 },
  { stat: "utilityOnDeathAvg", threshold: 200, triggers: 201, ignores: 199 },
  { stat: "ctOpeningSuccess", threshold: 50, triggers: 49, ignores: 51 },
  { stat: "tOpeningSuccess", threshold: 50, triggers: 49, ignores: 51 },
  { stat: "tradeKillsSuccess", threshold: 20, triggers: 19, ignores: 21 },
  { stat: "tradeDeathsSuccess", threshold: 50, triggers: 49, ignores: 51 },
];

const CATALOG = RULES.map((rule) =>
  makeTip({ id: `tip-${rule.stat}`, category: rule.stat }),
);

describe("selectTips", () => {
  describe("thresholds", () => {
    it.each(RULES)(
      "$stat triggers a tip below $threshold and stays silent above",
      ({ stat, triggers, ignores }) => {
        const triggering = selectTips(makeReport({ [stat]: triggers }), CATALOG);
        const quiet = selectTips(makeReport({ [stat]: ignores }), CATALOG);

        expect(triggering).toEqual([`tip-${stat}`]);
        expect(quiet).toEqual([]);
      },
    );

    it.each(RULES)(
      "$stat stays silent exactly on its threshold of $threshold",
      ({ stat, threshold }) => {
        const tips = selectTips(makeReport({ [stat]: threshold }), CATALOG);

        expect(tips).toEqual([]);
      },
    );
  });

  describe("selection", () => {
    it("returns one tip per triggered rule", () => {
      const report = makeReport({ aimRating: 40, preaim: 12, winrate: 0.2 });

      const tips = selectTips(report, CATALOG);

      expect(tips).toHaveLength(2);
    });

    it("ignores a stat missing from the report", () => {
      const tips = selectTips(makeReport(), CATALOG);

      expect(tips).toEqual([]);
    });

    it("skips a triggered rule that has no tip in its category", () => {
      const report = makeReport({ aimRating: 40, preaim: 12 });
      const partialCatalog = [makeTip({ id: "tip-preaim", category: "preaim" })];

      const tips = selectTips(report, partialCatalog);

      expect(tips).toEqual(["tip-preaim"]);
    });

    it("never returns a tip for a stat that has no rule", () => {
      const report = makeReport({ leetifyRating: 0, totalMatches: 0 });
      const catalog = [
        makeTip({ id: "tip-leetify", category: "leetifyRating" }),
        makeTip({ id: "tip-matches", category: "totalMatches" }),
      ];

      const tips = selectTips(report, catalog);

      expect(tips).toEqual([]);
    });

    it("picks a tip belonging to the triggered category when several exist", () => {
      const report = makeReport({ aimRating: 40 });
      const catalog = [
        makeTip({ id: "aim-a", category: "aimRating" }),
        makeTip({ id: "aim-b", category: "aimRating" }),
        makeTip({ id: "other", category: "preaim" }),
      ];

      const tips = selectTips(report, catalog);

      expect(tips).toHaveLength(1);
      expect(["aim-a", "aim-b"]).toContain(tips[0]);
    });
  });
});
