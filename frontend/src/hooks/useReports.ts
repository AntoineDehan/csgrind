import { useQuery } from "@tanstack/react-query";
import { getReports, getReport } from "../services/reports";
import { getToken } from "../lib/token";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
    enabled: !!getToken(),
  });
}

export function useReport(reportId: string | undefined) {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReport(reportId!),
    enabled: !!reportId && !!getToken(),
  });
}
