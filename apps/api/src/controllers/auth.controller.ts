import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';
import { env } from '../config/env.js';

// Cookie options for refresh token
const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? ('strict' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

// Register a new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, academicLevel } = req.body;

  const { user, tokens } = await authService.register({
    email,
    password,
    firstName,
    lastName,
    academicLevel,
  });

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', tokens.refreshToken, refreshTokenCookieOptions);

  sendCreated(res, {
    user,
    accessToken: tokens.accessToken,
  }, 'Registration successful');
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, tokens } = await authService.login({ email, password });

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', tokens.refreshToken, refreshTokenCookieOptions);

  sendSuccess(res, {
    user,
    accessToken: tokens.accessToken,
  }, 'Login successful');
});

// Refresh access token
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Get refresh token from cookie or body
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Refresh token required',
    });
    return;
  }

  const tokens = await authService.refreshTokens(token);

  // Set new refresh token in cookie
  res.cookie('refreshToken', tokens.refreshToken, refreshTokenCookieOptions);

  sendSuccess(res, {
    accessToken: tokens.accessToken,
  }, 'Token refreshed');
});

// Logout user
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const refreshToken = req.cookies.refreshToken;

  if (userId) {
    await authService.logout(userId, refreshToken);
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    ...refreshTokenCookieOptions,
    maxAge: 0,
  });

  sendSuccess(res, null, 'Logged out successfully');
});

// Logout from all devices
export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (userId) {
    await authService.logoutAll(userId);
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    ...refreshTokenCookieOptions,
    maxAge: 0,
  });

  sendSuccess(res, null, 'Logged out from all devices');
});

// Get current user profile
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, { user: req.user });
});

// Update current user profile
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { firstName, lastName, dateOfBirth, location, preferences } = req.body;

  if (!userId) {
    res.status(401).json({
      success: false,
      error: 'User not authenticated',
    });
    return;
  }

  const updatedUser = await authService.updateUser(userId, {
    firstName,
    lastName,
    dateOfBirth,
    location,
    preferences,
  });

  sendSuccess(res, { user: updatedUser }, 'Profile updated');
});

// Delete current user account
export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      error: 'User not authenticated',
    });
    return;
  }

  await authService.deleteUser(userId);

  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    ...refreshTokenCookieOptions,
    maxAge: 0,
  });

  sendNoContent(res);
});
