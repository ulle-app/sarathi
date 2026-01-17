import cors from 'cors';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // In production, always require origin
    if (env.nodeEnv === 'production') {
      if (!origin) {
        callback(new Error('Origin required'));
        return;
      }
      
      if (env.corsOrigin.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
      return;
    }

    // In development, allow requests with no origin (curl, postman, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if origin is in allowed list
    if (env.corsOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'X-Request-ID',
  ],
  exposedHeaders: ['Set-Cookie', 'X-Request-ID', 'RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  maxAge: 86400, // 24 hours - cache preflight requests
};

export const corsMiddleware = cors(corsOptions);
