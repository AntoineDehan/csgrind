import { describe, it, expect } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  describe("missing values", () => {
    it("shows a dash when there is no date", () => {
      expect(formatDate(undefined)).toBe("—");
    });

    it("shows a dash for an empty string", () => {
      expect(formatDate("")).toBe("—");
    });
  });

  describe("formatting", () => {
    it("writes the month as a short english name", () => {
      expect(formatDate("2026-01-06T12:00:00.000Z")).toBe("Jan 6, 2026");
    });

    it("does not pad the day number", () => {
      expect(formatDate("2026-11-30T12:00:00.000Z")).toBe("Nov 30, 2026");
      expect(formatDate("2026-11-02T12:00:00.000Z")).toBe("Nov 2, 2026");
    });
  });

  describe("malformed values", () => {
    it("renders Invalid Date rather than a dash", () => {
      expect(formatDate("not-a-date")).toBe("Invalid Date");
    });
  });
});
