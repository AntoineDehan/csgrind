import { apiFetch } from "../lib/api";

export function deleteAccount(userId: string): Promise<void> {
  return apiFetch<void>(`/users/${userId}`, { method: "DELETE" });
}
