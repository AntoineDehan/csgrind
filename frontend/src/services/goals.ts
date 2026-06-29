import type { CreateGoalInput } from "@backend/schemas/goal.schema";
import { apiFetch } from "../lib/api";

export function createGoal(data: CreateGoalInput) {
  return apiFetch("/goals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
