import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  nodeEnv: string;
  port: number;
  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  // JWT Configuration
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  // ML Service Configuration
  mlServiceUrl: string;
  mlServiceApiKey: string;
  // CORS Configuration
  corsOrigin: string[];
  // Encryption Configuration
  encryptionKey: string;
  encryptionSalt: string;
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_KEY',
    'JWT_SECRET',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Parse CORS origins (comma-separated)
  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    // Supabase
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
    // JWT
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    // ML Service
    mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    mlServiceApiKey: process.env.ML_SERVICE_API_KEY || '',
    // CORS
    corsOrigin: corsOrigins,
    // Encryption (uses JWT_SECRET as fallback for development)
    encryptionKey: process.env.ENCRYPTION_KEY || process.env.JWT_SECRET!,
    encryptionSalt: process.env.ENCRYPTION_SALT || 'sarathi-app-salt-change-in-production',
  };
}

export const env = validateEnv();
