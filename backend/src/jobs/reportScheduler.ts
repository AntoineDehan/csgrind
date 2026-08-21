import { checkToUpdateGoal } from "../repositories/goal.repository";
import { calendarDay, nextReportDate } from "../lib/reportFrequency";
import { generateReport } from "../handlers/report.handler";
import { sendReportNotification } from "../lib/mailer";

type DueGoal = Awaited<ReturnType<typeof checkToUpdateGoal>>[number];

export function isGoalDue(goal: DueGoal, now: Date): boolean {
  const base = goal.lastReportAt ?? goal.createdAt;
  return nextReportDate(base, goal.reportFrequency) <= calendarDay(now);
}

export async function runReportScheduler() {
  const goals = await checkToUpdateGoal();
  const now = new Date();
  const due = goals.filter((g) => isGoalDue(g, now));

  let succeeded = 0;
  let failed = 0;

  for (const goal of due) {
    try {
      const report = await generateReport(goal.userId, goal.id);
      succeeded++;

      try {
        await sendReportNotification(goal.email, report.id);
      } catch (error) {
        console.error(`Notification failed for goal ${goal.id}:`, error);
      }
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
