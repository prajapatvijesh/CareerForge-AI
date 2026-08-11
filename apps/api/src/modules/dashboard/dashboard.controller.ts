import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  private service = new DashboardService();

  public getSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const summary = await this.service.getDashboardSummary(userId);

      res.status(200).json({
        status: 'success',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  };
}
