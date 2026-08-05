import type { Request } from "express";
import { UnauthorizedError } from "../errors/AppError";

export function getUserId(req: Request): string {
  if (!req.userId) throw new UnauthorizedError();
  return req.userId;
}
