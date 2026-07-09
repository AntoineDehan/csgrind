import { z } from "zod";
import {
  badgeSchema,
  userBadgeSchema,
  type Badge,
  type UserBadge,
} from "@backend/schemas/badge.schema";
import { apiFetch } from "../lib/api";

export type { Badge, UserBadge };

export async function getBadges(): Promise<Badge[]> {
  const data = await apiFetch<unknown>("/badges");
  return z.array(badgeSchema).parse(data);
}

export async function getUserBadges(): Promise<UserBadge[]> {
  const data = await apiFetch<unknown>("/users/me/badges");
  return z.array(userBadgeSchema).parse(data);
}
