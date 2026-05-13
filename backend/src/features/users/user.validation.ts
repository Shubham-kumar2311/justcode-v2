import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).trim().optional(),
  email: z.string().email().trim().toLowerCase().optional(),
  password: z.string().min(6).max(100).optional(),
}).refine(data => data.username || data.email || data.password, {
  message: 'At least one field must be provided to update',
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
