import type { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function getUsers(req: Request, res: Response) {
  const users = await userService.findAllUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const user = await userService.findUserById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
}

export async function patchUser(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const user = await userService.updateUser(id, req.body);
  res.json(user);
}

export async function removeUser(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  await userService.deleteUser(id);
  res.status(204).send();
}
