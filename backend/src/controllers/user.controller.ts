import type { Request, Response } from "express";
import * as userService from "../services/user.service";
import { BadRequestError, NotFoundError } from "../errors/AppError";
import { updateUserSchema } from "../schemas/user.schema";

export async function getUsers(req: Request, res: Response) {
  const users = await userService.findAllUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const user = await userService.findUserById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json(user);
}

export async function patchUser(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const data = updateUserSchema.parse(req.body);
  const user = await userService.updateUser(id, data);
  res.json(user);
}

export async function removeUser(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await userService.deleteUser(id);
  res.status(204).send();
}
