import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { ReportFrequency } from "../../generated/prisma/enums";
import type { CreateGoalInput, UpdateGoalInput } from "../schemas/goal.schema";

type DueGoalRow = {
  id: string;
  userId: string;
  createdAt: Date;
  reportFrequency: ReportFrequency;
  lastReportAt: Date | null;
};

export function findAllGoals() {
  return prisma.goal.findMany();
}

export function findGoalById(id: string) {
  return prisma.goal.findUnique({ where: { id } });
}

export function createGoal(data: CreateGoalInput) {
  return prisma.goal.create({ data: data as Prisma.GoalUncheckedCreateInput });
}

export function updateGoal(id: string, data: UpdateGoalInput) {
  return prisma.goal.update({
    where: { id },
    data: data as Prisma.GoalUncheckedUpdateInput,
  });
}

export function deleteGoal(id: string) {
  return prisma.goal.delete({ where: { id } });
}

export function checkToUpdateGoal() {
  return prisma.$queryRaw<DueGoalRow[]>`
    SELECT
      g.id               AS "id",
      g.user_id          AS "userId",
      g.created_at       AS "createdAt",
      g.report_frequency AS "reportFrequency",
      r.created_at       AS "lastReportAt"
    FROM goals g
    JOIN users u ON u.id = g.user_id
    LEFT JOIN LATERAL (
      SELECT created_at
      FROM reports
      WHERE reports.goal_id = g.id
      ORDER BY created_at DESC
      LIMIT 1
    ) r ON TRUE
    WHERE g.status = 'in_progress'
      AND u.steam64_id IS NOT NULL
  `;
}
