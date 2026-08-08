import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  markEmailVerified,
} from "../repositories/user.repository";
import type { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema";
import { signToken, signTokenEmailVerify, verifyToken } from "../lib/jwt";
import { sendVerificationEmail } from "../lib/mailer";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../errors/AppError";

export async function registerUser(payload: RegisterUserInput) {
  const hash = await bcrypt.hash(payload.password, 10);

  const user = await createUser({ email: payload.email, password: hash });

  try {
    await sendVerificationEmail(user.email, signTokenEmailVerify(user.id));
  } catch (error) {
    console.error(`Verification email failed for user ${user.id}:`, error);
  }

  return user;
}

export async function verifyEmail(token: string) {
  let userId: string;

  try {
    const payload = verifyToken(token);
    if (payload.purpose !== "email_verify") throw new Error("Wrong purpose");
    userId = payload.userId;
  } catch {
    throw new BadRequestError("This link is invalid or has expired");
  }

  await markEmailVerified(userId);
}

export async function resendVerification(email: string) {
  const user = await findUserByEmail(email);
  if (!user || user.emailVerified) return;

  try {
    await sendVerificationEmail(user.email, signTokenEmailVerify(user.id));
  } catch (error) {
    console.error(`Verification email failed for user ${user.id}:`, error);
  }
}

export async function loginUser(payload: LoginUserInput) {
  const user = await findUserByEmail(payload.email);
  if (!user) throw new UnauthorizedError("Invalid credentials");

  const ok = await bcrypt.compare(payload.password, user.password);
  if (!ok) throw new UnauthorizedError("Invalid credentials");

  if (!user.emailVerified)
    throw new ForbiddenError("Please verify your email before signing in.");

  const token = signToken(user.id);

  return token;
}
