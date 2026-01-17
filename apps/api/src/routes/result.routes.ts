import { Router, type Router as RouterType } from 'express';
import {
  getResults,
  getResult,
  getResultInsights,
} from '../controllers/assessment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Apply rate limiting
router.use(apiLimiter);

// Result routes
router.get('/', getResults);
router.get('/:id', getResult);
router.get('/:id/insights', getResultInsights);

export default router;
