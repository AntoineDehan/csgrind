import { z } from "zod";

export const createTaskSchema = z.object({
  content: z.string().min(1),
  isTrackable: z.boolean().optional(),
  taskStat: z.string().max(50).optional(),
  trackMap: z.string().max(30).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
