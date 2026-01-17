import express, { Application } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { corsMiddleware } from './config/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { configurePassport } from './config/passport.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { additionalSecurityHeaders, requestId, sanitizeInput } from './middleware/security.js';
import { requestLogger } from './middleware/requestLogger.js';
import routes from './routes/index.js';
import { env } from './config/env.js';

export function createApp(): Application {
  const app = express();

  // Trust proxy for rate limiting behind reverse proxies (Render, Vercel)
  if (env.nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }

  // Request ID for tracing
  app.use(requestId);

  // Request logging (after requestId so we can log it)
  app.use(requestLogger);

  // Security middleware with production-grade settings
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow cross-origin requests
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // Additional security headers
  app.use(additionalSecurityHeaders);

  // CORS
  app.use(corsMiddleware);

  // Body parsing with size limits to prevent DoS
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Sanitize all inputs
  app.use(sanitizeInput);

  // Cookie parsing
  app.use(cookieParser());

  // Global API rate limiting
  app.use('/api', apiLimiter);

  // Passport initialization
  configurePassport();
  app.use(passport.initialize());

  // Health check endpoint (outside rate limiting)
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes
  app.use('/api/v1', routes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
}
