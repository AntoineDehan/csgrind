import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateBadgeInput } from "../schemas/badge.schema";

export function findAllBadges() {
  return prisma.badge.findMany();
}

export function findBadgeById(id: string) {
  return prisma.badge.findUnique({ where: { id } });
}

export function createBadge(data: CreateBadgeInput) {
  return prisma.badge.create({
    data: data as Prisma.BadgeUncheckedCreateInput,
  });
}

export function updateBadge(id: string, data: Prisma.BadgeUncheckedUpdateInput) {
  return prisma.badge.update({ where: { id }, data });
}

export function deleteBadge(id: string) {
  return prisma.badge.delete({ where: { id } });
}
