import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  register,
  getMe,
  verifyEmail,
  resendVerification,
  type Credentials,
} from "../services/auth";
import { deleteAccount } from "../services/user";
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
  return useMutation({
    mutationFn: (credentials: Credentials) => register(credentials),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    clearToken();
    queryClient.setQueryData(["me"], null);
  };
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteAccount(userId),
    onSuccess: () => {
      clearToken();
      queryClient.clear();
    },
  });
}
