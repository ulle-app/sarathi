import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

// Paths to exclude from logging (health checks, etc.)
const EXCLUDED_PATHS = ['/health', '/favicon.ico'];

// Sensitive headers that should not be logged
const SENSITIVE_HEADERS = ['authorization', 'cookie', 'x-api-key'];

/**
 * HTTP request logging middleware
 * Logs all incoming requests with timing information
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Skip excluded paths
  if (EXCLUDED_PATHS.some(path => req.path === path)) {
    return next();
  }

  const startTime = Date.now();
  const requestId = req.requestId || 'unknown';

  // Build safe headers object (excluding sensitive headers)
  const safeHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!SENSITIVE_HEADERS.includes(key.toLowerCase()) && typeof value === 'string') {
      safeHeaders[key] = value;
    }
  }

  // Log request start (only in development)
  if (env.nodeEnv !== 'production') {
    logger.debug(`--> ${req.method} ${req.path}`, {
      requestId,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
    });
  }

  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Determine log level based on status code
    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    const logMessage = `${req.method} ${req.path} ${statusCode} ${duration}ms`;
    
    const logMeta = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      userId: req.user?.id,
    };

    logger[logLevel](logMessage, env.nodeEnv === 'production' ? undefined : logMeta);
  });

  next();
}
