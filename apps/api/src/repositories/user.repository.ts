import { getSupabaseAdmin } from '../config/supabase.js';
import { verifyPassword } from '../utils/password.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { env } from '../config/env.js';
import crypto from 'crypto';

// Fields that should be encrypted at rest
const ENCRYPTED_FIELDS = ['location', 'date_of_birth'] as const;
const ENABLE_ENCRYPTION = env.nodeEnv === 'production'; // Enable in production

// User interface matching Supabase schema
export interface IUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  location: string | null;
  avatar: string | null;
  email_notifications: boolean;
  dark_mode: boolean;
  roles: string[];
  is_email_verified: boolean;
  last_login_at: string | null;
  academic_level?: 'grade_10' | 'grade_12' | 'undergraduate' | 'post_graduate' | 'professional';
  created_at: string;
  updated_at: string;
}

// User profile for API responses (excludes sensitive data)
export interface IUserProfile {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    location: string | null;
    avatar: string | null;
    academicLevel?: 'grade_10' | 'grade_12' | 'undergraduate' | 'post_graduate' | 'professional';
  };
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
  };
  roles: string[];
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Encrypt sensitive fields before storing in database
 */
function encryptUserData(data: Partial<IUser>): Partial<IUser> {
  if (!ENABLE_ENCRYPTION) return data;
  
  const encrypted = { ...data };
  for (const field of ENCRYPTED_FIELDS) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encrypt(encrypted[field] as string);
    }
  }
  return encrypted;
}

/**
 * Decrypt sensitive fields after retrieving from database
 */
function decryptUserData(user: IUser | null): IUser | null {
  if (!user || !ENABLE_ENCRYPTION) return user;
  
  const decrypted = { ...user };
  for (const field of ENCRYPTED_FIELDS) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      try {
        decrypted[field] = decrypt(decrypted[field] as string) as typeof decrypted[typeof field];
      } catch {
        // Field might not be encrypted (legacy data)
      }
    }
  }
  return decrypted;
}

// Convert database row to API response format
export function toUserProfile(user: IUser): IUserProfile {
  // Ensure user data is decrypted before converting to profile
  const decryptedUser = decryptUserData(user) || user;
  
  return {
    id: decryptedUser.id,
    email: decryptedUser.email,
    profile: {
      firstName: decryptedUser.first_name,
      lastName: decryptedUser.last_name,
      dateOfBirth: decryptedUser.date_of_birth,
      location: decryptedUser.location,
      avatar: decryptedUser.avatar,
      academicLevel: decryptedUser.academic_level,
    },
    preferences: {
      emailNotifications: decryptedUser.email_notifications,
      darkMode: decryptedUser.dark_mode,
    },
    roles: decryptedUser.roles,
    isEmailVerified: decryptedUser.is_email_verified,
    lastLoginAt: decryptedUser.last_login_at,
    createdAt: decryptedUser.created_at,
    updatedAt: decryptedUser.updated_at,
  };
}

export class UserRepository {
  private get db() {
    return getSupabaseAdmin();
  }

  async create(data: {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    roles: string[];
    is_email_verified: boolean;
    academic_level?: string;
  }): Promise<IUser | null> {
    const { data: user, error } = await this.db
      .from('users')
      .insert({
        email: data.email.toLowerCase(),
        password_hash: data.password_hash,
        first_name: data.first_name,
        last_name: data.last_name,
        email_notifications: true,
        dark_mode: false,
        roles: data.roles,
        is_email_verified: data.is_email_verified,
        academic_level: data.academic_level,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Email already registered');
      }
      throw error;
    }
    if (!user) throw new Error('User creation failed');

    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    const { data: user, error } = await this.db
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Decrypt sensitive fields before returning
    return decryptUserData(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const { data: user, error } = await this.db
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Decrypt sensitive fields before returning
    return decryptUserData(user);
  }

  async verifyPassword(user: IUser, password: string): Promise<boolean> {
    return verifyPassword(password, user.password_hash);
  }

  async updateLastLogin(id: string): Promise<void> {
    const { error } = await this.db
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  async update(
    id: string,
    data: Partial<{
      first_name: string;
      last_name: string;
      date_of_birth: string;
      location: string | null;
      avatar: string | null;
      email_notifications: boolean;
      dark_mode: boolean;
      last_login_at: string;
    }>
  ): Promise<IUser | null> {
    // Encrypt sensitive fields before storing
    const encryptedData = encryptUserData(data as Partial<IUser>);
    const updateData: Record<string, unknown> = { ...encryptedData };

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    updateData.updated_at = new Date().toISOString();

    const { data: user, error } = await this.db
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return user;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

// Refresh Token Repository
export interface IRefreshToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export class RefreshTokenRepository {
  private get db() {
    return getSupabaseAdmin();
  }

  generateToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  async create(data: {
    user_id: string;
    token: string;
    expires_at: string;
  }): Promise<IRefreshToken> {
    const { data: tokenDoc, error } = await this.db
      .from('refresh_tokens')
      .insert({
        user_id: data.user_id,
        token: data.token,
        expires_at: data.expires_at,
      })
      .select()
      .single();

    if (error) throw error;

    return tokenDoc;
  }

  async findValidToken(token: string): Promise<IRefreshToken | null> {
    const { data, error } = await this.db
      .from('refresh_tokens')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db
      .from('refresh_tokens')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async deleteByToken(userId: string, token: string): Promise<void> {
    const { error } = await this.db
      .from('refresh_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('token', token);

    if (error) throw error;
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const { error } = await this.db
      .from('refresh_tokens')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  async deleteExpired(): Promise<void> {
    const { error } = await this.db
      .from('refresh_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;
  }
}

// Singleton instances
export const userRepository = new UserRepository();
export const refreshTokenRepository = new RefreshTokenRepository();
