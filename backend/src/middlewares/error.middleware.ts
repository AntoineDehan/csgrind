import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../errors/AppError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ message: "Resource already exists" });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ message: "Resource not found" });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ message: "Server error" });
}
