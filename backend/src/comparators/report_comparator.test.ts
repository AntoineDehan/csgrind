import { describe, it, expect } from "vitest";
import { compareReports, STAT_DIRECTION } from "./report_comparator";
import { makeReport } from "../test/factories";

describe("STAT_DIRECTION", () => {
  it("declares a direction for 22 of the 23 stored stats", () => {
    expect(Object.keys(STAT_DIRECTION)).toHaveLength(22);
  });

  it("does not declare a direction for totalMatches", () => {
    expect(STAT_DIRECTION).not.toHaveProperty("totalMatches");
  });

  it("lists exactly the three stats where a lower value is better", () => {
    const lower = Object.entries(STAT_DIRECTION)
      .filter(([, direction]) => direction === "lower")
      .map(([stat]) => stat);

    expect(lower).toEqual(["preaim", "reactionTimeMs", "utilityOnDeathAvg"]);
  });
});

describe("compareReports", () => {
  describe("direction of improvement", () => {
    it("marks an improvement when a higher-is-better stat increases", () => {
      const previous = makeReport({ aimRating: 50 });
      const current = makeReport({ aimRating: 60 });

      const [delta] = compareReports(previous, current);

      expect(delta?.improved).toBe(true);
    });

    it("marks a regression when a higher-is-better stat decreases", () => {
      const previous = makeReport({ aimRating: 60 });
      const current = makeReport({ aimRating: 50 });

      const [delta] = compareReports(previous, current);

      expect(delta?.improved).toBe(false);
    });

    it("marks an improvement when a lower-is-better stat decreases", () => {
      const previous = makeReport({ reactionTimeMs: 700 });
      const current = makeReport({ reactionTimeMs: 600 });

      const [delta] = compareReports(previous, current);

      expect(delta?.improved).toBe(true);
    });

    it("marks a regression when a lower-is-better stat increases", () => {
      const previous = makeReport({ reactionTimeMs: 600 });
      const current = makeReport({ reactionTimeMs: 700 });

      const [delta] = compareReports(previous, current);

      expect(delta?.improved).toBe(false);
    });

    it("marks a stat as not improved when it does not move", () => {
      const previous = makeReport({ winrate: 0.5 });
      const current = makeReport({ winrate: 0.5 });

      const [delta] = compareReports(previous, current);

      expect(delta?.delta).toBe(0);
      expect(delta?.improved).toBe(false);
    });
  });

  describe("shape of the result", () => {
    it("returns the previous value, the current value and the delta", () => {
      const previous = makeReport({ accuracyHead: 18 });
      const current = makeReport({ accuracyHead: 24.5 });

      const deltas = compareReports(previous, current);

      expect(deltas).toEqual([
        {
          stat: "accuracyHead",
          previous: 18,
          current: 24.5,
          delta: 6.5,
          improved: true,
        },
      ]);
    });

    it("returns one entry per comparable stat", () => {
      const previous = makeReport({ aimRating: 50, preaim: 9, winrate: 0.4 });
      const current = makeReport({ aimRating: 55, preaim: 7, winrate: 0.5 });

      const deltas = compareReports(previous, current);

      expect(deltas.map((d) => d.stat)).toEqual([
        "aimRating",
        "preaim",
        "winrate",
      ]);
    });
  });

  describe("missing values", () => {
    it("skips a stat absent from the previous report", () => {
      const previous = makeReport({ aimRating: null });
      const current = makeReport({ aimRating: 60 });

      const deltas = compareReports(previous, current);

      expect(deltas).toEqual([]);
    });

    it("skips a stat absent from the current report", () => {
      const previous = makeReport({ aimRating: 50 });
      const current = makeReport({ aimRating: null });

      const deltas = compareReports(previous, current);

      expect(deltas).toEqual([]);
    });

    it("returns an empty list when no stat can be compared", () => {
      const deltas = compareReports(makeReport(), makeReport());

      expect(deltas).toEqual([]);
    });
  });

  describe("scope of the comparison", () => {
    it("ignores totalMatches, which is stored but not compared", () => {
      const previous = makeReport({ totalMatches: 100, aimRating: 50 });
      const current = makeReport({ totalMatches: 150, aimRating: 55 });

      const deltas = compareReports(previous, current);

      expect(deltas.map((d) => d.stat)).toEqual(["aimRating"]);
    });
  });

  describe("decimal precision", () => {
    it("keeps the delta accurate on fractional stats", () => {
      const previous = makeReport({ preaim: 8.5 });
      const current = makeReport({ preaim: 7.2 });

      const [delta] = compareReports(previous, current);

      expect(delta?.delta).toBeCloseTo(-1.3, 4);
      expect(delta?.improved).toBe(true);
    });
  });
});
