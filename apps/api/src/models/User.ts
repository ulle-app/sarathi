import mongoose, { Document, Schema, Model } from 'mongoose';
import { hashPassword, verifyPassword } from '../utils/password.js';

// User profile interface
export interface IUserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  location?: string;
  avatar?: string;
}

// User preferences interface
export interface IUserPreferences {
  emailNotifications: boolean;
  darkMode: boolean;
}

// User document interface
export interface IUser {
  email: string;
  passwordHash: string;
  profile: IUserProfile;
  preferences: IUserPreferences;
  roles: ('user' | 'admin')[];
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User document with methods
export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
  fullName: string;
}

// User model interface
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

// Profile schema
const profileSchema = new Schema<IUserProfile>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    dateOfBirth: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    avatar: {
      type: String,
    },
  },
  { _id: false }
);

// Preferences schema
const preferencesSchema = new Schema<IUserPreferences>(
  {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// User schema
const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't include in queries by default
    },
    profile: {
      type: profileSchema,
      required: true,
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
    roles: {
      type: [String],
      enum: ['user', 'admin'],
      default: ['user'],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function (this: IUserDocument) {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  password: string
): Promise<boolean> {
  return verifyPassword(password, this.passwordHash);
};

// Static method to find by email
userSchema.statics.findByEmail = function (
  email: string
): Promise<IUserDocument | null> {
  return this.findOne({ email: email.toLowerCase() }).select('+passwordHash');
};

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  // If passwordHash is not already hashed (raw password provided)
  if (this.passwordHash && !this.passwordHash.startsWith('$2')) {
    this.passwordHash = await hashPassword(this.passwordHash);
  }

  next();
});

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
