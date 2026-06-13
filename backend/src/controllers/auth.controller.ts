import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import { registerUserSchema, loginUserSchema } from "../schemas/auth.schema";
import { NotFoundError, UnauthorizedError } from "../errors/AppError";

export async function register(req: Request, res: Response) {
  const result = registerUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const user = await authService.registerUser(result.data);

  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const result = loginUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const token = await authService.loginUser(result.data);
  res.json({ token });
}

export async function me(req: Request, res: Response) {
  if (!req.userId) {
    throw new UnauthorizedError();
  }

  const user = await userService.findUserById(req.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json(user);
}
