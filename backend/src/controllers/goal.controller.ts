import type { Request, Response } from "express";
import * as goalService from "../services/goal.service";
import * as reportService from "../services/report.service";
import { createGoalSchema, updateGoalSchema } from "../schemas/goal.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function getGoals(req: Request, res: Response) {
  const goals = await goalService.findAllGoals();
  res.json(goals);
}

export async function getGoal(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const goal = await goalService.findGoalById(id);
  if (!goal) {
    throw new NotFoundError("Goal not found");
  }

  res.json(goal);
}

export async function postGoal(req: Request, res: Response) {
  const result = createGoalSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const goal = await goalService.createGoal(result.data);
  res.status(201).json(goal);
}

export async function patchGoal(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const result = updateGoalSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const goal = await goalService.updateGoal(id, result.data);
  res.json(goal);
}

export async function getProgress(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const progress = await reportService.getGoalProgress(id);
  if (!progress) {
    throw new NotFoundError("Not enough reports to compare");
  }

  res.json(progress);
}

export async function removeGoal(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await goalService.deleteGoal(id);
  res.status(204).send();
}
