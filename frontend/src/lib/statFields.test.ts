import { describe, it, expect } from "vitest";
import {
  formatDelta,
  formatStat,
  STAT_FIELDS,
  type StatField,
} from "./statFields";

function fieldFor(key: string): StatField {
  const field = STAT_FIELDS.find((entry) => entry.key === key);
  if (!field) throw new Error(`No stat field declared for "${key}"`);
  return field;
}

describe("STAT_FIELDS", () => {
  it("declares one field per stored stat", () => {
    expect(STAT_FIELDS).toHaveLength(23);
  });

  it("declares each stat only once", () => {
    const keys = STAT_FIELDS.map((field) => field.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it("scales only the winrate, which is the only stat stored as a ratio", () => {
    const scaled = STAT_FIELDS.filter((field) => field.scale !== undefined);

    expect(scaled.map((field) => field.key)).toEqual(["winrate"]);
  });

  it("prefixes only the unused utility, which is a money amount", () => {
    const prefixed = STAT_FIELDS.filter((field) => field.prefix !== undefined);

    expect(prefixed.map((field) => field.key)).toEqual(["utilityOnDeathAvg"]);
  });
});

describe("formatStat", () => {
  it("rounds to the declared number of decimals", () => {
    expect(formatStat(1.11666, fieldFor("leetifyRating"))).toBe("1.12");
  });

  it("rounds to a whole number when no decimal is declared", () => {
    expect(formatStat(61.6, fieldFor("aimRating"))).toBe("62");
  });

  it("appends the unit", () => {
    expect(formatStat(32.2, fieldFor("accuracyHead"))).toBe("32%");
    expect(formatStat(4.333, fieldFor("preaim"))).toBe("4.33°");
  });

  it("keeps the space of a unit that needs one", () => {
    expect(formatStat(544.4, fieldFor("reactionTimeMs"))).toBe("544 ms");
  });

  it("turns the stored winrate ratio into a percentage", () => {
    expect(formatStat(0.5432, fieldFor("winrate"))).toBe("54%");
    expect(formatStat(1, fieldFor("winrate"))).toBe("100%");
  });

  it("puts the prefix before the value", () => {
    expect(formatStat(151.4, fieldFor("utilityOnDeathAvg"))).toBe("$151");
  });

  it("formats a zero", () => {
    expect(formatStat(0, fieldFor("accuracyHead"))).toBe("0%");
  });

  it("drops trailing zeros instead of padding to the declared decimals", () => {
    expect(formatStat(1.1, fieldFor("leetifyRating"))).toBe("1.1");
    expect(formatStat(1, fieldFor("leetifyRating"))).toBe("1");
  });
});

describe("formatDelta", () => {
  it("marks a positive delta with a plus sign", () => {
    expect(formatDelta(5.2, fieldFor("accuracyHead"))).toBe("+5%");
  });

  it("keeps the minus sign of a negative delta", () => {
    expect(formatDelta(-5.2, fieldFor("accuracyHead"))).toBe("-5%");
  });

  it("marks an unchanged stat with a plus sign", () => {
    expect(formatDelta(0, fieldFor("accuracyHead"))).toBe("+0%");
  });

  it("loses the sign of a negative delta that rounds to zero", () => {
    expect(formatDelta(-0.4, fieldFor("accuracyHead"))).toBe("0%");
  });

  it("puts the money prefix before the minus sign", () => {
    expect(formatDelta(-151, fieldFor("utilityOnDeathAvg"))).toBe("$-151");
  });

  it("rounds a negative half towards zero and a positive half away from it", () => {
    expect(formatDelta(-1.5, fieldFor("aimRating"))).toBe("-1");
    expect(formatDelta(1.5, fieldFor("aimRating"))).toBe("+2");
  });
});
