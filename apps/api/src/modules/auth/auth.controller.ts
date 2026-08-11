import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { env } from '../../config/env';

const isProduction = env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'strict' : 'lax') as 'strict' | 'lax',
  path: '/',
};

export class AuthController {
  private service = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = await this.service.register(req.body);
      
      res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15m
      res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7d
      
      res.status(201).json({ status: 'success', message: 'Registered successfully' });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = await this.service.login(req.body);
      
      res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
      
      res.status(200).json({ status: 'success', message: 'Logged in successfully' });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken: oldToken } = req.cookies;
      if (!oldToken) {
        return res.status(401).json({ status: 'error', message: 'No refresh token provided' });
      }

      const { accessToken, refreshToken } = await this.service.refresh(oldToken);
      
      res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
      
      res.status(200).json({ status: 'success', message: 'Tokens refreshed' });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - user will be populated by requireAuth middleware
      const userId = req.user?.id;
      if (userId) {
        await this.service.logout(userId);
      }
      
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });
      res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - user will be populated by requireAuth middleware
      res.status(200).json({ status: 'success', data: { user: req.user } });
    } catch (error) {
      next(error);
    }
  };
}
