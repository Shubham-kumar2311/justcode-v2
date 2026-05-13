import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator';
import { SUPPORTED_LANGUAGES } from '../../shared/constants/languages';

export const runCodeSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string().refine(val => SUPPORTED_LANGUAGES.includes(val), {
    message: `Unsupported language. Must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
  }),
  problemId: objectIdSchema,
});

export type RunCodeInput = z.infer<typeof runCodeSchema>;
