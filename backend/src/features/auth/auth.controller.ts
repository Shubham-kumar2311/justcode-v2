import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { env } from '../../config/env';

export class AuthController {
  private setCookie(res: Response, token: string) {
    // Determine if we're in production (HTTPS)
    // For Vercel/Railway, proxy might set X-Forwarded-Proto
    const isProduction = env.NODE_ENV === 'production';
    
    res.cookie('uid', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax', // 'none' needed for cross-site cookies in prod if frontend/backend domains differ
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, token } = await authService.signup(req.body);
      
      this.setCookie(res, token);
      
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, token } = await authService.login(req.body);
      
      this.setCookie(res, token);

      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isProduction = env.NODE_ENV === 'production';
      res.clearCookie('uid', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
      });
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // If requireAuth middleware passed, req.user is guaranteed
      res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
