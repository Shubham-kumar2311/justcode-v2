import { z } from 'zod';
import { SUPPORTED_LANGUAGES } from '../../shared/constants/languages';

const baseAISchema = z.object({
  code: z.string(),
  language: z.string().refine(val => SUPPORTED_LANGUAGES.includes(val), {
    message: `Unsupported language. Must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
  }),
});

export const askHintSchema = baseAISchema.extend({
  problemDescription: z.string().min(1),
  query: z.string().min(1),
  inputFormat: z.string().optional(),
});

export const reviewCodeSchema = baseAISchema;

export const complexitySchema = baseAISchema;

export type AskHintInput = z.infer<typeof askHintSchema>;
export type ReviewCodeInput = z.infer<typeof reviewCodeSchema>;
export type ComplexityInput = z.infer<typeof complexitySchema>;
