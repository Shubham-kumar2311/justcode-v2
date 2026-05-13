import { Router } from 'express';
import { submissionController } from './submission.controller';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/requireAuth.middleware';
import { submitCodeSchema, submissionHistoryQuerySchema } from './submission.validation';

const router = Router();

// Submissions always require authentication
router.use(requireAuth);

router.post('/submit', validate(submitCodeSchema), submissionController.submitCode);
router.get('/history', validate(submissionHistoryQuerySchema, 'query'), submissionController.getHistory);

export { router as submissionRoutes };
