import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/requireAuth.middleware';
import { signupSchema, loginSchema } from './auth.validation';
import { env } from '../../config/env';

import passport from 'passport';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

// Middleware to check if OAuth is configured
const checkOAuthConfig = (provider: 'google' | 'github') => {
  return (req: any, res: any, next: any) => {
    if (provider === 'google' && env.GOOGLE_CLIENT_ID === 'placeholder') {
      return res.redirect(`${env.FRONTEND_URL}/login?error=OAuthNotConfigured`);
    }
    if (provider === 'github' && env.GITHUB_CLIENT_ID === 'placeholder') {
      return res.redirect(`${env.FRONTEND_URL}/login?error=OAuthNotConfigured`);
    }
    next();
  };
};

// Google OAuth
router.get('/google', checkOAuthConfig('google'), passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', checkOAuthConfig('google'), passport.authenticate('google', { session: false, failureRedirect: '/login?error=OAuthFailed' }), authController.oauthCallback);

// GitHub OAuth
router.get('/github', checkOAuthConfig('github'), passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', checkOAuthConfig('github'), passport.authenticate('github', { session: false, failureRedirect: '/login?error=OAuthFailed' }), authController.oauthCallback);

export { router as authRoutes };
