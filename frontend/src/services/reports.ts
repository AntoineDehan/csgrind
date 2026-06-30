import { apiFetch } from "../lib/api";

export type Report = {
  id: string;
  createdAt: string;
  goalId: string;
  [key: string]: unknown;
};

export function getReports() {
  return apiFetch<Report[]>("/reports");
}

export function getReport(id: string) {
  return apiFetch<Report>(`/reports/${id}`);
}
