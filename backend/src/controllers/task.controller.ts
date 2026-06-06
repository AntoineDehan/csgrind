import type { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { createTaskSchema } from "../schemas/task.schema";

export async function getTasks(req: Request, res: Response) {
  const tasks = await taskService.findAllTasks();
  res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const task = await taskService.findTaskById(id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
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
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const task = await taskService.updateTask(id, req.body);
  res.json(task);
}

export async function removeTask(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  await taskService.deleteTask(id);
  res.status(204).send();
}
