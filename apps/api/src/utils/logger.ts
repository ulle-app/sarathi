import winston from 'winston';
import { env } from '../config/env.js';

// Sensitive fields that should be redacted in logs
const SENSITIVE_FIELDS = ['password', 'passwordHash', 'refreshToken', 'accessToken', 'token', 'authorization', 'cookie'];

// Redact sensitive information from objects
function redactSensitive(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitive);
  }

  if (typeof obj === 'object') {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        redacted[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        redacted[key] = redactSensitive(value);
      } else {
        redacted[key] = value;
      }
    }
    return redacted;
  }

  return obj;
}

const redactFormat = winston.format((info) => {
  // Redact sensitive data from metadata
  if (info.meta) {
    info.meta = redactSensitive(info.meta);
  }
  return info;
});

const logFormat = winston.format.combine(
  redactFormat(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: env.nodeEnv !== 'production' }), // Only show stack in non-prod
  winston.format.printf(({ level, message, timestamp, stack }) => {
    if (stack && env.nodeEnv !== 'production') {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const consoleFormat = winston.format.combine(
  redactFormat(),
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

export const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: env.nodeEnv === 'production' ? logFormat : consoleFormat,
    }),
  ],
  // In production, don't exit on uncaught exceptions - let the process manager handle it
  exitOnError: env.nodeEnv !== 'production',
});

// Stream for Morgan HTTP logging
export const httpLogStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
