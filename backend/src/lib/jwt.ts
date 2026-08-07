import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type TokenPurpose = "session" | "steam_link" | "email_verify";

export type TokenPayload = {
  userId: string;
  purpose: TokenPurpose;
};

export function signToken(userId: string): string {
  return jwt.sign({ userId, purpose: "session" }, env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function signTokenSteam(userId: string): string {
  return jwt.sign({ userId, purpose: "steam_link" }, env.JWT_SECRET, {
    expiresIn: "10min",
  });
}

export function signTokenEmailVerify(userId: string): string {
  return jwt.sign({ userId, purpose: "email_verify" }, env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

export function verifyToken(token: string): TokenPayload {
  const decodedToken = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
  });

  return decodedToken as TokenPayload;
}
