import type { Report } from "../../generated/prisma/client";
import * as reportRepo from "../repositories/report.repository";
import * as goalRepo from "../repositories/goal.repository";
import * as badgeRepo from "../repositories/badge.repository";
import { BADGE_DEFS } from "../selectors/badge_catalog";

export async function awardBadges(
  userId: string,
  report: Report,
  percent: number,
) {
  const recent = await reportRepo.findRecentReports(report.goalId, 2);
  const previous = recent[1];
  if (!previous) return;

  const [completedCount, badges, userBadges] = await Promise.all([
    goalRepo.countCompletedGoals(userId),
    badgeRepo.findAllBadges(),
    badgeRepo.findUserBadges(userId),
  ]);

  const earned = new Set(userBadges.map((entry) => entry.badgeId));
  const byName = new Map(badges.map((badge) => [badge.name, badge.id]));
  const ctx = { report, previous, percent, completedCount };

  const toAward: string[] = [];
  for (const def of BADGE_DEFS) {
    const badgeId = byName.get(def.name);
    if (!badgeId || earned.has(badgeId)) continue;
    if (def.rule(ctx)) toAward.push(badgeId);
  }

  if (toAward.length > 0) {
    await badgeRepo.createUserBadges(userId, toAward);
  }
}
