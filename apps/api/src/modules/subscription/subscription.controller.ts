import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import { UsageService } from './usage.service';
import { subscriptionResponseSchema } from './subscription.schema';

export class SubscriptionController {
  private subscriptionService = new SubscriptionService();
  private usageService = new UsageService();

  getCurrentSubscription = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const subscription = await this.subscriptionService.getCurrentSubscription(userId);
      const planLimits = this.subscriptionService.getPlanLimits(subscription.plan);
      
      const usageSummary = await this.usageService.getUsageSummary(userId, subscription.currentPeriodStart);

      const usage = usageSummary ? {
        resumeAnalysis: usageSummary.usage.resumeAnalysis,
        mockInterviews: usageSummary.usage.mockInterviews,
        aiRequests: usageSummary.usage.aiRequests
      } : {
        resumeAnalysis: 0,
        mockInterviews: 0,
        aiRequests: 0
      };

      const formattedSub = subscriptionResponseSchema.parse({
        id: subscription._id.toString(),
        userId: subscription.userId.toString(),
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString()
      });

      res.status(200).json({
        subscription: formattedSub,
        limits: planLimits,
        usage
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getPlans = async (req: Request, res: Response) => {
    try {
      const plans = this.subscriptionService.getPlans();
      res.status(200).json(plans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  upgradePlan = async (req: Request, res: Response) => {
    try {
      // Mock endpoint for V1 - Real implementation will use IPaymentProvider
      res.status(400).json({
        success: false,
        message: 'Payment integration is not yet enabled for V1.'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
