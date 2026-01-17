import crypto from 'crypto';
import { env } from '../config/env.js';

/**
 * Encryption utility for sensitive user data
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Get or derive the encryption key from environment
 * Uses PBKDF2 to derive a key from the secret
 */
function getEncryptionKey(): Buffer {
  const secret = env.encryptionKey || env.jwtSecret;
  if (!secret) {
    throw new Error('No encryption key configured. Set ENCRYPTION_KEY or JWT_SECRET in environment.');
  }
  
  // Use a fixed salt for key derivation (stored securely in env)
  const salt = env.encryptionSalt || 'sarathi-default-salt-change-in-prod';
  
  // Derive a 256-bit key using PBKDF2
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');
}

/**
 * Encrypt sensitive data
 * @param plaintext - The data to encrypt
 * @returns Base64 encoded encrypted data (iv:authTag:ciphertext)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;
  
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  // Combine iv + authTag + encrypted data
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, 'base64'),
  ]);
  
  return combined.toString('base64');
}

/**
 * Decrypt sensitive data
 * @param encryptedData - Base64 encoded encrypted data (iv:authTag:ciphertext)
 * @returns Decrypted plaintext
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return encryptedData;
  
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract iv, authTag, and encrypted data
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted.toString('base64'), 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // Return original if decryption fails (might be unencrypted legacy data)
    console.warn('Decryption failed, data might not be encrypted:', error);
    return encryptedData;
  }
}

/**
 * Hash sensitive data for searching (deterministic)
 * Use this when you need to search by encrypted fields
 * @param data - Data to hash
 * @returns Hex encoded hash
 */
export function hashForSearch(data: string): string {
  if (!data) return data;
  
  const secret = env.encryptionKey || env.jwtSecret;
  return crypto
    .createHmac('sha256', secret)
    .update(data.toLowerCase().trim())
    .digest('hex');
}

/**
 * Encrypt an object's specified fields
 * @param obj - Object to encrypt
 * @param fields - Array of field names to encrypt
 * @returns Object with encrypted fields
 */
export function encryptFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj };
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = encrypt(result[field]) as T[keyof T];
    }
  }
  return result;
}

/**
 * Decrypt an object's specified fields
 * @param obj - Object to decrypt
 * @param fields - Array of field names to decrypt
 * @returns Object with decrypted fields
 */
export function decryptFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj };
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = decrypt(result[field]) as T[keyof T];
    }
  }
  return result;
}

/**
 * Generate a secure random token
 * @param length - Length in bytes (default 32)
 * @returns Hex encoded token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Check if data appears to be encrypted (basic check)
 * @param data - Data to check
 * @returns True if data looks encrypted
 */
export function isEncrypted(data: string): boolean {
  if (!data) return false;
  
  try {
    const buffer = Buffer.from(data, 'base64');
    // Check if it's at least long enough to contain iv + authTag
    return buffer.length > IV_LENGTH + AUTH_TAG_LENGTH;
  } catch {
    return false;
  }
}
