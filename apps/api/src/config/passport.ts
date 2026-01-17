import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithoutRequest, VerifiedCallback } from 'passport-jwt';
import { env } from './env.js';
import { userRepository, IUserProfile, toUserProfile } from '../repositories/user.repository.js';
import { TokenPayload } from '../utils/jwt.js';

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwtSecret,
  algorithms: ['HS256'],
};

export function configurePassport(): void {
  passport.use(
    'jwt',
    new JwtStrategy(jwtOptions, async (payload: TokenPayload, done: VerifiedCallback) => {
      try {
        // Find user by ID from token payload
        const user = await userRepository.findById(payload.userId);

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        // Attach user profile (without sensitive data) to request
        return done(null, toUserProfile(user));
      } catch (error) {
        return done(error as Error, false);
      }
    })
  );
}

// Type declaration for Express Request
declare global {
  namespace Express {
    interface User extends IUserProfile {}
  }
}
