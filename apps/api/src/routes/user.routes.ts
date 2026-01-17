import { Router, type Router as RouterType } from 'express';
import { getMe, updateMe, deleteMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validator.js';
import { authenticate } from '../middleware/auth.js';
import { updateProfileValidator } from '../validators/auth.validator.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Apply rate limiting to user routes
router.use(apiLimiter);

router.get('/me', getMe);
router.patch('/me', validate(updateProfileValidator), updateMe);
router.delete('/me', deleteMe);

export default router;
