import { z } from "zod";
import { userBadgeSchema, type UserBadge } from "@backend/schemas/badge.schema";
import { apiFetch } from "../lib/api";

export type { UserBadge };

export async function getUserBadges(): Promise<UserBadge[]> {
  const data = await apiFetch<unknown>("/users/me/badges");
  return z.array(userBadgeSchema).parse(data);
}
