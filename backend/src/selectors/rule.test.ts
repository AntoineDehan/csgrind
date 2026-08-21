import { describe, it, expect } from "vitest";
import { matches } from "./rule";

describe("matches", () => {
  describe("lt", () => {
    it("return true when the value is under the threshold", () => {
      const result = matches(40, "lt", 55);

      expect(result).toBe(true);
    });

    it("return false when the value equals the threshold", () => {
      const result = matches(55, "lt", 55);

      expect(result).toBe(false);
    });

    it("return false when the value is above the threshold", () => {
      const result = matches(70, "lt", 55);

      expect(result).toBe(false);
    });
  });

  describe("lte", () => {
    it("return true when the value is under the threshold", () => {
      const result = matches(40, "lte", 55);

      expect(result).toBe(true);
    });

    it("return true when the value equals the threshold", () => {
      const result = matches(55, "lte", 55);

      expect(result).toBe(true);
    });

    it("return false when the value is above the threshold", () => {
      const result = matches(70, "lte", 55);

      expect(result).toBe(false);
    });
  });

  describe("gt", () => {
    it("return true when the value is above the threshold", () => {
      const result = matches(55, "gt", 40);

      expect(result).toBe(true);
    });

    it("return false when the value equals the threshold", () => {
      const result = matches(40, "gt", 40);

      expect(result).toBe(false);
    });

    it("return false when the value is under the threshold", () => {
      const result = matches(20, "gt", 40);

      expect(result).toBe(false);
    });
  });

  describe("gte", () => {
    it("return true when the value is above the threshold", () => {
      const result = matches(55, "gte", 40);

      expect(result).toBe(true);
    });

    it("return true when the value equals the threshold", () => {
      const result = matches(40, "gte", 40);

      expect(result).toBe(true);
    });

    it("return false when the value is under the threshold", () => {
      const result = matches(20, "gte", 40);

      expect(result).toBe(false);
    });
  });
});
