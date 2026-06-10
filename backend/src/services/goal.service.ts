import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateGoalInput, UpdateGoalInput } from "../schemas/goal.schema";

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
  return prisma.goal.findMany({
    where: { status: "in_progress", user: { steam64Id: { not: null } } },
    include: { reports: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
}
