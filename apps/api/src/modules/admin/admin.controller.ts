import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';

export class AdminController {
  private adminService = new AdminService();

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getDashboardAnalytics();
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getUsers(req.query);
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getUserDetails(req.params.userId);
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.id;
      const { status } = req.body;
      const data = await this.adminService.updateUserStatus(req.params.userId, status, adminId);
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getSubscriptionAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getSubscriptionAnalytics();
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getRevenueAnalytics();
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getAIAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getAIAnalytics();
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getPayments(req.query);
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getSystemHealth();
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.adminService.getAuditLogs(req.query);
      res.status(200).json({ status: 'success', data });
    } catch (error) { next(error); }
  };
}
