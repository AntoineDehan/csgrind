import type { Request, Response } from "express";
import * as reportRepo from "../repositories/report.repository";
import * as reportHandler from "../handlers/report.handler";
import { toggleReportTaskSchema } from "../schemas/task.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";
import { getUserId } from "../lib/getUserId";

export async function getReports(req: Request, res: Response) {
  const userId = getUserId(req);

  const reports = await reportRepo.findReportsByUser(userId);
  res.json(reports);
}

export async function getReport(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const report = await reportHandler.getReportDetail(id, userId);
  if (!report) {
    throw new NotFoundError("Report not found");
  }

  res.json(report);
}

export async function patchReportTask(req: Request, res: Response) {
  const userId = getUserId(req);
  const reportId = req.params.reportId;
  const taskId = req.params.taskId;
  if (typeof reportId !== "string" || typeof taskId !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const report = await reportRepo.findReportByIdForUser(reportId, userId);
  if (!report) {
    throw new NotFoundError("Report not found");
  }

  const { isCompleted } = toggleReportTaskSchema.parse(req.body);
  await reportRepo.setReportTaskCompleted(reportId, taskId, isCompleted);
  res.status(204).send();
}
