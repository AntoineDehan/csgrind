import type { Request, Response } from "express";
import * as userService from "../services/user.service";
import { getSteamRedirectUrl, verifySteamReturn } from "../lib/steam";
import { signToken, verifyToken } from "../lib/jwt";

export function startSteamLink(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const realm = process.env.STEAM_REALM;
  const returnUrl = process.env.STEAM_RETURN_URL;
  if (!realm || !returnUrl) {
    res.status(500).json({ message: "Steam config missing" });
    return;
  }

  const state = signToken(userId);
  const returnTo = `${returnUrl}?state=${state}`;
  res.json({ url: getSteamRedirectUrl(returnTo, realm) });
}

export async function steamReturn(req: Request, res: Response) {
  const state = req.query.state;
  if (typeof state !== "string") {
    res.status(400).json({ message: "Missing state" });
    return;
  }

  try {
    const { userId } = verifyToken(state);
    const steam64Id = await verifySteamReturn(
      req.query as Record<string, string>,
    );

    await userService.updateUser(userId, { steam64Id });
    res.json({ message: "Steam linked", steam64Id });
  } catch (err) {
    res.status(401).json({ message: "Steam authentication failed" });
  }
}
