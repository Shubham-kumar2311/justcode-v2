import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User, IUser } from '../users/user.model';
import { env } from '../../config/env';
import { JwtUserPayload } from '../../shared/types/express';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import { SignupInput, LoginInput } from './auth.validation';

const BCRYPT_SALT_ROUNDS = 12;

export class AuthService {
  /**
   * Generates a JWT token for a user.
   */
  public generateToken(user: IUser): string {
    const payload: JwtUserPayload = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
  }

  /**
   * Hashes a password using bcrypt.
   */
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  /**
   * Signs up a new user.
   */
  public async signup(data: SignupInput): Promise<{ user: IUser; token: string }> {
    const { username, email, password } = data;

    // Check for existing users
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new ConflictError('Email is already registered');
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new ConflictError('Username is already taken');
    }

    // Hash password with bcrypt
    const hashedPassword = await this.hashPassword(password);

    // Create user (leaving salt undefined as it's only for legacy auth)
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = this.generateToken(user);
    return { user, token };
  }

  /**
   * Authenticates a user with dual-hash migration support.
   */
  public async login(data: LoginInput): Promise<{ user: IUser; token: string }> {
    const { email, password } = data;
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    let isValid = false;

    // 1. Attempt bcrypt verification first
    // Bcrypt hashes start with $2a$, $2b$, etc.
    const isBcryptHash = user.password.startsWith('$2');

    if (isBcryptHash) {
      isValid = await bcrypt.compare(password, user.password);
    } else if (user.salt) {
      // 2. Fallback to legacy HMAC-SHA256 verification
      const legacyHash = crypto
        .createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');
      
      isValid = legacyHash === user.password;

      // 3. Migrate hash to bcrypt if legacy verification succeeded
      if (isValid) {
        user.password = await this.hashPassword(password);
        user.salt = undefined; // Remove legacy salt
        await user.save();
      }
    }

    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { user, token };
  }
}

export const authService = new AuthService();
