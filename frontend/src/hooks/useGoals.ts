import { useQuery } from "@tanstack/react-query";
import { getGoals, getGoalStats, getGoalTasks } from "../services/goals";
import { getToken } from "../lib/token";

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
    enabled: !!getToken(),
  });
}

export function useGoalStats(goalId: string | undefined) {
  return useQuery({
    queryKey: ["goal-stats", goalId],
    queryFn: () => getGoalStats(goalId!),
    enabled: !!goalId && !!getToken(),
  });
}

export function useGoalTasks(goalId: string | undefined) {
  return useQuery({
    queryKey: ["goal-tasks", goalId],
    queryFn: () => getGoalTasks(goalId!),
    enabled: !!goalId && !!getToken(),
  });
}
