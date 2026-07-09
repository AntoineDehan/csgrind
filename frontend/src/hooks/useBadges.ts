import { useQuery } from "@tanstack/react-query";
import { getBadges, getUserBadges } from "../services/badges";
import { getToken } from "../lib/token";

export function useBadges() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: getBadges,
    enabled: !!getToken(),
  });
}

export function useUserBadges() {
  return useQuery({
    queryKey: ["user-badges"],
    queryFn: getUserBadges,
    enabled: !!getToken(),
  });
}
