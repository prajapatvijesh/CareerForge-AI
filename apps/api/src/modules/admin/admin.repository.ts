import { User } from '../auth/user.model';
import { Subscription } from '../subscription/subscription.model';
import { MonthlyUsage, AIUsageTelemetry } from '../subscription/usage.model';
import { Payment } from '../billing/billing.model';

export class AdminRepository {
  async getUsers(filter: any, sort: any, skip: number, limit: number) {
    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password -refreshToken -__v')
      .lean();
    
    const total = await User.countDocuments(filter);
    
    return { users, total };
  }

  async getUserById(userId: string) {
    return User.findById(userId).select('-password -refreshToken -__v').lean();
  }

  async getSubscriptionByUserId(userId: string) {
    return Subscription.findOne({ userId }).lean();
  }

  async getMonthlyUsageByUserId(userId: string) {
    // Get the most recent monthly usage
    return MonthlyUsage.findOne({ userId }).sort({ periodStart: -1 }).lean();
  }

  async getAIUsageByUserId(userId: string) {
    return AIUsageTelemetry.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          promptTokens: { $sum: '$promptTokens' },
          completionTokens: { $sum: '$completionTokens' },
          totalTokens: { $sum: '$totalTokens' },
          estimatedCostUsd: { $sum: '$estimatedCostUsd' }
        }
      }
    ]);
  }

  async getPaymentsByUserId(userId: string) {
    return Payment.find({ userId }).sort({ createdAt: -1 }).limit(10).lean();
  }
  
  async updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED') {
    return User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password -refreshToken -__v').lean();
  }
}
