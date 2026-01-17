import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUserProfile } from '../repositories/user.repository.js';
import { sendUnauthorized, sendForbidden } from '../utils/response.js';

// Authenticate using JWT
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: IUserProfile | false, info: { message?: string }) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const message = info?.message || 'Authentication required';
        return sendUnauthorized(res, message);
      }

      req.user = user;
      next();
    }
  )(req, res, next);
}

// Optional authentication - doesn't fail if no token
export function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: IUserProfile | false) => {
      if (err) {
        return next(err);
      }

      if (user) {
        req.user = user;
      }

      next();
    }
  )(req, res, next);
}

// Role-based authorization
export function authorize(...allowedRoles: ('user' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      sendForbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
}

// Verify email verified status
export function requireEmailVerified(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    sendUnauthorized(res, 'Authentication required');
    return;
  }

  if (!req.user.isEmailVerified) {
    sendForbidden(res, 'Email verification required');
    return;
  }

  next();
}
