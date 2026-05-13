import { Router } from 'express';
import { userController } from './user.controller';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/requireAuth.middleware';
import { updateProfileSchema } from './user.validation';

const router = Router();

router.use(requireAuth); // All user routes require authentication

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

export { router as userRoutes };
