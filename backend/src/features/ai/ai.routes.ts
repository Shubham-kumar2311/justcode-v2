import { Router } from 'express';
import { aiController } from './ai.controller';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/requireAuth.middleware';
import { askHintSchema, reviewCodeSchema, complexitySchema } from './ai.validation';

const router = Router();

// AI features require authentication (to prevent abuse)
router.use(requireAuth);

router.post('/hint', validate(askHintSchema), aiController.getHint);
router.post('/review', validate(reviewCodeSchema), aiController.reviewCode);
router.post('/complexity', validate(complexitySchema), aiController.analyzeComplexity);

export { router as aiRoutes };
