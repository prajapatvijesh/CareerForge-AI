import { Request, Response, NextFunction } from 'express';
import { AIFeatureType } from '../modules/subscription/usage.model';
import { SubscriptionService } from '../modules/subscription/subscription.service';
import { UsageService } from '../modules/subscription/usage.service';

const subscriptionService = new SubscriptionService();
const usageService = new UsageService();

export function checkSubscriptionLimit(feature: AIFeatureType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      
      // 1. Resolve subscription & plan limits
      const subscription = await subscriptionService.getCurrentSubscription(userId);
      const planLimits = subscriptionService.getPlanLimits(subscription.plan);
      
      // Map feature to limit
      let limit = 0;
      if (feature === 'RESUME_ANALYSIS') limit = planLimits.resumeAnalysisPerMonth;
      else if (feature === 'MOCK_INTERVIEW') limit = planLimits.mockInterviewsPerMonth;
      else if (feature === 'OTHER_AI') limit = planLimits.aiRequestsPerMonth;

      // 2. Atomic limit reservation
      const reservedUsage = await usageService.checkAndReserveLimit(
        userId,
        feature,
        limit,
        subscription.currentPeriodStart,
        subscription.currentPeriodEnd
      );

      // 3. Reject if limit exceeded
      if (!reservedUsage) {
        // Fetch current usage to return in error
        const currentSummary = await usageService.getUsageSummary(userId, subscription.currentPeriodStart);
        
        let currentUsageCount = 0;
        if (currentSummary) {
          if (feature === 'RESUME_ANALYSIS') currentUsageCount = currentSummary.usage.resumeAnalysis;
          else if (feature === 'MOCK_INTERVIEW') currentUsageCount = currentSummary.usage.mockInterviews;
          else if (feature === 'OTHER_AI') currentUsageCount = currentSummary.usage.aiRequests;
        }

        return res.status(429).json({
          success: false,
          code: 'AI_USAGE_LIMIT_EXCEEDED',
          message: 'Monthly AI usage limit reached.',
          feature,
          currentUsage: currentUsageCount,
          limit,
          resetAt: subscription.currentPeriodEnd
        });
      }

      // Reservation successful, proceed to AI request
      next();
    } catch (error) {
      next(error);
    }
  };
}
