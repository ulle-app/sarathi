import { Router, type Router as RouterType } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validator.js';
import { authenticate } from '../middleware/auth.js';
import {
  authLimiter,
  createAccountLimiter,
} from '../middleware/rateLimiter.js';
import {
  registerValidator,
  loginValidator,
} from '../validators/auth.validator.js';

const router: RouterType = Router();

// Public routes with rate limiting
router.post('/register', createAccountLimiter, validate(registerValidator), register);
router.post('/login', authLimiter, validate(loginValidator), login);
router.post('/refresh', authLimiter, refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);

export default router;
