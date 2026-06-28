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

export async function getMe(): Promise<User> {
  const data = await apiFetch<unknown>("/auth/me");
  return userSchema.parse(data);
}
