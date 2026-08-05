import type { Request, Response } from "express";
import * as authHandler from "../handlers/auth.handler";
import * as userRepo from "../repositories/user.repository";
import { registerUserSchema, loginUserSchema } from "../schemas/auth.schema";
import { NotFoundError, UnauthorizedError } from "../errors/AppError";

export async function register(req: Request, res: Response) {
  const data = registerUserSchema.parse(req.body);
  const user = await authHandler.registerUser(data);

  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const data = loginUserSchema.parse(req.body);
  const token = await authHandler.loginUser(data);
  res.json({ token });
}

export async function me(req: Request, res: Response) {
  if (!req.userId) {
    throw new UnauthorizedError();
  }

  const user = await userRepo.findUserById(req.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json(user);
}
