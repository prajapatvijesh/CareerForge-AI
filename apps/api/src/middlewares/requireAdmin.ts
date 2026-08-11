import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // requireAuth must be called before this middleware
  if (!req.user) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // Handle both legacy 'admin' and new 'ADMIN' format
  const role = req.user.role?.toUpperCase();
  if (role !== 'ADMIN') {
    return next(new AppError('Forbidden. Admin access required.', 403));
  }

  next();
};
