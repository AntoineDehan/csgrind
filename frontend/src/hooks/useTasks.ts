import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  createTask,
  deleteTask,
  setReportTaskCompleted,
} from "../services/tasks";
import { getToken } from "../lib/token";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: !!getToken(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useToggleReportTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      reportId: string;
      taskId: string;
      isCompleted: boolean;
    }) =>
      setReportTaskCompleted(
        variables.reportId,
        variables.taskId,
        variables.isCompleted,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal-tasks"] });
    },
  });
}
