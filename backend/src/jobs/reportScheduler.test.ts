import { describe, it, expect } from "vitest";
import { isGoalDue } from "./reportScheduler";
import type { ReportFrequency } from "../../generated/prisma/enums";

type DueGoal = Parameters<typeof isGoalDue>[0];

function makeDueGoal(overrides: Partial<DueGoal> = {}): DueGoal {
  return {
    id: "goal-1",
    userId: "user-1",
    email: "player@example.com",
    createdAt: new Date("2026-01-01T13:00:00.000Z"),
    reportFrequency: "DAYS_5" as ReportFrequency,
    lastReportAt: null,
    ...overrides,
  };
}

describe("isGoalDue", () => {
  describe("a goal that has never been reported", () => {
    it("becomes due one frequency interval after its creation", () => {
      const goal = makeDueGoal({
        createdAt: new Date("2026-01-01T13:00:00.000Z"),
        reportFrequency: "DAYS_5" as ReportFrequency,
      });

      const now = new Date("2026-01-06T13:00:00.000Z");

      expect(isGoalDue(goal, now)).toBe(true);
    });

    it("is not due the day before its interval elapses", () => {
      const goal = makeDueGoal({
        createdAt: new Date("2026-01-01T13:00:00.000Z"),
        reportFrequency: "DAYS_5" as ReportFrequency,
      });

      const now = new Date("2026-01-05T13:00:00.000Z");

      expect(isGoalDue(goal, now)).toBe(false);
    });

    it("uses the frequency chosen on the goal", () => {
      const now = new Date("2026-01-03T13:00:00.000Z");
      const fast = makeDueGoal({ reportFrequency: "DAYS_2" as ReportFrequency });
      const slow = makeDueGoal({ reportFrequency: "DAYS_30" as ReportFrequency });

      expect(isGoalDue(fast, now)).toBe(true);
      expect(isGoalDue(slow, now)).toBe(false);
    });
  });

  describe("a goal that already has reports", () => {
    it("counts from the last report and not from the goal creation", () => {
      const goal = makeDueGoal({
        createdAt: new Date("2026-01-01T13:00:00.000Z"),
        lastReportAt: new Date("2026-01-10T13:00:00.000Z"),
        reportFrequency: "DAYS_5" as ReportFrequency,
      });

      const now = new Date("2026-01-13T13:00:00.000Z");

      expect(isGoalDue(goal, now)).toBe(false);
    });

    it("becomes due one interval after the last report", () => {
      const goal = makeDueGoal({
        lastReportAt: new Date("2026-01-10T13:00:00.000Z"),
        reportFrequency: "DAYS_5" as ReportFrequency,
      });

      const now = new Date("2026-01-15T13:00:00.000Z");

      expect(isGoalDue(goal, now)).toBe(true);
    });

    it("stays due once the interval has been exceeded", () => {
      const goal = makeDueGoal({
        lastReportAt: new Date("2026-01-10T13:00:00.000Z"),
        reportFrequency: "DAYS_5" as ReportFrequency,
      });

      const now = new Date("2026-01-25T13:00:00.000Z");

      expect(isGoalDue(goal, now)).toBe(true);
    });
  });

  describe("running from the daily scheduler", () => {
    it("is due on the run that follows the elapsed interval", () => {
      const goal = makeDueGoal({
        lastReportAt: new Date("2026-01-10T13:00:04.512Z"),
        reportFrequency: "DAYS_2" as ReportFrequency,
      });

      const now = new Date("2026-01-12T13:00:00.180Z");

      expect(isGoalDue(goal, now)).toBe(true);
    });

    it("is still not due one run too early", () => {
      const goal = makeDueGoal({
        lastReportAt: new Date("2026-01-10T13:00:04.512Z"),
        reportFrequency: "DAYS_2" as ReportFrequency,
      });

      const now = new Date("2026-01-11T13:00:00.180Z");

      expect(isGoalDue(goal, now)).toBe(false);
    });

    it("does not care how long the previous run took to write the report", () => {
      const quick = makeDueGoal({
        lastReportAt: new Date("2026-01-10T13:00:01.000Z"),
        reportFrequency: "DAYS_5" as ReportFrequency,
      });
      const slow = makeDueGoal({
        lastReportAt: new Date("2026-01-10T13:07:42.000Z"),
        reportFrequency: "DAYS_5" as ReportFrequency,
      });

      const now = new Date("2026-01-15T13:00:00.000Z");

      expect(isGoalDue(quick, now)).toBe(true);
      expect(isGoalDue(slow, now)).toBe(true);
    });

    it("gives the first report a full interval after a goal created in the evening", () => {
      const goal = makeDueGoal({
        createdAt: new Date("2026-01-01T20:47:00.000Z"),
        lastReportAt: null,
        reportFrequency: "DAYS_5" as ReportFrequency,
      });

      expect(isGoalDue(goal, new Date("2026-01-05T13:00:00.000Z"))).toBe(false);
      expect(isGoalDue(goal, new Date("2026-01-06T13:00:00.000Z"))).toBe(true);
    });

    it("counts from the Paris day for a goal created just after midnight", () => {
      const goal = makeDueGoal({
        createdAt: new Date("2026-01-01T23:30:00.000Z"),
        lastReportAt: null,
        reportFrequency: "DAYS_5" as ReportFrequency,
      });

      expect(isGoalDue(goal, new Date("2026-01-06T13:00:00.000Z"))).toBe(false);
      expect(isGoalDue(goal, new Date("2026-01-07T13:00:00.000Z"))).toBe(true);
    });
  });
});
