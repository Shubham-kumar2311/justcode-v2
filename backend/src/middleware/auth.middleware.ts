import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtUserPayload } from '../shared/types/express';

/**
 * Checks for JWT in the 'uid' cookie on every request.
 * Sets req.user if valid, null otherwise. Never blocks.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.uid;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
    req.user = payload;
  } catch {
    req.user = null;
  }

  next();
}
