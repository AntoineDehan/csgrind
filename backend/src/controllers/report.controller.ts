import type { Request, Response } from "express";
import * as reportRepo from "../repositories/report.repository";
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

  const report = await reportRepo.findReportByIdForUser(id, userId);
  if (!report) {
    throw new NotFoundError("Report not found");
  }

  res.json(report);
}
