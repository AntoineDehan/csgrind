import type { Request, Response } from "express";
import * as tipService from "../services/tip.service";
import { createTipSchema, updateTipSchema } from "../schemas/tip.schema";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function getTips(req: Request, res: Response) {
  const tips = await tipService.findAllTips();
  res.json(tips);
}

export async function getTip(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const tip = await tipService.findTipById(id);
  if (!tip) {
    throw new NotFoundError("Tip not found");
  }

  res.json(tip);
}

export async function postTip(req: Request, res: Response) {
  const data = createTipSchema.parse(req.body);
  const tip = await tipService.createTip(data);
  res.status(201).json(tip);
}

export async function patchTip(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  const data = updateTipSchema.parse(req.body);
  const tip = await tipService.updateTip(id, data);
  res.json(tip);
}

export async function removeTip(req: Request, res: Response) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new BadRequestError("Invalid id");
  }

  await tipService.deleteTip(id);
  res.status(204).send();
}
