import { z } from 'zod';
import { paginationSchema } from '../../shared/validators/pagination.validator';

export const problemListQuerySchema = paginationSchema.extend({
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  search: z.string().optional(),
});

export type ProblemListQuery = z.infer<typeof problemListQuerySchema>;
