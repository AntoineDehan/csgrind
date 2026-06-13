import { z } from "zod";

export const createTipSchema = z.object({
  category: z.string().max(30),
  priority: z.number().int(),
  content: z.string().min(1),
});

export type CreateTipInput = z.infer<typeof createTipSchema>;

export const updateTipSchema = createTipSchema.partial();

export type UpdateTipInput = z.infer<typeof updateTipSchema>;
