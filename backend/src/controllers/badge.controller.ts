import type { Request, Response } from "express";
import * as badgeRepo from "../repositories/badge.repository";
import { createBadgeSchema, updateBadgeSchema } from "../schemas/badge.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function getBadges(req: Request, res: Response) {
  const badges = await badgeRepo.findAllBadges();
  res.json(badges);
}

export async function getBadge(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const badge = await badgeRepo.findBadgeById(id);
  if (!badge) {
    throw new NotFoundError("Badge not found");
  }

  res.json(badge);
}

export async function postBadge(req: Request, res: Response) {
  const data = createBadgeSchema.parse(req.body);
  const badge = await badgeRepo.createBadge(data);
  res.status(201).json(badge);
}

export async function patchBadge(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const data = updateBadgeSchema.parse(req.body);
  const badge = await badgeRepo.updateBadge(id, data);
  res.json(badge);
}

export async function removeBadge(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await badgeRepo.deleteBadge(id);
  res.status(204).send();
}
