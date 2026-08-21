import { describe, it, expect } from "vitest";
import { createUserSchema, updateUserSchema } from "./user.schema";

const VALID = { email: "player@example.com", password: "correct-horse" };

describe("createUserSchema", () => {
  describe("password length", () => {
    it("accepts a password of exactly 8 characters", () => {
      const result = createUserSchema.safeParse({ ...VALID, password: "12345678" });

      expect(result.success).toBe(true);
    });

    it("rejects a password of 7 characters", () => {
      const result = createUserSchema.safeParse({ ...VALID, password: "1234567" });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe(
        "Password must be at least 8 characters long",
      );
    });

    it("accepts a password of exactly 72 characters", () => {
      const result = createUserSchema.safeParse({
        ...VALID,
        password: "a".repeat(72),
      });

      expect(result.success).toBe(true);
    });

    it("rejects a password of 73 characters", () => {
      const result = createUserSchema.safeParse({
        ...VALID,
        password: "a".repeat(73),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe(
        "Password must be at most 72 characters",
      );
    });

    it("counts characters and not bytes, so a multi-byte password can exceed the hashing limit", () => {
      const password = "é".repeat(72);
      const result = createUserSchema.safeParse({ ...VALID, password });

      expect(result.success).toBe(true);
      expect(Buffer.byteLength(password, "utf8")).toBe(144);
    });
  });

  describe("email", () => {
    it("rejects an address without a domain", () => {
      const result = createUserSchema.safeParse({ ...VALID, email: "player@" });

      expect(result.success).toBe(false);
    });

    it("rejects an address without an at sign", () => {
      const result = createUserSchema.safeParse({ ...VALID, email: "player.example.com" });

      expect(result.success).toBe(false);
    });

    it("treats the same address in a different case as the same account", () => {
      const upper = createUserSchema.parse({ ...VALID, email: "Player@Example.COM" });
      const lower = createUserSchema.parse({ ...VALID, email: "player@example.com" });

      expect(upper.email).toBe(lower.email);
    });
  });

  describe("payload surface", () => {
    it("rejects a payload missing the password", () => {
      const result = createUserSchema.safeParse({ email: VALID.email });

      expect(result.success).toBe(false);
    });

    it("drops any extra field, so a caller cannot set its own role", () => {
      const parsed = createUserSchema.parse({ ...VALID, role: "ADMIN", id: "forced" });

      expect(parsed).toEqual(VALID);
    });
  });
});

describe("updateUserSchema", () => {
  it("accepts an empty payload", () => {
    const result = updateUserSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("rejects a name longer than the column allows", () => {
    const result = updateUserSchema.safeParse({ name: "a".repeat(51) });

    expect(result.success).toBe(false);
  });

  it("drops an attempt to change the email through the profile route", () => {
    const parsed = updateUserSchema.parse({
      name: "player",
      email: "attacker@example.com",
    });

    expect(parsed).toEqual({ name: "player" });
  });
});
