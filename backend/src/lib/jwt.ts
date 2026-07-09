import jwt from "jsonwebtoken";

export type TokenPayload = {
  userId: string;
  purpose?: "steam_link";
};

function getSecret() {
  const secretToken = process.env.JWT_SECRET;
  return secretToken;
}

export function signToken(userId: string): string {
  const secretToken = getSecret();

  if (!secretToken) throw new Error("JWT_SECRET is not configured");
  const signedToken = jwt.sign(
    {
      userId,
    },
    secretToken,
    { expiresIn: "1d" },
  );

  return signedToken;
}

export function signTokenSteam(userId: string): string {
  const secretToken = getSecret();

  if (!secretToken) throw new Error("JWT_SECRET is not configured");
  const signedToken = jwt.sign(
    {
      userId,
      purpose: "steam_link",
    },
    secretToken,
    { expiresIn: "10min" },
  );

  return signedToken;
}

export function verifyToken(token: string): TokenPayload {
  const secretToken = getSecret();

  if (!secretToken) throw new Error("JWT_SECRET is not configured");

  const decodedToken = jwt.verify(token, secretToken, {
    algorithms: ["HS256"],
  });

  return decodedToken as TokenPayload;
}
