import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { UnauthorizedError } from "../errors/AppError";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) throw new UnauthorizedError();

  const token = header.split(" ")[1];
  if (!token) throw new UnauthorizedError();

  try {
    const payload = verifyToken(token);
    if (payload.purpose !== "session") throw new UnauthorizedError();
    req.userId = payload.userId;
  } catch {
    throw new UnauthorizedError();
  }

  next();
}
