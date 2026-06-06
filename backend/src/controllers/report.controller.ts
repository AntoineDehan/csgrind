import type { Request, Response } from "express";
import * as reportService from "../services/report.service";
import { createReportSchema } from "../schemas/report.schema";

export async function getReports(req: Request, res: Response) {
  const reports = await reportService.findAllReports();
  res.json(reports);
}

export async function getReport(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const report = await reportService.findReportById(id);
  if (!report) {
    res.status(404).json({ message: "Report not found" });
    return;
  }

  res.json(report);
}

export async function postReport(req: Request, res: Response) {
  const result = createReportSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const report = await reportService.createReport(result.data);
  res.status(201).json(report);
}

export async function patchReport(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const report = await reportService.updateReport(id, req.body);
  res.json(report);
}

export async function removeReport(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  await reportService.deleteReport(id);
  res.status(204).send();
}
