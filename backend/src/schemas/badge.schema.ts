import { z } from "zod";

export const createBadgeSchema = z.object({
  name: z.string().max(100),
  description: z.string().min(1),
  icon: z.string().max(500),
});

export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;

export const updateBadgeSchema = createBadgeSchema.partial();

export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;

export const badgeSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const userBadgeSchema = z.object({
  obtainedAt: z.iso.datetime(),
  badge: badgeSchema,
});

export type UserBadge = z.infer<typeof userBadgeSchema>;
