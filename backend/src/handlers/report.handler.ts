import type { Report } from "../../generated/prisma/client";
import { fetchLeetifyProfile } from "../lib/leetify";
import { mapProfileToReport } from "../mappers/report_mapper";
import { findUserById } from "../repositories/user.repository";
import * as reportRepo from "../repositories/report.repository";
import * as goalRepo from "../repositories/goal.repository";
import * as tipRepo from "../repositories/tip.repository";
import * as taskRepo from "../repositories/task.repository";
import * as goalHandler from "./goal.handler";
import * as badgeHandler from "./badge.handler";
import { compareReports } from "../comparators/report_comparator";
import { selectTips } from "../selectors/tip_selector";
import {
  selectManualTasks,
  selectChallenges,
  CHALLENGE_SLOTS,
} from "../selectors/task_selector";
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
  const percent = await goalHandler.completeGoalIfReached(userId, report.goalId);
  await badgeHandler.awardBadges(userId, report, percent);
  return report;
}

async function attachTips(report: Report) {
  const tips = await tipRepo.findAllTips();
  const tipIds = selectTips(report, tips);
  if (tipIds.length === 0) return;

  await reportRepo.createReportTips(report.id, tipIds);
}

async function attachTasks(report: Report) {
  const recent = await reportRepo.findRecentReports(report.goalId, 2);
  const previous = recent[1];
  if (!previous) return;

  const tasks = await taskRepo.findAllTasks();

  const active = await reportRepo.findActiveChallenges(report.goalId);
  const completedKeys: { reportId: string; taskId: string }[] = [];
  const excludeStats = new Set<string>();
  let activeCount = 0;
  for (const challenge of active) {
    if (isChallengeComplete(challenge, report)) {
      completedKeys.push({
        reportId: challenge.reportId,
        taskId: challenge.taskId,
      });
      continue;
    }
    activeCount++;
    if (challenge.task.taskStat) excludeStats.add(challenge.task.taskStat);
  }
  if (completedKeys.length > 0) {
    await reportRepo.completeChallenges(completedKeys);
  }

  const deltas = compareReports(previous, report);
  const challenges = selectChallenges(
    deltas,
    tasks,
    CHALLENGE_SLOTS - activeCount,
    report,
    excludeStats,
  );
  const manualIds = selectManualTasks(tasks);

  const rows = [
    ...challenges.map((challenge) => ({
      taskId: challenge.taskId,
      trackCurrent: challenge.trackCurrent,
      trackTarget: challenge.trackTarget,
    })),
    ...manualIds.map((taskId) => ({
      taskId,
      trackCurrent: null,
      trackTarget: null,
    })),
  ];
  if (rows.length > 0) {
    await reportRepo.createReportTasks(report.id, rows);
  }
}

type ActiveChallenge = {
  reportId: string;
  taskId: string;
  trackCurrent: unknown;
  trackTarget: unknown;
  task: { taskStat: string | null };
};

function isChallengeComplete(
  challenge: ActiveChallenge,
  report: Report,
): boolean {
  const stat = challenge.task.taskStat;
  if (!stat || challenge.trackCurrent == null || challenge.trackTarget == null) {
    return false;
  }
  const value = report[stat as keyof Report];
  if (value == null) return false;
  return (
    challengeProgress(
      Number(value),
      Number(challenge.trackCurrent),
      Number(challenge.trackTarget),
    ) >= 100
  );
}

function challengeProgress(
  current: number,
  baseline: number,
  target: number,
): number {
  if (target === baseline) return 0;
  const percent = ((current - baseline) / (target - baseline)) * 100;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

export async function getVisibleReports(userId: string) {
  const reports = await reportRepo.findReportsByUser(userId);

  const baseline = new Map<string, { id: string; createdAt: Date }>();
  for (const report of reports) {
    const current = baseline.get(report.goalId);
    if (!current || report.createdAt < current.createdAt) {
      baseline.set(report.goalId, {
        id: report.id,
        createdAt: report.createdAt,
      });
    }
  }
  const baselineIds = new Set(
    [...baseline.values()].map((entry) => entry.id),
  );

  return reports.filter((report) => !baselineIds.has(report.id));
}

export async function getReportDetail(reportId: string, userId: string) {
  const report = await reportRepo.findReportByIdForUser(reportId, userId);
  if (!report) return null;

  const [previous, index, goal, earliest] = await Promise.all([
    reportRepo.findPreviousReport(report.goalId, report.createdAt),
    reportRepo.countReportsUpTo(report.goalId, report.createdAt),
    goalRepo.findGoalByIdForUser(report.goalId, userId),
    reportRepo.findEarliestReport(report.goalId),
  ]);
  const comparison = previous ? compareReports(previous, report) : [];
  const progress = goal ? reportProgress(goal, earliest, report) : null;

  return { ...report, comparison, index, progress };
}

function reportProgress(
  goal: { matchmaking: string; eloGoal: number },
  earliest: Report | null,
  report: Report,
) {
  const field = goal.matchmaking === "PREMIER" ? "premierRank" : "faceitRank";
  const startElo = earliest?.[field] ?? null;
  const currentElo = report[field] ?? null;
  const objectiveElo = goal.eloGoal;

  let percent = 0;
  if (startElo != null && currentElo != null && objectiveElo > startElo) {
    percent = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          ((currentElo - startElo) / (objectiveElo - startElo)) * 100,
        ),
      ),
    );
  }

  return { matchmaking: goal.matchmaking, startElo, currentElo, objectiveElo, percent };
}
