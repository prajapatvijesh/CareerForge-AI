import { Request, Response, NextFunction } from 'express';
import { ProfileService } from './profile.service';
import { AppError } from '../../utils/AppError';

export class ProfileController {
  private service = new ProfileService();

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const profile = await this.service.getProfile(userId);
      res.status(200).json({ status: 'success', data: { profile } });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const profile = await this.service.updateProfile(userId, req.body);
      res.status(200).json({ status: 'success', data: { profile } });
    } catch (error) {
      next(error);
    }
  };

  public uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      
      if (!req.file) {
        return next(new AppError('No image file provided', 400));
      }

      const profile = await this.service.updateAvatar(userId, req.file.buffer);
      res.status(200).json({ status: 'success', data: { profile } });
    } catch (error) {
      next(error);
    }
  };
}
