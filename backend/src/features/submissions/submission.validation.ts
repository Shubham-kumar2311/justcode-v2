import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator';
import { SUPPORTED_LANGUAGES } from '../../shared/constants/languages';
import { paginationSchema } from '../../shared/validators/pagination.validator';

export const submitCodeSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string().refine(val => SUPPORTED_LANGUAGES.includes(val), {
    message: `Unsupported language. Must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
  }),
  problemId: objectIdSchema,
});

export const submissionHistoryQuerySchema = paginationSchema.extend({
  problemId: objectIdSchema.optional(),
});

export type SubmitCodeInput = z.infer<typeof submitCodeSchema>;
export type SubmissionHistoryQuery = z.infer<typeof submissionHistoryQuerySchema>;
