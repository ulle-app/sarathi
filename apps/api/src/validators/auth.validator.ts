import { body, ValidationChain } from 'express-validator';

// Common password patterns to reject
const COMMON_PASSWORDS = [
  'password', 'password123', '123456789', 'qwerty123', 'admin123',
  'letmein', 'welcome', 'monkey123', 'dragon123', 'master123'
];

export const registerValidator: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .custom((value, { req }) => {
      // Check for common passwords
      if (COMMON_PASSWORDS.includes(value.toLowerCase())) {
        throw new Error('Password is too common. Please choose a stronger password.');
      }
      // Check if password contains email
      const email = req.body?.email?.toLowerCase() || '';
      const emailPrefix = email.split('@')[0];
      if (emailPrefix && value.toLowerCase().includes(emailPrefix)) {
        throw new Error('Password cannot contain your email address');
      }
      return true;
    }),

  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name contains invalid characters')
    .escape(), // Escape HTML entities

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name contains invalid characters')
    .escape(), // Escape HTML entities

  // Academic level (life-stage) - optional at registration
  body('academicLevel')
    .optional()
    .isIn(['grade_10', 'grade_12', 'undergraduate', 'post_graduate', 'professional'])
    .withMessage('Invalid academic level'),
];

export const loginValidator: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password cannot exceed 128 characters'),
];

export const refreshTokenValidator: ValidationChain[] = [
  body('refreshToken')
    .optional()
    .isString()
    .withMessage('Refresh token must be a string')
    .isLength({ max: 512 })
    .withMessage('Invalid refresh token'),
];

export const updateProfileValidator: ValidationChain[] = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name contains invalid characters')
    .escape(),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name contains invalid characters')
    .escape(),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .toDate()
    .custom((value) => {
      // Ensure date is not in the future and user is at least 13 years old
      const now = new Date();
      const minAge = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
      const maxAge = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
      if (value > minAge) {
        throw new Error('You must be at least 13 years old');
      }
      if (value < maxAge) {
        throw new Error('Invalid date of birth');
      }
      return true;
    }),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters')
    .escape(),

  body('preferences.emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),

  body('preferences.darkMode')
    .optional()
    .isBoolean()
    .withMessage('Dark mode must be a boolean'),
];

export const forgotPasswordValidator: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
];

export const resetPasswordValidator: ValidationChain[] = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isString()
    .isLength({ min: 64, max: 256 })
    .withMessage('Invalid reset token'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
];
