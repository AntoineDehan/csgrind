import type { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { createTaskSchema } from "../schemas/task.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function getTasks(req: Request, res: Response) {
  const tasks = await taskService.findAllTasks();
  res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const task = await taskService.findTaskById(id);
  if (!task) {
    throw new NotFoundError("Task not found");
  }

  res.json(task);
}

export async function postTask(req: Request, res: Response) {
  const result = createTaskSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const task = await taskService.createTask(result.data);
  res.status(201).json(task);
}

export async function patchTask(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const task = await taskService.updateTask(id, req.body);
  res.json(task);
}

export async function removeTask(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await taskService.deleteTask(id);
  res.status(204).send();
}
