import { z } from "zod";
import {
  goalSchema,
  goalStatsSchema,
  type CreateGoalInput,
  type Goal,
  type GoalStats,
} from "@backend/schemas/goal.schema";
import { apiFetch } from "../lib/api";

export type { Goal, GoalStats };

export async function getGoals(): Promise<Goal[]> {
  const data = await apiFetch<unknown>("/goals");
  return z.array(goalSchema).parse(data);
}

export async function getGoalStats(id: string): Promise<GoalStats> {
  const data = await apiFetch<unknown>(`/goals/${id}/stats`);
  return goalStatsSchema.parse(data);
}

export async function createGoal(data: CreateGoalInput): Promise<Goal> {
  const created = await apiFetch<unknown>("/goals", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return goalSchema.parse(created);
}
