import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import { registerUserSchema, loginUserSchema } from "../schemas/auth.schema";

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

  try {
    const token = await authService.loginUser(result.data);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: "Invalid credentials" });
  }
}

export async function me(req: Request, res: Response) {
  if (!req.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await userService.findUserById(req.userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
}
