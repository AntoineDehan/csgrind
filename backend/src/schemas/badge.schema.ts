import { z } from "zod";

export const createBadgeSchema = z.object({
  name: z.string().max(100),
  description: z.string().min(1),
  icon: z.string().max(500),
});

export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;

export const updateBadgeSchema = createBadgeSchema.partial();

export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;
