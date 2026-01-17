import { Router, type Router as RouterType } from 'express';
import {
  getAssessments,
  getAssessment,
  startAssessment,
  saveProgress,
  submitAssessment,
} from '../controllers/assessment.controller.js';
import { validate } from '../middleware/validator.js';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import {
  responsesValidator,
} from '../validators/assessment.validator.js';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Apply rate limiting
router.use(apiLimiter);

// Assessment routes
router.get('/', getAssessments);
router.get('/:id', getAssessment);
router.post('/:id/start', startAssessment);
router.patch('/:id/progress', validate(responsesValidator), saveProgress);
router.post('/:id/submit', validate(responsesValidator), submitAssessment);

export default router;
