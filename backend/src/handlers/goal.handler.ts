import type { Report, Goal } from "../../generated/prisma/client";
import * as reportRepo from "../repositories/report.repository";
import * as goalRepo from "../repositories/goal.repository";
import { compareReports } from "../comparators/report_comparator";
import { nextReportDate } from "../lib/reportFrequency";

export async function completeGoalIfReached(
  userId: string,
  goalId: string,
): Promise<number> {
  const goal = await goalRepo.findGoalByIdForUser(goalId, userId);
  if (!goal) return 0;

  const stats = await getGoalStats(goal);
  if (stats.percent >= 100 && goal.status !== "completed") {
    await goalRepo.updateGoal(goal.id, { status: "completed" });
  }

  return stats.percent;
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

export async function getGoalStats(goal: Goal) {
  const [first, last] = await Promise.all([
    reportRepo.findEarliestReport(goal.id),
    reportRepo.findLatestReport(goal.id),
  ]);

  const field = goal.matchmaking === "PREMIER" ? "premierRank" : "faceitRank";
  const startElo = first?.[field] ?? null;
  const currentElo = last?.[field] ?? null;
  const objectiveElo = goal.eloGoal;

  let percent = 0;
  if (startElo !== null && currentElo !== null && objectiveElo > startElo) {
    percent = Math.round(
      ((currentElo - startElo) / (objectiveElo - startElo)) * 100,
    );
    percent = Math.max(0, Math.min(100, percent));
  }

  const base = last?.createdAt ?? goal.createdAt;
  const nextReportAt = nextReportDate(base, goal.reportFrequency);

  return { startElo, currentElo, objectiveElo, percent, nextReportAt };
}

export async function getGoalTasks(goal: Goal) {
  const latest = await reportRepo.findLatestReport(goal.id);
  if (!latest) return { challenges: [], manual: [] };

  const [active, manual] = await Promise.all([
    reportRepo.findActiveChallenges(goal.id),
    reportRepo.findManualReportTasks(latest.id),
  ]);

  const challenges = active.map((challenge) => {
    const stat = challenge.task.taskStat;
    const baseline =
      challenge.trackCurrent == null ? null : Number(challenge.trackCurrent);
    const target =
      challenge.trackTarget == null ? null : Number(challenge.trackTarget);
    const value = stat ? latest[stat as keyof Report] : null;
    const current = value == null ? null : Number(value);

    let targetPct = 0;
    let currentPct = 0;
    if (baseline != null && target != null && baseline !== 0) {
      targetPct = Math.round((Math.abs(target - baseline) / baseline) * 100);
      if (current != null) {
        const improvement = ((current - baseline) / baseline) * 100;
        const good = target >= baseline ? improvement : -improvement;
        currentPct = Math.max(0, Math.round(good));
      }
    }

    return {
      taskId: challenge.taskId,
      content: challenge.task.content,
      currentPct,
      targetPct,
    };
  });

  const manualTasks = manual.map((task) => ({
    reportId: task.reportId,
    taskId: task.taskId,
    content: task.task.content,
    isCompleted: task.isCompleted,
  }));

  return { challenges, manual: manualTasks };
}
