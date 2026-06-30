import jwt from "jsonwebtoken";

export type TokenPayload = {
  userId: string;
};

function getSecret() {
  const secretToken = process.env.JWT_SECRET;
  return secretToken;
}

export function signToken(userId: string): string {
  const secretToken = getSecret();

  if (!secretToken) throw "Secret token missing";
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

  if (!secretToken) throw "Secret token missing";
  const signedToken = jwt.sign(
    {
      userId,
    },
    secretToken,
    { expiresIn: "10min" },
  );

  return signedToken;
}

export function verifyToken(token: string): TokenPayload {
  const secretToken = getSecret();

  if (!secretToken) throw "Secret token missing";

  const decodedToken = jwt.verify(token, secretToken);

  return decodedToken as TokenPayload;
}
