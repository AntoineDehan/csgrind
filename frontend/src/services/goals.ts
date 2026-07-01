import {
  goalSchema,
  type CreateGoalInput,
  type Goal,
} from "@backend/schemas/goal.schema";
import { apiFetch } from "../lib/api";

export type { Goal };

export async function createGoal(data: CreateGoalInput): Promise<Goal> {
  const created = await apiFetch<unknown>("/goals", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return goalSchema.parse(created);
}
