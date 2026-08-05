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

export const taskSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  isTrackable: z.boolean(),
  taskStat: z.string().nullable(),
  trackMap: z.string().nullable(),
});

export type Task = z.infer<typeof taskSchema>;

export const toggleReportTaskSchema = z.object({
  isCompleted: z.boolean(),
});

export const goalChallengeSchema = z.object({
  taskId: z.uuid(),
  content: z.string(),
  currentPct: z.number(),
  targetPct: z.number(),
});

export const goalManualTaskSchema = z.object({
  reportId: z.uuid(),
  taskId: z.uuid(),
  content: z.string(),
  isCompleted: z.boolean(),
});

export const goalTasksSchema = z.object({
  challenges: z.array(goalChallengeSchema),
  manual: z.array(goalManualTaskSchema),
});

export type GoalTasks = z.infer<typeof goalTasksSchema>;
