import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../shared/errors';

/**
 * Guard middleware — throws 401 if req.user is not set.
 * Must be placed after authMiddleware in the chain.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new UnauthorizedError('You must be logged in to access this resource');
  }
  next();
}
