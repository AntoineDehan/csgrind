import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "./user.service";
import type { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema";
import { signToken } from "../lib/jwt";

export async function registerUser(payload: RegisterUserInput) {
  const hash = await bcrypt.hash(payload.password, 10);

  return await createUser({ email: payload.email, password: hash });
}

export async function loginUser(payload: LoginUserInput) {
  const user = await findUserByEmail(payload.email);
  if (!user) throw new Error("Wrong credentials");

  const ok = await bcrypt.compare(payload.password, user.password);
  if (!ok) throw new Error("Wrong credentials");

  const token = signToken(user.id);

  return token;
}
