import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { ReportFrequency } from "../../generated/prisma/enums";
import type { CreateGoalInput, UpdateGoalInput } from "../schemas/goal.schema";

type DueGoalRow = {
  id: string;
  userId: string;
  email: string;
  createdAt: Date;
  reportFrequency: ReportFrequency;
  lastReportAt: Date | null;
};

export function findGoalsByUser(userId: string) {
  return prisma.goal.findMany({ where: { userId } });
}

export function findGoalByIdForUser(id: string, userId: string) {
  return prisma.goal.findFirst({ where: { id, userId } });
}

export function createGoal(data: CreateGoalInput, userId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.goal.updateMany({
      where: { userId, status: "in_progress" },
      data: { status: "abandoned" },
    });
    return tx.goal.create({
      data: { ...data, userId } as Prisma.GoalUncheckedCreateInput,
    });
  });
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
      u.email            AS "email",
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
