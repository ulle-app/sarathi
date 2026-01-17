import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  roles: string[];
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

// Parse duration string to seconds (e.g., "15m" -> 900, "7d" -> 604800)
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
  }
}

export function generateAccessToken(
  userId: string,
  email: string,
  roles: string[]
): string {
  const payload: TokenPayload = {
    userId,
    email,
    roles,
  };

  // Convert string duration to seconds for the SignOptions
  const expiresInSeconds = parseDuration(env.jwtExpiresIn);

  const options: SignOptions = {
    expiresIn: expiresInSeconds,
    algorithm: 'HS256',
  };

  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyAccessToken(token: string): DecodedToken {
  return jwt.verify(token, env.jwtSecret) as DecodedToken;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch {
    return null;
  }
}

export function getRefreshTokenExpiry(): Date {
  const seconds = parseDuration(env.refreshTokenExpiresIn);
  return new Date(Date.now() + seconds * 1000);
}

export function getAccessTokenExpiry(): Date {
  const seconds = parseDuration(env.jwtExpiresIn);
  return new Date(Date.now() + seconds * 1000);
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  return Date.now() >= decoded.exp * 1000;
}
