import { z } from "zod";
import { createUserSchema } from "./user.schema";

export const registerUserSchema = createUserSchema;

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
