import { describe, it, expect } from "vitest";
import {
  loginUserSchema,
  registerUserSchema,
  resendVerificationSchema,
  verifyEmailSchema,
} from "./auth.schema";

describe("the shared email rule", () => {
  it.each([
    { route: "register", schema: registerUserSchema, extra: { password: "correct-horse" } },
    { route: "login", schema: loginUserSchema, extra: { password: "correct-horse" } },
    { route: "resend verification", schema: resendVerificationSchema, extra: {} },
  ])("normalizes the address on $route", ({ schema, extra }) => {
    const parsed = schema.parse({ email: "Player@Example.COM", ...extra });

    expect(parsed.email).toBe("player@example.com");
  });

  it.each([
    { route: "register", schema: registerUserSchema, extra: { password: "correct-horse" } },
    { route: "login", schema: loginUserSchema, extra: { password: "correct-horse" } },
    { route: "resend verification", schema: resendVerificationSchema, extra: {} },
  ])("still rejects an invalid address on $route", ({ schema, extra }) => {
    const result = schema.safeParse({ email: "player.example.com", ...extra });

    expect(result.success).toBe(false);
  });

  it("leaves an already lowercase address untouched", () => {
    const parsed = loginUserSchema.parse({
      email: "player@example.com",
      password: "correct-horse",
    });

    expect(parsed.email).toBe("player@example.com");
  });

  it("does not touch the case of the password", () => {
    const parsed = loginUserSchema.parse({
      email: "Player@Example.com",
      password: "CorrectHorse",
    });

    expect(parsed.password).toBe("CorrectHorse");
  });
});

describe("loginUserSchema", () => {
  it("accepts any non-empty password so an old account can still sign in", () => {
    const result = loginUserSchema.safeParse({
      email: "player@example.com",
      password: "short",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = loginUserSchema.safeParse({
      email: "player@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("verifyEmailSchema", () => {
  it("requires a token", () => {
    expect(verifyEmailSchema.safeParse({ token: "" }).success).toBe(false);
    expect(verifyEmailSchema.safeParse({}).success).toBe(false);
  });

  it("drops any extra field sent alongside the token", () => {
    const parsed = verifyEmailSchema.parse({ token: "abc", userId: "forced" });

    expect(parsed).toEqual({ token: "abc" });
  });
});
