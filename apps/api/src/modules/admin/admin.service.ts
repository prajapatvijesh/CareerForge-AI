import { AdminRepository } from './admin.repository';
import { AnalyticsService } from './analytics/analytics.service';
import { AppError } from '../../utils/AppError';
import { AuditLog } from '../audit/audit.model';
import mongoose from 'mongoose';

export class AdminService {
  private adminRepository = new AdminRepository();
  private analyticsService = new AnalyticsService();

  async getUsers(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } }
      ];
    }
    if (query.role) filter.role = query.role.toUpperCase();
    if (query.status) filter.status = query.status.toUpperCase();
    
    const sort: any = {};
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = sortOrder;

    const { users, total } = await this.adminRepository.getUsers(filter, sort, skip, limit);

    // Get basic subscription data for users (to satisfy plan/status req without massive lookup)
    // For a real production app, an aggregation lookup would be better, but this is V1.
    const userIds = users.map(u => (u as any)._id);
    const subscriptions = await mongoose.model('Subscription').find({ userId: { $in: userIds } }).lean();
    
    const usersWithSubs = users.map((user: any) => {
      const sub: any = subscriptions.find((s: any) => s.userId.toString() === user._id.toString());
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        plan: sub ? sub.plan : 'FREE',
        subscriptionStatus: sub ? sub.status : 'ACTIVE',
      };
    });

    return {
      users: usersWithSubs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserDetails(userId: string) {
    const user = await this.adminRepository.getUserById(userId);
    if (!user) throw new AppError('User not found', 404);

    const [subscription, monthlyUsage, aiUsage, payments] = await Promise.all([
      this.adminRepository.getSubscriptionByUserId(userId),
      this.adminRepository.getMonthlyUsageByUserId(userId),
      this.adminRepository.getAIUsageByUserId(userId),
      this.adminRepository.getPaymentsByUserId(userId)
    ]);

    return {
      profile: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        periodStart: subscription.currentPeriodStart,
        periodEnd: subscription.currentPeriodEnd,
        canceled: subscription.cancelAtPeriodEnd
      } : { plan: 'FREE', status: 'ACTIVE' },
      usage: {
        currentMonth: monthlyUsage?.usage || {},
        allTimeAI: aiUsage[0] || {}
      },
      billing: {
        payments,
        totalPayments: payments.length,
        successfulPayments: payments.filter(p => p.status === 'CAPTURED').length,
        failedPayments: payments.filter(p => p.status === 'FAILED').length
      }
    };
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED', adminId: string) {
    if (status !== 'ACTIVE' && status !== 'SUSPENDED') {
      throw new AppError('Invalid status', 400);
    }
    const user = await this.adminRepository.updateUserStatus(userId, status);
    if (!user) throw new AppError('User not found', 404);

    // Audit logging
    await AuditLog.create({
      adminId,
      action: 'UPDATE_USER_STATUS',
      entityType: 'User',
      entityId: userId,
      metadata: { newStatus: status }
    });

    return user;
  }

  async getDashboardAnalytics() {
    return this.analyticsService.getDashboardAnalytics();
  }
  
  async getSubscriptionAnalytics() {
    return this.analyticsService.getSubscriptionAnalytics();
  }

  async getRevenueAnalytics() {
    return this.analyticsService.getRevenueAnalytics();
  }

  async getAIAnalytics() {
    return this.analyticsService.getAIAnalytics();
  }

  async getPayments(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    if (query.status) filter.status = query.status;

    const payments = await mongoose.model('Payment').find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await mongoose.model('Payment').countDocuments(filter);

    return { payments, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getSystemHealth() {
    return {
      api: "healthy",
      database: mongoose.connection.readyState === 1 ? "healthy" : "unhealthy",
      gemini: "healthy",
      razorpay: process.env.RAZORPAY_KEY_ID ? "configured" : "unconfigured",
      timestamp: new Date().toISOString()
    };
  }
  
  async getAuditLogs(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('adminId', 'name email').lean();
    const total = await AuditLog.countDocuments();

    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  }
}
