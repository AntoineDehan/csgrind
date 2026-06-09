import type { Request, Response } from "express";
import * as goalService from "../services/goal.service";
import { createGoalSchema, updateGoalSchema } from "../schemas/goal.schema";

export async function getGoals(req: Request, res: Response) {
  const goals = await goalService.findAllGoals();
  res.json(goals);
}

export async function getGoal(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const goal = await goalService.findGoalById(id);
  if (!goal) {
    res.status(404).json({ message: "Goal not found" });
    return;
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
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const result = updateGoalSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const goal = await goalService.updateGoal(id, result.data);
  res.json(goal);
}

export async function removeGoal(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  await goalService.deleteGoal(id);
  res.status(204).send();
}
