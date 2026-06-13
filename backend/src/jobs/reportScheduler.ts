import { checkToUpdateGoal } from "../services/goal.service";
import { addDays, FREQUENCY_DAYS } from "../lib/reportFrequency";
import { generateReport } from "../services/report.service";

type DueGoal = Awaited<ReturnType<typeof checkToUpdateGoal>>[number];

export function isGoalDue(goal: DueGoal, now: Date): boolean {
  const base = goal.lastReportAt ?? goal.createdAt;
  return addDays(base, FREQUENCY_DAYS[goal.reportFrequency]) <= now;
}

export async function runReportScheduler() {
  const goals = await checkToUpdateGoal();
  const now = new Date();
  const due = goals.filter((g) => isGoalDue(g, now));

  let succeeded = 0;
  let failed = 0;

  for (const goal of due) {
    try {
      await generateReport(goal.userId, goal.id);
      succeeded++;
    } catch (error) {
      failed++;
      console.error(`Report generation failed for goal ${goal.id}:`, error);
    }
  }

  console.log(
    `Report scheduler: ${due.length} due, ${succeeded} generated, ${failed} failed`,
  );

  return { due: due.length, succeeded, failed };
}
