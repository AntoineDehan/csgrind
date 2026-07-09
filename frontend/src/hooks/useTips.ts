import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTips, createTip, deleteTip } from "../services/tips";
import { getToken } from "../lib/token";

export function useTips() {
  return useQuery({
    queryKey: ["tips"],
    queryFn: getTips,
    enabled: !!getToken(),
  });
}

export function useCreateTip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tips"] });
    },
  });
}

export function useDeleteTip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tips"] });
    },
  });
}
