import { describe, it, expect } from "vitest";
import {
  selectChallenges,
  selectManualTasks,
  MANUAL_TASK_COUNT,
  CHALLENGE_SLOTS,
} from "./task_selector";
import type { StatDelta, StatKey } from "../comparators/report_comparator";
import { makeReport, makeTask } from "../test/factories";

function makeDelta(
  stat: StatKey,
  previous: number,
  current: number,
  improved = false,
): StatDelta {
  return { stat, previous, current, delta: current - previous, improved };
}

function trackableFor(stat: StatKey) {
  return makeTask({ id: `task-${stat}`, isTrackable: true, taskStat: stat });
}

describe("selectManualTasks", () => {
  it("returns at most MANUAL_TASK_COUNT tasks", () => {
    const pool = Array.from({ length: 12 }, (_, i) =>
      makeTask({ id: `manual-${i}` }),
    );

    const selected = selectManualTasks(pool);

    expect(selected).toHaveLength(MANUAL_TASK_COUNT);
  });

  it("never returns a trackable task", () => {
    const pool = [
      makeTask({ id: "manual-1" }),
      trackableFor("aimRating"),
      trackableFor("preaim"),
    ];

    const selected = selectManualTasks(pool);

    expect(selected).toEqual(["manual-1"]);
  });

  it("returns the whole pool when it is smaller than the quota", () => {
    const pool = [makeTask({ id: "a" }), makeTask({ id: "b" })];

    const selected = selectManualTasks(pool);

    expect([...selected].sort()).toEqual(["a", "b"]);
  });

  it("returns no duplicate", () => {
    const pool = Array.from({ length: 8 }, (_, i) =>
      makeTask({ id: `manual-${i}` }),
    );

    const selected = selectManualTasks(pool);

    expect(new Set(selected).size).toBe(selected.length);
  });

  it("returns nothing when every task is trackable", () => {
    const selected = selectManualTasks([trackableFor("aimRating")]);

    expect(selected).toEqual([]);
  });
});

describe("selectChallenges", () => {
  describe("eligibility", () => {
    it("returns nothing when no slot is available", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 100, 90)],
        [trackableFor("aimRating")],
        0,
        makeReport({ aimRating: 90 }),
        new Set(),
      );

      expect(challenges).toEqual([]);
    });

    it("ignores a stat that improved", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 90, 100, true)],
        [trackableFor("aimRating")],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 100 }),
        new Set(),
      );

      expect(challenges).toEqual([]);
    });

    it("ignores a stat with no trackable task attached", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 100, 90)],
        [makeTask({ id: "manual-1" })],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 90 }),
        new Set(),
      );

      expect(challenges).toEqual([]);
    });

    it("ignores a stat already covered by an active challenge", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 100, 90)],
        [trackableFor("aimRating")],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 90 }),
        new Set(["aimRating"]),
      );

      expect(challenges).toEqual([]);
    });

    it("ignores a stat missing from the current report", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 100, 90)],
        [trackableFor("aimRating")],
        CHALLENGE_SLOTS,
        makeReport(),
        new Set(),
      );

      expect(challenges).toEqual([]);
    });

    it("ignores a stat whose current value is zero", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 100, 0)],
        [trackableFor("aimRating")],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 0 }),
        new Set(),
      );

      expect(challenges).toEqual([]);
    });

    it("ignores a stat whose previous value is zero", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 0, 5)],
        [trackableFor("aimRating")],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 5 }),
        new Set(),
      );

      expect(challenges).toEqual([]);
    });
  });

  describe("priority", () => {
    it("prefers the stat that regressed the most relative to itself", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 100, 90), makeDelta("preaim", 10, 12)],
        [trackableFor("aimRating"), trackableFor("preaim")],
        1,
        makeReport({ aimRating: 90, preaim: 12 }),
        new Set(),
      );

      expect(challenges.map((c) => c.taskId)).toEqual(["task-preaim"]);
    });

    it("never returns more challenges than the available slots", () => {
      const challenges = selectChallenges(
        [
          makeDelta("aimRating", 100, 90),
          makeDelta("preaim", 10, 12),
          makeDelta("sprayAccuracy", 40, 30),
        ],
        [
          trackableFor("aimRating"),
          trackableFor("preaim"),
          trackableFor("sprayAccuracy"),
        ],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 90, preaim: 12, sprayAccuracy: 30 }),
        new Set(),
      );

      expect(challenges).toHaveLength(CHALLENGE_SLOTS);
    });

    it("does not pick the same stat twice", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 100, 90)],
        [
          makeTask({ id: "aim-a", isTrackable: true, taskStat: "aimRating" }),
          makeTask({ id: "aim-b", isTrackable: true, taskStat: "aimRating" }),
        ],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 90 }),
        new Set(),
      );

      expect(challenges).toHaveLength(1);
    });

    it("records the picked stat in the exclusion set given by the caller", () => {
      const excludeStats = new Set<string>();

      selectChallenges(
        [makeDelta("aimRating", 100, 90)],
        [trackableFor("aimRating")],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 90 }),
        excludeStats,
      );

      expect(excludeStats.has("aimRating")).toBe(true);
    });
  });

  describe("target computation", () => {
    it("asks for 5% more on a higher-is-better stat", () => {
      const [challenge] = selectChallenges(
        [makeDelta("aimRating", 100, 50)],
        [trackableFor("aimRating")],
        1,
        makeReport({ aimRating: 50 }),
        new Set(),
      );

      expect(challenge?.trackCurrent).toBe(50);
      expect(challenge?.trackTarget).toBeCloseTo(52.5, 4);
    });

    it("asks for 5% less on a lower-is-better stat", () => {
      const [challenge] = selectChallenges(
        [makeDelta("reactionTimeMs", 500, 600)],
        [trackableFor("reactionTimeMs")],
        1,
        makeReport({ reactionTimeMs: 600 }),
        new Set(),
      );

      expect(challenge?.trackTarget).toBeCloseTo(570, 4);
    });

    it.each([
      { stat: "sprayAccuracy" as StatKey, current: 40, target: 44 },
      { stat: "accuracyHead" as StatKey, current: 20, target: 22 },
      { stat: "flashLeadingToKill" as StatKey, current: 10, target: 11 },
      { stat: "utilityOnDeathAvg" as StatKey, current: 200, target: 180 },
    ])(
      "asks for a 10% move on $stat instead of the default 5%",
      ({ stat, current, target }) => {
        const [challenge] = selectChallenges(
          [makeDelta(stat, current * 2, current)],
          [trackableFor(stat)],
          1,
          makeReport({ [stat]: current }),
          new Set(),
        );

        expect(challenge?.trackTarget).toBeCloseTo(target, 4);
      },
    );
  });

  describe("stats that did not move", () => {
    it("treats a flat stat as eligible for a challenge", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 50, 50)],
        [trackableFor("aimRating")],
        CHALLENGE_SLOTS,
        makeReport({ aimRating: 50 }),
        new Set(),
      );

      expect(challenges).toHaveLength(1);
    });

    it("ranks a flat stat below any actual regression", () => {
      const challenges = selectChallenges(
        [makeDelta("aimRating", 50, 50), makeDelta("preaim", 10, 11)],
        [trackableFor("aimRating"), trackableFor("preaim")],
        1,
        makeReport({ aimRating: 50, preaim: 11 }),
        new Set(),
      );

      expect(challenges.map((c) => c.taskId)).toEqual(["task-preaim"]);
    });
  });
});
