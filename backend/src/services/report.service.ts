import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateReportInput } from "../schemas/report.schema";
import { fetchLeetifyProfile } from "../lib/leetify";
import { mapProfileToReport } from "../mappers/report_mapper";

export function findAllReports() {
  return prisma.report.findMany();
}

export function findReportById(id: string) {
  return prisma.report.findUnique({ where: { id } });
}

export function createReport(data: CreateReportInput) {
  return prisma.report.create({
    data: data as Prisma.ReportUncheckedCreateInput,
  });
}

export async function generateReport(steam64Id: string, goalId: string) {
  const leetifyProfile = await fetchLeetifyProfile(steam64Id);
  if (leetifyProfile.privacy_mode === "private")
    throw new Error("Leetify profile private");
  const mappedStats = mapProfileToReport(leetifyProfile, goalId);

  return await createReport(mappedStats);
}

export function updateReport(
  id: string,
  data: Prisma.ReportUncheckedUpdateInput,
) {
  return prisma.report.update({ where: { id }, data });
}

export function deleteReport(id: string) {
  return prisma.report.delete({ where: { id } });
}
