import { z } from "zod";
import {
  taskSchema,
  type CreateTaskInput,
  type Task,
} from "@backend/schemas/task.schema";
import { apiFetch } from "../lib/api";

export type { Task };

export async function getTasks(): Promise<Task[]> {
  const data = await apiFetch<unknown>("/tasks");
  return z.array(taskSchema).parse(data);
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const created = await apiFetch<unknown>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return taskSchema.parse(created);
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch<void>(`/tasks/${id}`, { method: "DELETE" });
}

export async function setReportTaskCompleted(
  reportId: string,
  taskId: string,
  isCompleted: boolean,
): Promise<void> {
  await apiFetch<void>(`/reports/${reportId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ isCompleted }),
  });
}
