import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: Array<{ field: string; message: string }>
): Response {
  const response: ApiResponse = {
    success: false,
    error: message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Resource created successfully'
): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

export function sendUnauthorized(
  res: Response,
  message = 'Unauthorized'
): Response {
  return sendError(res, message, 401);
}

export function sendForbidden(
  res: Response,
  message = 'Forbidden'
): Response {
  return sendError(res, message, 403);
}

export function sendNotFound(
  res: Response,
  message = 'Resource not found'
): Response {
  return sendError(res, message, 404);
}

export function sendValidationError(
  res: Response,
  errors: Array<{ field: string; message: string }>
): Response {
  return sendError(res, 'Validation failed', 422, errors);
}

export function sendInternalError(
  res: Response,
  message = 'Internal server error'
): Response {
  return sendError(res, message, 500);
}
