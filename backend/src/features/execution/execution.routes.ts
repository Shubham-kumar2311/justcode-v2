import { Router } from 'express';
import { executionController } from './execution.controller';
import { validate } from '../../middleware/validate.middleware';
import { runCodeSchema } from './execution.validation';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Running code is stateless, so authentication is optional (authMiddleware parses token but doesn't block)
router.post('/run', validate(runCodeSchema), authMiddleware, executionController.runCode);

export { router as executionRoutes };
