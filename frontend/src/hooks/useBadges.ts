import { useQuery } from "@tanstack/react-query";
import { getUserBadges } from "../services/badges";
import { getToken } from "../lib/token";

export function useUserBadges() {
  return useQuery({
    queryKey: ["user-badges"],
    queryFn: getUserBadges,
    enabled: !!getToken(),
  });
}
