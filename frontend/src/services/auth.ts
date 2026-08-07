import { userSchema, type User } from "@backend/schemas/user.schema";
import type {
  LoginUserInput,
  RegisterUserInput,
} from "@backend/schemas/auth.schema";
import { apiFetch } from "../lib/api";

export type { User };
export type Credentials = LoginUserInput;

export function login(credentials: LoginUserInput) {
  return apiFetch<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function register(credentials: RegisterUserInput): Promise<User> {
  const data = await apiFetch<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return userSchema.parse(data);
}

export function verifyEmail(token: string) {
  return apiFetch<{ message: string }>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export function resendVerification(email: string) {
  return apiFetch<{ message: string }>("/auth/verify-email/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getMe(): Promise<User> {
  const data = await apiFetch<unknown>("/auth/me");
  return userSchema.parse(data);
}
