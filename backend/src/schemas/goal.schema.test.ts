import { describe, it, expect } from "vitest";
import { createGoalSchema, updateGoalSchema } from "./goal.schema";

const VALID = { matchmaking: "PREMIER", eloGoal: 20000 };

describe("createGoalSchema", () => {
  describe("accepted payloads", () => {
    it("accepts a matchmaking and an elo target alone", () => {
      const result = createGoalSchema.safeParse(VALID);

      expect(result.success).toBe(true);
    });

    it("defers the report frequency to the database default when absent", () => {
      const parsed = createGoalSchema.parse(VALID);

      expect(parsed.reportFrequency).toBeUndefined();
    });

    it("turns an ISO string end date into a Date", () => {
      const parsed = createGoalSchema.parse({
        ...VALID,
        endDate: "2026-12-31T00:00:00.000Z",
      });

      expect(parsed.endDate).toBeInstanceOf(Date);
    });
  });

  describe("values the database enums must never receive", () => {
    it("rejects an unknown matchmaking platform", () => {
      const result = createGoalSchema.safeParse({ ...VALID, matchmaking: "ESEA" });

      expect(result.success).toBe(false);
    });

    it("rejects a report frequency outside the five allowed values", () => {
      const result = createGoalSchema.safeParse({
        ...VALID,
        reportFrequency: "DAYS_3",
      });

      expect(result.success).toBe(false);
    });

    it("rejects a fractional elo target", () => {
      const result = createGoalSchema.safeParse({ ...VALID, eloGoal: 20000.5 });

      expect(result.success).toBe(false);
    });

    it("rejects an elo target sent as a string", () => {
      const result = createGoalSchema.safeParse({ ...VALID, eloGoal: "20000" });

      expect(result.success).toBe(false);
    });
  });

  describe("payload surface", () => {
    it("drops any extra field, so a caller cannot choose its owner", () => {
      const parsed = createGoalSchema.parse({ ...VALID, userId: "someone-else" });

      expect(parsed).toEqual(VALID);
    });

    it("always creates a goal in progress, whatever the caller sends", () => {
      const parsed = createGoalSchema.parse({ ...VALID, status: "completed" });

      expect(parsed).toEqual(VALID);
    });
  });
});

describe("updateGoalSchema", () => {
  it("accepts a status change on its own", () => {
    const result = updateGoalSchema.safeParse({ status: "abandoned" });

    expect(result.success).toBe(true);
  });

  it("rejects an unknown status", () => {
    const result = updateGoalSchema.safeParse({ status: "paused" });

    expect(result.success).toBe(false);
  });

  it("accepts an empty payload", () => {
    const result = updateGoalSchema.safeParse({});

    expect(result.success).toBe(true);
  });
});
