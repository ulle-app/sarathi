import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { userRepository, refreshTokenRepository, IUser, IUserProfile, toUserProfile } from '../repositories/user.repository.js';
import { generateAccessToken, getRefreshTokenExpiry } from '../utils/jwt.js';
import { hashPassword } from '../utils/password.js';
import { ApiError } from '../middleware/errorHandler.js';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  academicLevel?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: IUserProfile;
  tokens: AuthTokens;
}

class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, firstName, lastName, academicLevel } = input;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError('Email already registered', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      roles: ['user'],
      is_email_verified: false,
      academic_level: academicLevel as any,
    });

    if (!user) {
      throw new ApiError('Failed to create user', 500);
    }

    // Generate tokens
    const tokens = await this.generateAuthTokens(user);

    return { user: toUserProfile(user), tokens };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    // Find user by email (include password hash)
    const user = await userRepository.findByEmail(email.toLowerCase());
    
    // Always perform password comparison to prevent timing attacks
    // even if user doesn't exist
    const dummyHash = '$2b$12$dummy.hash.for.timing.attack.prevention00000';
    const hashToCompare = user?.password_hash || dummyHash;
    
    const isPasswordValid = await bcrypt.compare(password, hashToCompare);
    
    // Check both conditions after the comparison
    if (!user || !isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Update last login
    await userRepository.update(user.id, { last_login_at: new Date().toISOString() });

    // Generate tokens
    const tokens = await this.generateAuthTokens(user);

    return { user: toUserProfile(user), tokens };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // Find the valid refresh token
    const tokenDoc = await refreshTokenRepository.findValidToken(refreshToken);
    if (!tokenDoc) {
      throw new ApiError('Invalid or expired refresh token', 401);
    }

    // Find the user
    const user = await userRepository.findById(tokenDoc.user_id);
    if (!user) {
      // Delete the orphaned token
      await refreshTokenRepository.delete(tokenDoc.id);
      throw new ApiError('User not found', 401);
    }

    // Delete the used refresh token (token rotation)
    await refreshTokenRepository.delete(tokenDoc.id);

    // Generate new tokens
    const tokens = await this.generateAuthTokens(user);

    return tokens;
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Delete specific refresh token
      await refreshTokenRepository.deleteByToken(userId, refreshToken);
    } else {
      // Delete all refresh tokens for user (logout from all devices)
      await refreshTokenRepository.revokeAllForUser(userId);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await refreshTokenRepository.revokeAllForUser(userId);
  }

  private async generateAuthTokens(user: IUser): Promise<AuthTokens> {
    // Generate access token
    const accessToken = generateAccessToken(
      user.id,
      user.email,
      user.roles
    );

    // Generate refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');

    // Save refresh token to database
    await refreshTokenRepository.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: getRefreshTokenExpiry().toISOString(),
    });

    return { accessToken, refreshToken };
  }

  async getUserById(userId: string): Promise<IUserProfile | null> {
    const user = await userRepository.findById(userId);
    return user ? toUserProfile(user) : null;
  }

  async updateUser(
    userId: string,
    updates: Partial<{
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      location: string;
      avatar: string;
      preferences: {
        emailNotifications?: boolean;
        darkMode?: boolean;
      };
    }>
  ): Promise<IUserProfile | null> {
    const updateFields: Partial<{
      first_name: string;
      last_name: string;
      date_of_birth: string;
      location: string | null;
      avatar: string | null;
      email_notifications: boolean;
      dark_mode: boolean;
    }> = {};

    if (updates.firstName) updateFields.first_name = updates.firstName;
    if (updates.lastName) updateFields.last_name = updates.lastName;
    if (updates.dateOfBirth) updateFields.date_of_birth = updates.dateOfBirth;
    if (updates.location !== undefined) updateFields.location = updates.location;
    if (updates.avatar !== undefined) updateFields.avatar = updates.avatar;
    if (updates.preferences) {
      if (updates.preferences.emailNotifications !== undefined) {
        updateFields.email_notifications = updates.preferences.emailNotifications;
      }
      if (updates.preferences.darkMode !== undefined) {
        updateFields.dark_mode = updates.preferences.darkMode;
      }
    }

    const user = await userRepository.update(userId, updateFields);
    return user ? toUserProfile(user) : null;
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete all refresh tokens
    await refreshTokenRepository.revokeAllForUser(userId);

    // Delete user
    await userRepository.delete(userId);
  }
}

export const authService = new AuthService();

// Re-export types for convenience
export type { IUser, IUserProfile } from '../repositories/user.repository.js';
