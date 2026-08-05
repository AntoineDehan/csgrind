import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type TokenPayload = {
  userId: string;
  purpose?: "steam_link";
};

export function signToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "1d" });
}

export function signTokenSteam(userId: string): string {
  return jwt.sign({ userId, purpose: "steam_link" }, env.JWT_SECRET, {
    expiresIn: "10min",
  });
}

export function verifyToken(token: string): TokenPayload {
  const decodedToken = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
  });

  return decodedToken as TokenPayload;
}
