import { z } from "zod";
import {
  reportSchema,
  reportDetailSchema,
  type Report,
  type ReportDetail,
} from "@backend/schemas/report.schema";
import { apiFetch } from "../lib/api";

export type { Report, ReportDetail };

export async function getReports(): Promise<Report[]> {
  const data = await apiFetch<unknown>("/reports");
  return z.array(reportSchema).parse(data);
}

export async function getReport(id: string): Promise<ReportDetail> {
  const data = await apiFetch<unknown>(`/reports/${id}`);
  return reportDetailSchema.parse(data);
}
