import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().max(50).optional(),
  image: z.string().max(500).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
