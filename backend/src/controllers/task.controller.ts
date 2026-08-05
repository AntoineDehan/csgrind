import type { Request, Response } from "express";
import * as taskRepo from "../repositories/task.repository";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function getTasks(req: Request, res: Response) {
  const tasks = await taskRepo.findAllTasks();
  res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const task = await taskRepo.findTaskById(id);
  if (!task) {
    throw new NotFoundError("Task not found");
  }

  res.json(task);
}

export async function postTask(req: Request, res: Response) {
  const data = createTaskSchema.parse(req.body);
  const task = await taskRepo.createTask(data);
  res.status(201).json(task);
}

export async function patchTask(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const data = updateTaskSchema.parse(req.body);
  const task = await taskRepo.updateTask(id, data);
  res.json(task);
}

export async function removeTask(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await taskRepo.deleteTask(id);
  res.status(204).send();
}
