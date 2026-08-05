import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";

export function findAllTasks() {
  return prisma.task.findMany();
}

export function findTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export function createTask(data: CreateTaskInput) {
  return prisma.task.create({ data: data as Prisma.TaskUncheckedCreateInput });
}

export function updateTask(id: string, data: UpdateTaskInput) {
  return prisma.task.update({
    where: { id },
    data: data as Prisma.TaskUncheckedUpdateInput,
  });
}

export function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}
