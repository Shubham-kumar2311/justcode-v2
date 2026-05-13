import { Router } from 'express';
import { problemController } from './problem.controller';
import { validate } from '../../middleware/validate.middleware';
import { problemListQuerySchema } from './problem.validation';
import { objectIdParamSchema } from '../../shared/validators/objectId.validator';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Routes use authMiddleware (optional auth) to determine if user is logged in
router.get('/', validate(problemListQuerySchema, 'query'), authMiddleware, problemController.getProblems);
router.get('/:id', validate(objectIdParamSchema, 'params'), authMiddleware, problemController.getProblemById);

export { router as problemRoutes };
