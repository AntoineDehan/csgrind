import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, getMe, type Credentials } from "../services/auth";
import { getToken, setToken, clearToken } from "../lib/token";

export function useUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!getToken(),
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: ({ token }) => {
      setToken(token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: Credentials) => {
      await register(credentials);
      try {
        return await login(credentials);
      } catch {
        throw new Error("Account created. Please sign in.");
      }
    },
    onSuccess: ({ token }) => {
      setToken(token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    clearToken();
    queryClient.setQueryData(["me"], null);
  };
}
