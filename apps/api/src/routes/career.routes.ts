import { Router, type Router as RouterType } from 'express';
import {
  getCareers,
  getCategories,
  getCareer,
  getRecommendations,
  getSkillGap,
  getRelatedCareers,
} from '../controllers/career.controller.js';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Apply rate limiting
router.use(apiLimiter);

// Career routes
router.get('/', getCareers);
router.get('/categories', getCategories);
router.get('/recommendations', getRecommendations);
router.get('/:id', getCareer);
router.get('/:id/skill-gap', getSkillGap);
router.get('/:id/related', getRelatedCareers);

export default router;
