import type { Report } from "../../generated/prisma/client";
import { fetchLeetifyProfile } from "../lib/leetify";
import { mapProfileToReport } from "../mappers/report_mapper";
import { findUserById } from "../repositories/user.repository";
import * as reportRepo from "../repositories/report.repository";
import { compareReports } from "../comparators/report_comparator";
import { selectTips } from "../selectors/tip_selector";
import { selectTasks } from "../selectors/task_selector";
import { BadRequestError } from "../errors/AppError";

export async function generateReport(userId: string, goalId: string) {
  const user = await findUserById(userId);
  const steamId = user?.steam64Id;
  if (!steamId)
    throw new BadRequestError("User has not linked its Steam account");

  const leetifyProfile = await fetchLeetifyProfile(steamId);
  if (leetifyProfile.privacy_mode === "private")
    throw new BadRequestError("Leetify profile is private");
  const mappedStats = mapProfileToReport(leetifyProfile, goalId);

  const report = await reportRepo.createReport(mappedStats);
  await attachTips(report);
  await attachTasks(report);
  return report;
}

async function attachTips(report: Report) {
  const tipIds = selectTips(report);
  if (tipIds.length === 0) return;

  await reportRepo.createReportTips(report.id, tipIds);
}

async function attachTasks(report: Report) {
  const tasks = selectTasks(report);
  if (tasks.length === 0) return;

  await reportRepo.createReportTasks(report.id, tasks);
}

export async function getGoalProgress(goalId: string) {
  const reports = await reportRepo.findRecentReports(goalId, 2);

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
