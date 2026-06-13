import type { Request, Response } from "express";
import * as badgeService from "../services/badge.service";
import { createBadgeSchema } from "../schemas/badge.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function getBadges(req: Request, res: Response) {
  const badges = await badgeService.findAllBadges();
  res.json(badges);
}

export async function getBadge(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const badge = await badgeService.findBadgeById(id);
  if (!badge) {
    throw new NotFoundError("Badge not found");
  }

  res.json(badge);
}

export async function postBadge(req: Request, res: Response) {
  const result = createBadgeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const badge = await badgeService.createBadge(result.data);
  res.status(201).json(badge);
}

export async function patchBadge(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const badge = await badgeService.updateBadge(id, req.body);
  res.json(badge);
}

export async function removeBadge(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await badgeService.deleteBadge(id);
  res.status(204).send();
}
