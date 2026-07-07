import type { Request, Response } from "express";
import * as goalRepo from "../repositories/goal.repository";
import * as reportHandler from "../handlers/report.handler";
import * as userRepo from "../repositories/user.repository";
import { createGoalSchema, updateGoalSchema } from "../schemas/goal.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";
import { getUserId } from "../lib/getUserId";

export async function getGoals(req: Request, res: Response) {
  const userId = getUserId(req);

  const goals = await goalRepo.findGoalsByUser(userId);
  res.json(goals);
}

export async function getGoal(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const goal = await goalRepo.findGoalByIdForUser(id, userId);
  if (!goal) {
    throw new NotFoundError("Goal not found");
  }

  res.json(goal);
}

export async function postGoal(req: Request, res: Response) {
  const userId = getUserId(req);
  const data = createGoalSchema.parse(req.body);

  const user = await userRepo.findUserById(userId);
  if (!user?.steam64Id) {
    throw new BadRequestError("Link your Steam account before creating a goal");
  }

  const goal = await goalRepo.createGoal(data, userId);

  try {
    await reportHandler.generateReport(userId, goal.id);
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

  const existing = await goalRepo.findGoalByIdForUser(id, userId);
  if (!existing) {
    throw new NotFoundError("Goal not found");
  }

  const data = updateGoalSchema.parse(req.body);
  const goal = await goalRepo.updateGoal(id, data);
  res.json(goal);
}

export async function getProgress(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const goal = await goalRepo.findGoalByIdForUser(id, userId);
  if (!goal) {
    throw new NotFoundError("Goal not found");
  }

  const progress = await reportHandler.getGoalProgress(id);
  if (!progress) {
    throw new NotFoundError("Not enough reports to compare");
  }

  res.json(progress);
}

export async function getStats(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const goal = await goalRepo.findGoalByIdForUser(id, userId);
  if (!goal) {
    throw new NotFoundError("Goal not found");
  }

  const stats = await reportHandler.getGoalStats(goal);
  res.json(stats);
}

export async function removeGoal(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const existing = await goalRepo.findGoalByIdForUser(id, userId);
  if (!existing) {
    throw new NotFoundError("Goal not found");
  }

  await goalRepo.deleteGoal(id);
  res.status(204).send();
}
