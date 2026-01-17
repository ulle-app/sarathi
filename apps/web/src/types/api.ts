// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

// User types
export interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  location?: string;
  avatar?: string;
  academicLevel?: string;
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
  roles: string[];
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  academicLevel?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

// Update profile types
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  location?: string;
  preferences?: Partial<UserPreferences>;
}
