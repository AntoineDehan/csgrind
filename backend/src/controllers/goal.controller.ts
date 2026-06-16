import type { Request, Response } from "express";
import * as goalService from "../services/goal.service";
import * as reportService from "../services/report.service";
import * as userService from "../services/user.service";
import { createGoalSchema, updateGoalSchema } from "../schemas/goal.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";
import { getUserId } from "../lib/getUserId";

export async function getGoals(req: Request, res: Response) {
  const userId = getUserId(req);

  const goals = await goalService.findGoalsByUser(userId);
  res.json(goals);
}

export async function getGoal(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const goal = await goalService.findGoalByIdForUser(id, userId);
  if (!goal) {
    throw new NotFoundError("Goal not found");
  }

  res.json(goal);
}

export async function postGoal(req: Request, res: Response) {
  const userId = getUserId(req);
  const data = createGoalSchema.parse(req.body);

  const user = await userService.findUserById(userId);
  if (!user?.steam64Id) {
    throw new BadRequestError("Link your Steam account before creating a goal");
  }

  const goal = await goalService.createGoal(data, userId);

  try {
    await reportService.generateReport(userId, goal.id);
  } catch (error) {
    console.error(`Baseline report failed for goal ${goal.id}:`, error);
  }

  res.status(201).json(goal);
}

export async function patchGoal(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const existing = await goalService.findGoalByIdForUser(id, userId);
  if (!existing) {
    throw new NotFoundError("Goal not found");
  }

  const data = updateGoalSchema.parse(req.body);
  const goal = await goalService.updateGoal(id, data);
  res.json(goal);
}

export async function getProgress(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const goal = await goalService.findGoalByIdForUser(id, userId);
  if (!goal) {
    throw new NotFoundError("Goal not found");
  }

  const progress = await reportService.getGoalProgress(id);
  if (!progress) {
    throw new NotFoundError("Not enough reports to compare");
  }

  res.json(progress);
}

export async function removeGoal(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const existing = await goalService.findGoalByIdForUser(id, userId);
  if (!existing) {
    throw new NotFoundError("Goal not found");
  }

  await goalService.deleteGoal(id);
  res.status(204).send();
}
