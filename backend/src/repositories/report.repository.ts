import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateReportInput } from "../schemas/report.schema";

type ReportTaskInput = {
  taskId: string;
  trackCurrent: number | null;
  trackTarget: number | null;
};

export function findReportsByUser(userId: string) {
  return prisma.report.findMany({ where: { goal: { userId } } });
}

export function findReportByIdForUser(id: string, userId: string) {
  return prisma.report.findFirst({
    where: { id, goal: { userId } },
    include: { tips: { include: { tip: true } } },
  });
}

export function findRecentReports(goalId: string, take: number) {
  return prisma.report.findMany({
    where: { goalId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function findEarliestReport(goalId: string) {
  return prisma.report.findFirst({
    where: { goalId },
    orderBy: { createdAt: "asc" },
  });
}

export function findLatestReport(goalId: string) {
  return prisma.report.findFirst({
    where: { goalId },
    orderBy: { createdAt: "desc" },
  });
}

export function findPreviousReport(goalId: string, before: Date) {
  return prisma.report.findFirst({
    where: { goalId, createdAt: { lt: before } },
    orderBy: { createdAt: "desc" },
  });
}

export function countReportsUpTo(goalId: string, createdAt: Date) {
  return prisma.report.count({
    where: { goalId, createdAt: { lte: createdAt } },
  });
}

export function createReport(data: CreateReportInput) {
  return prisma.report.create({
    data: data as Prisma.ReportUncheckedCreateInput,
  });
}

export function createReportTips(reportId: string, tipIds: string[]) {
  return prisma.reportTip.createMany({
    data: tipIds.map((tipId) => ({ reportId, tipId })),
  });
}

export function createReportTasks(reportId: string, tasks: ReportTaskInput[]) {
  return prisma.reportTask.createMany({
    data: tasks.map((task) => ({
      reportId,
      taskId: task.taskId,
      trackCurrent: task.trackCurrent,
      trackTarget: task.trackTarget,
    })),
  });
}

export function findActiveChallenges(goalId: string) {
  return prisma.reportTask.findMany({
    where: {
      report: { goalId },
      task: { isTrackable: true },
      isCompleted: false,
    },
    include: { task: true },
  });
}

export function findManualReportTasks(reportId: string) {
  return prisma.reportTask.findMany({
    where: { reportId, task: { isTrackable: false } },
    include: { task: true },
  });
}

export function completeChallenges(
  keys: { reportId: string; taskId: string }[],
) {
  return prisma.$transaction(
    keys.map(({ reportId, taskId }) =>
      prisma.reportTask.update({
        where: { reportId_taskId: { reportId, taskId } },
        data: { isCompleted: true },
      }),
    ),
  );
}

export function setReportTaskCompleted(
  reportId: string,
  taskId: string,
  isCompleted: boolean,
) {
  return prisma.reportTask.update({
    where: { reportId_taskId: { reportId, taskId } },
    data: { isCompleted },
  });
}
