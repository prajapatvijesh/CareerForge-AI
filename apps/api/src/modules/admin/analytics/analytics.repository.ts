import { User } from '../../auth/user.model';
import { Subscription } from '../../subscription/subscription.model';
import { AIUsageTelemetry } from '../../subscription/usage.model';
import { Payment } from '../../billing/billing.model';
import { Resume } from '../../resume/resume.model';
import { JobApplication } from '../../job/job.model';

export class AnalyticsRepository {
  async getDashboardMetrics() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Run aggregations in parallel
    const [
      userStats,
      resumeStats,
      jobStats,
      aiStats,
      revenueStats,
      subscriptionStats
    ] = await Promise.all([
      this.getUserStats(firstDayOfMonth),
      this.getResumeStats(),
      this.getJobStats(),
      this.getAIStats(),
      this.getRevenueStats(firstDayOfMonth),
      this.getSubscriptionStats()
    ]);

    return {
      users: userStats,
      resumes: resumeStats,
      jobs: jobStats,
      ai: aiStats,
      revenue: revenueStats,
      subscriptions: subscriptionStats
    };
  }

  private async getUserStats(firstDayOfMonth: Date) {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          free: {
            $sum: { $cond: [{ $eq: ['$role', 'USER'] }, 1, 0] } // Need actual plan from subscription for exact count, but we can do a lookup or rely on subscription stats
          },
          newThisMonth: {
            $sum: { $cond: [{ $gte: ['$createdAt', firstDayOfMonth] }, 1, 0] }
          }
        }
      }
    ]);
    return stats[0] || { total: 0, free: 0, pro: 0, newThisMonth: 0 };
  }

  private async getResumeStats() {
    const total = await Resume.countDocuments();
    return { total };
  }

  private async getJobStats() {
    const total = await JobApplication.countDocuments();
    // Assuming Job applications are just jobs tracked.
    return { total, applications: total };
  }

  private async getAIStats() {
    const stats = await AIUsageTelemetry.aggregate([
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          resumeAnalyses: {
            $sum: { $cond: [{ $eq: ['$feature', 'RESUME_ANALYSIS'] }, 1, 0] }
          },
          mockInterviews: {
            $sum: { $cond: [{ $eq: ['$feature', 'MOCK_INTERVIEW'] }, 1, 0] }
          },
          totalTokens: { $sum: '$totalTokens' },
          estimatedCost: { $sum: '$estimatedCostUsd' }
        }
      }
    ]);
    return stats[0] || { totalRequests: 0, resumeAnalyses: 0, mockInterviews: 0, totalTokens: 0, estimatedCost: 0 };
  }

  private async getRevenueStats(firstDayOfMonth: Date) {
    const stats = await Payment.aggregate([
      {
        $facet: {
          total: [
            { $match: { status: 'CAPTURED' } },
            { $group: { _id: null, sum: { $sum: '$amount' }, count: { $sum: 1 } } }
          ],
          thisMonth: [
            { $match: { status: 'CAPTURED', createdAt: { $gte: firstDayOfMonth } } },
            { $group: { _id: null, sum: { $sum: '$amount' } } }
          ],
          failed: [
            { $match: { status: 'FAILED' } },
            { $group: { _id: null, count: { $sum: 1 } } }
          ]
        }
      }
    ]);
    
    const res = stats[0];
    return {
      total: res.total[0]?.sum || 0,
      thisMonth: res.thisMonth[0]?.sum || 0,
      successfulPayments: res.total[0]?.count || 0,
      failedPayments: res.failed[0]?.count || 0
    };
  }

  private async getSubscriptionStats() {
    const stats = await Subscription.aggregate([
      {
        $group: {
          _id: null,
          active: { $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] } },
          pastDue: { $sum: { $cond: [{ $eq: ['$status', 'PAST_DUE'] }, 1, 0] } },
          canceled: { $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] } },
          totalFree: { $sum: { $cond: [{ $eq: ['$plan', 'FREE'] }, 1, 0] } },
          totalPro: { $sum: { $cond: [{ $eq: ['$plan', 'PRO'] }, 1, 0] } }
        }
      }
    ]);
    return stats[0] || { active: 0, pastDue: 0, canceled: 0, totalFree: 0, totalPro: 0 };
  }

  async getMonthlyRevenueHistory() {
    return Payment.aggregate([
      { $match: { status: 'CAPTURED' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' },
          payments: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] }
            ]
          },
          revenue: 1,
          payments: 1
        }
      }
    ]);
  }
}
