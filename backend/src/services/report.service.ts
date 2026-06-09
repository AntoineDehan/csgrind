import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateReportInput } from "../schemas/report.schema";
import { fetchLeetifyProfile } from "../lib/leetify";
import { mapProfileToReport } from "../mappers/report_mapper";
import { findUserById } from "./user.service";

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

export async function generateReport(userId: string, goalId: string) {
  const user = await findUserById(userId);
  const steamId = user?.steam64Id;
  if (!steamId) throw new Error("User has not linked its Steam account");

  const leetifyProfile = await fetchLeetifyProfile(steamId);
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
