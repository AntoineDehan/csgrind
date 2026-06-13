import type { Request, Response } from "express";
import * as reportService from "../services/report.service";
import { generateReportSchema } from "../schemas/report.schema";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/AppError";

export async function getReports(req: Request, res: Response) {
  const reports = await reportService.findAllReports();
  res.json(reports);
}

export async function getReport(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const report = await reportService.findReportById(id);
  if (!report) {
    throw new NotFoundError("Report not found");
  }

  res.json(report);
}

export async function generate(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const result = generateReportSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const report = await reportService.generateReport(userId, result.data.goalId);
  res.status(201).json(report);
}

export async function patchReport(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const report = await reportService.updateReport(id, req.body);
  res.json(report);
}

export async function removeReport(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await reportService.deleteReport(id);
  res.status(204).send();
}
