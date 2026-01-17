export interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date | string;
  location?: string;
  avatar?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  darkMode: boolean;
}

export interface User {
  _id: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
  roles: ('user' | 'admin')[];
  isEmailVerified: boolean;
  lastLoginAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type UserRole = 'user' | 'admin';
