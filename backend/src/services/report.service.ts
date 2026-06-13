import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateReportInput } from "../schemas/report.schema";
import { fetchLeetifyProfile } from "../lib/leetify";
import { mapProfileToReport } from "../mappers/report_mapper";
import { findUserById } from "./user.service";
import { compareReports } from "../comparators/report_comparator";
import { selectTips } from "../selectors/tip_selector";
import { selectTasks } from "../selectors/task_selector";
import type { Report } from "../../generated/prisma/client";

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

  const report = await createReport(mappedStats);
  await attachTips(report);
  await attachTasks(report);
  return report;
}

async function attachTips(report: Report) {
  const tipIds = selectTips(report);
  if (tipIds.length === 0) return;

  await prisma.reportTip.createMany({
    data: tipIds.map((tipId) => ({ reportId: report.id, tipId })),
  });
}

async function attachTasks(report: Report) {
  const tasks = selectTasks(report);
  if (tasks.length === 0) return;

  await prisma.reportTask.createMany({
    data: tasks.map((task) => ({
      reportId: report.id,
      taskId: task.taskId,
      trackCurrent: task.trackCurrent,
      trackTarget: task.trackTarget,
    })),
  });
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

export async function getGoalProgress(goalId: string) {
  const reports = await prisma.report.findMany({
    where: { goalId },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  const [current, previous] = reports;
  if (!current || !previous) return null;

  return {
    previousReportId: previous.id,
    currentReportId: current.id,
    comparedFrom: previous.createdAt,
    comparedTo: current.createdAt,
    stats: compareReports(previous, current),
  };
}
