import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
