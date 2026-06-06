import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateTipInput } from "../schemas/tip.schema";

export function findAllTips() {
  return prisma.tip.findMany();
}

export function findTipById(id: string) {
  return prisma.tip.findUnique({ where: { id } });
}

export function createTip(data: CreateTipInput) {
  return prisma.tip.create({ data: data as Prisma.TipUncheckedCreateInput });
}

export function updateTip(id: string, data: Prisma.TipUncheckedUpdateInput) {
  return prisma.tip.update({ where: { id }, data });
}

export function deleteTip(id: string) {
  return prisma.tip.delete({ where: { id } });
}
