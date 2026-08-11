import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { RegisterInput, LoginInput } from './auth.schema';
import { AppError } from '../../utils/AppError';
import { env } from '../../config/env';

export class AuthService {
  private repository = new AuthRepository();

  public async register(data: RegisterInput) {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      // Use generic message to prevent email enumeration in prod? Actually for registration, it's fine.
      throw new AppError('Email already in use', 400);
    }
    const user = await this.repository.createUser(data);
    return this.generateTokens(user.id);
  }

  public async login(data: LoginInput) {
    const user = await this.repository.findByEmail(data.email, true);
    if (!user) {
      throw new AppError('Invalid email or password', 401); // Generic error
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError('Your account has been suspended.', 403);
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401); // Generic error
    }

    return this.generateTokens(user.id);
  }

  public async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
      const user = await this.repository.findByRefreshToken(refreshToken);

      if (!user || user.id !== decoded.userId) {
        throw new AppError('Invalid refresh token', 401);
      }

      if (user.status === 'SUSPENDED') {
        throw new AppError('Your account has been suspended.', 403);
      }

      // Rotate tokens
      return this.generateTokens(user.id);
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  public async logout(userId: string) {
    await this.repository.updateRefreshToken(userId, null);
  }

  private async generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    await this.repository.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}
