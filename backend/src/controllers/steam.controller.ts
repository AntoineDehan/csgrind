import type { Request, Response } from "express";
import * as userService from "../services/user.service";
import { getSteamRedirectUrl, verifySteamReturn } from "../lib/steam";
import { signToken, verifyToken } from "../lib/jwt";
import { AppError, UnauthorizedError } from "../errors/AppError";

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
  const front = process.env.SITE_URL ?? "http://localhost:5173";
  const state = req.query.state;

  try {
    if (typeof state !== "string") throw new Error("Missing state");

    const userId = verifyToken(state).userId;
    const steam64Id = await verifySteamReturn(
      req.query as Record<string, string>,
    );

    await userService.linkSteamAccount(userId, steam64Id);
    res.redirect(`${front}/dashboard?steam=linked`);
  } catch {
    res.redirect(`${front}/dashboard?steam=error`);
  }
}
