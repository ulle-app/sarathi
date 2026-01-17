import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { sendError, sendInternalError, sendValidationError } from '../utils/response.js';
import { env } from '../config/env.js';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found handler
export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}

// Global error handler
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  if (err instanceof ApiError && err.isOperational) {
    logger.warn(`API Error: ${err.message}`, {
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.error('Unexpected error:', err);
  }

  // Handle ApiError
  if (err instanceof ApiError) {
    if (err.errors) {
      sendValidationError(res, err.errors);
      return;
    }
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const mongooseErr = err as unknown as {
      errors: Record<string, { message: string }>;
    };
    const errors = Object.keys(mongooseErr.errors).map((key) => ({
      field: key,
      message: mongooseErr.errors[key].message,
    }));
    sendValidationError(res, errors);
    return;
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, 'Invalid ID format', 400);
    return;
  }

  // Handle MongoDB duplicate key errors
  if ('code' in err && (err as { code: number }).code === 11000) {
    // Don't reveal which field is duplicated in production
    const message = env.nodeEnv === 'production' 
      ? 'A record with this information already exists'
      : 'Duplicate field value';
    sendError(res, message, 409);
    return;
  }

  // Handle JWT errors - use generic message to prevent info leakage
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Authentication failed', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Session expired. Please log in again.', 401);
    return;
  }

  // Handle payload too large
  if (err.name === 'PayloadTooLargeError' || (err as { type?: string }).type === 'entity.too.large') {
    sendError(res, 'Request payload too large', 413);
    return;
  }

  // Handle syntax errors in JSON
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Invalid JSON in request body', 400);
    return;
  }

  // Default error response - never leak stack traces in production
  const message = env.nodeEnv === 'production'
    ? 'An unexpected error occurred. Please try again later.'
    : err.message;

  sendInternalError(res, message);
}

// Async handler wrapper to catch async errors
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
