import type { Request, Response } from "express";
import * as userRepo from "../repositories/user.repository";
import {
  getSteamRedirectUrl,
  verifySteamReturn,
  fetchSteamPlayerSummary,
} from "../lib/steam";
import { signTokenSteam, verifyToken } from "../lib/jwt";
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

  const state = signTokenSteam(userId);
  const returnTo = `${returnUrl}?state=${state}`;
  res.json({ url: getSteamRedirectUrl(returnTo, realm) });
}

export async function steamReturn(req: Request, res: Response) {
  const front = process.env.SITE_URL ?? "http://localhost:5173";
  const state = req.query.state;

  try {
    if (typeof state !== "string") throw new Error("Missing state");

    const payload = verifyToken(state);
    if (payload.purpose !== "steam_link") throw new Error("Invalid state token");
    const userId = payload.userId;
    const steam64Id = await verifySteamReturn(
      req.query as Record<string, string>,
    );

    await userRepo.linkSteamAccount(userId, steam64Id);

    try {
      const summary = await fetchSteamPlayerSummary(steam64Id);
      if (summary) {
        await userRepo.updateUser(userId, {
          name: summary.name || undefined,
          image: summary.avatar || undefined,
        });
      }
    } catch (error) {
      console.error(`Steam profile sync failed for ${steam64Id}:`, error);
    }

    res.redirect(`${front}/dashboard?steam=linked`);
  } catch {
    res.redirect(`${front}/dashboard?steam=error`);
  }
}
