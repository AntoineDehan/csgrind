import type { Request, Response, NextFunction } from "express";
import { findUserById } from "../services/user.service";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.userId) throw new UnauthorizedError();

  const user = await findUserById(req.userId);
  if (!user) throw new UnauthorizedError();
  if (user.role !== "ADMIN") throw new ForbiddenError();

  next();
}
