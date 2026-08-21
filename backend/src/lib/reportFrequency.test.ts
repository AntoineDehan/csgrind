import { describe, it, expect } from "vitest";
import {
  addDays,
  calendarDay,
  FREQUENCY_DAYS,
  nextReportDate,
} from "./reportFrequency";

describe("FREQUENCY_DAYS", () => {
  it("covers the five frequencies offered to the user", () => {
    expect(FREQUENCY_DAYS).toEqual({
      DAYS_2: 2,
      DAYS_5: 5,
      DAYS_7: 7,
      DAYS_14: 14,
      DAYS_30: 30,
    });
  });
});

describe("addDays", () => {
  it("moves the date forward by the given number of days", () => {
    const result = addDays(new Date("2026-01-01T13:00:00.000Z"), 5);

    expect(result.toISOString()).toBe("2026-01-06T13:00:00.000Z");
  });

  it("crosses a month boundary", () => {
    const result = addDays(new Date("2026-01-20T13:00:00.000Z"), 14);

    expect(result.toISOString()).toBe("2026-02-03T13:00:00.000Z");
  });

  it("handles a leap day", () => {
    const result = addDays(new Date("2028-02-28T13:00:00.000Z"), 2);

    expect(result.toISOString()).toBe("2028-03-01T13:00:00.000Z");
  });

  it("does not modify the date it receives", () => {
    const original = new Date("2026-01-01T13:00:00.000Z");

    addDays(original, 30);

    expect(original.toISOString()).toBe("2026-01-01T13:00:00.000Z");
  });

  it("keeps the time of day of the original instant", () => {
    const result = addDays(new Date("2026-01-01T13:42:17.000Z"), 7);

    expect(result.toISOString()).toBe("2026-01-08T13:42:17.000Z");
  });
});

describe("calendarDay", () => {
  it("drops the time of day", () => {
    const result = calendarDay(new Date("2026-01-01T21:47:33.512Z"));

    expect(result.toISOString()).toBe("2026-01-01T12:00:00.000Z");
  });

  it("stamps the day at noon so it renders as the same date in every timezone", () => {
    const result = calendarDay(new Date("2026-01-01T21:47:33.512Z"));

    expect(result.getUTCHours()).toBe(12);
  });

  it("does not modify the date it receives", () => {
    const original = new Date("2026-01-01T21:47:33.512Z");

    calendarDay(original);

    expect(original.toISOString()).toBe("2026-01-01T21:47:33.512Z");
  });

  it("maps every instant of a Paris day to the same stamp", () => {
    const morning = calendarDay(new Date("2026-01-01T00:00:01.000Z"));
    const evening = calendarDay(new Date("2026-01-01T22:59:59.999Z"));

    expect(morning.getTime()).toBe(evening.getTime());
  });

  it("reads the day on the Paris timeline and not in UTC, in winter", () => {
    const beforeMidnightInParis = calendarDay(new Date("2026-01-01T22:30:00.000Z"));
    const afterMidnightInParis = calendarDay(new Date("2026-01-01T23:30:00.000Z"));

    expect(beforeMidnightInParis.toISOString()).toBe("2026-01-01T12:00:00.000Z");
    expect(afterMidnightInParis.toISOString()).toBe("2026-01-02T12:00:00.000Z");
  });

  it("follows the summer offset when daylight saving is in force", () => {
    const beforeMidnightInParis = calendarDay(new Date("2026-07-01T21:30:00.000Z"));
    const afterMidnightInParis = calendarDay(new Date("2026-07-01T22:30:00.000Z"));

    expect(beforeMidnightInParis.toISOString()).toBe("2026-07-01T12:00:00.000Z");
    expect(afterMidnightInParis.toISOString()).toBe("2026-07-02T12:00:00.000Z");
  });
});

describe("nextReportDate", () => {
  it("lands on a day stamp, whatever time the base instant carries", () => {
    const result = nextReportDate(new Date("2026-01-01T21:47:33.512Z"), "DAYS_5");

    expect(result.toISOString()).toBe("2026-01-06T12:00:00.000Z");
  });

  it("gives the same result for two instants of the same Paris day", () => {
    const early = nextReportDate(new Date("2026-01-01T00:30:00.000Z"), "DAYS_7");
    const late = nextReportDate(new Date("2026-01-01T22:30:00.000Z"), "DAYS_7");

    expect(early.getTime()).toBe(late.getTime());
  });

  it("counts from the Paris day for a goal created just after midnight", () => {
    const result = nextReportDate(new Date("2026-01-01T23:30:00.000Z"), "DAYS_5");

    expect(result.toISOString()).toBe("2026-01-07T12:00:00.000Z");
  });

  it("counts the days of the chosen frequency", () => {
    const base = new Date("2026-01-01T13:00:00.000Z");

    expect(nextReportDate(base, "DAYS_2").toISOString()).toBe(
      "2026-01-03T12:00:00.000Z",
    );
    expect(nextReportDate(base, "DAYS_30").toISOString()).toBe(
      "2026-01-31T12:00:00.000Z",
    );
  });
});
