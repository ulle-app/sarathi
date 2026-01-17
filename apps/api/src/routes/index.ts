import { Router, type Router as RouterType } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import assessmentRoutes from './assessment.routes.js';
import resultRoutes from './result.routes.js';
import careerRoutes from './career.routes.js';

const router: RouterType = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/results', resultRoutes);
router.use('/careers', careerRoutes);

// API info endpoint
router.get('/', (_req, res) => {
  res.json({
    name: 'SkillSphere API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      assessments: '/api/v1/assessments',
      results: '/api/v1/results',
      careers: '/api/v1/careers',
    },
  });
});

export default router;
