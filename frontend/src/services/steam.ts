import { apiFetch } from "../lib/api";

export function startSteamLink() {
  return apiFetch<{ url: string }>("/auth/steam");
}
