import { z } from 'zod';
import mongoose from 'mongoose';

export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid ObjectId format' }
);

export const objectIdParamSchema = z.object({
  id: objectIdSchema,
});
