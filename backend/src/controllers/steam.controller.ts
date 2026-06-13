import type { Request, Response } from "express";
import * as userService from "../services/user.service";
import { getSteamRedirectUrl, verifySteamReturn } from "../lib/steam";
import { signToken, verifyToken } from "../lib/jwt";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/AppError";

export function startSteamLink(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const realm = process.env.STEAM_REALM;
  const returnUrl = process.env.STEAM_RETURN_URL;
  if (!realm || !returnUrl) {
    throw new AppError("Steam config missing", 500);
  }

  const state = signToken(userId);
  const returnTo = `${returnUrl}?state=${state}`;
  res.json({ url: getSteamRedirectUrl(returnTo, realm) });
}

export async function steamReturn(req: Request, res: Response) {
  const state = req.query.state;
  if (typeof state !== "string") {
    throw new BadRequestError("Missing state");
  }

  let userId: string;
  let steam64Id: string;
  try {
    userId = verifyToken(state).userId;
    steam64Id = await verifySteamReturn(req.query as Record<string, string>);
  } catch {
    throw new UnauthorizedError("Steam authentication failed");
  }

  await userService.updateUser(userId, { steam64Id });
  res.json({ message: "Steam linked", steam64Id });
}
