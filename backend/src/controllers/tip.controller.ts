import type { Request, Response } from "express";
import * as tipRepo from "../repositories/tip.repository";
import { createTipSchema, updateTipSchema } from "../schemas/tip.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function getTips(req: Request, res: Response) {
  const tips = await tipRepo.findAllTips();
  res.json(tips);
}

export async function getTip(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const tip = await tipRepo.findTipById(id);
  if (!tip) {
    throw new NotFoundError("Tip not found");
  }

  res.json(tip);
}

export async function postTip(req: Request, res: Response) {
  const data = createTipSchema.parse(req.body);
  const tip = await tipRepo.createTip(data);
  res.status(201).json(tip);
}

export async function patchTip(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const data = updateTipSchema.parse(req.body);
  const tip = await tipRepo.updateTip(id, data);
  res.json(tip);
}

export async function removeTip(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await tipRepo.deleteTip(id);
  res.status(204).send();
}
