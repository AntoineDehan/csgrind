import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateReportInput } from "../schemas/report.schema";

export function findAllReports() {
  return prisma.report.findMany();
}

export function findReportById(id: string) {
  return prisma.report.findUnique({ where: { id } });
}

export function createReport(data: CreateReportInput) {
  return prisma.report.create({
    data: data as Prisma.ReportUncheckedCreateInput,
  });
}

export function updateReport(
  id: string,
  data: Prisma.ReportUncheckedUpdateInput,
) {
  return prisma.report.update({ where: { id }, data });
}

export function deleteReport(id: string) {
  return prisma.report.delete({ where: { id } });
}
