import { Router } from 'express';
import { AdminController } from './admin.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { requireAdmin } from '../../middlewares/requireAdmin';

export const adminRouter = Router();
const adminController = new AdminController();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/dashboard', adminController.getDashboard);

adminRouter.get('/users', adminController.getUsers);
adminRouter.get('/users/:userId', adminController.getUserDetails);
adminRouter.patch('/users/:userId/status', adminController.updateUserStatus);

adminRouter.get('/analytics/subscriptions', adminController.getSubscriptionAnalytics);
adminRouter.get('/analytics/revenue', adminController.getRevenueAnalytics);
adminRouter.get('/analytics/ai', adminController.getAIAnalytics);
adminRouter.get('/analytics/payments', adminController.getPayments);

adminRouter.get('/system/health', adminController.getSystemHealth);
adminRouter.get('/audit-logs', adminController.getAuditLogs);
