import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../shared/errors';

/**
 * Zod validation middleware factory.
 * Validates req.body, req.query, and req.params against the provided schema.
 *
 * Usage: router.post('/login', validate(loginSchema), controller.login)
 */
export function validate(schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      throw new ValidationError('Validation failed', formattedErrors);
    }

    // Overwrite with parsed (coerced/default) values
    req[target] = result.data;

    next();
  };
}
