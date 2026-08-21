import { z } from "zod";
import { createUserSchema } from "./user.schema";

export const registerUserSchema = createUserSchema;

export const loginUserSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const resendVerificationSchema = z.object({
  email: z.email().toLowerCase(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
