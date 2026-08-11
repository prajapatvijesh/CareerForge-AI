import { SubscriptionRepository } from './subscription.repository';
import { ISubscription } from './subscription.model';
import { PLAN_CONFIG, PlanType, IPlanLimits } from './plan.config';

export class SubscriptionService {
  private repository: SubscriptionRepository;

  constructor() {
    this.repository = new SubscriptionRepository();
  }

  private getCurrentMonthRange(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
    return { start, end };
  }

  async getCurrentSubscription(userId: string): Promise<ISubscription> {
    let subscription = await this.repository.findByUserId(userId);

    const { start, end } = this.getCurrentMonthRange();

    // Create fallback FREE subscription if none exists
    if (!subscription) {
      subscription = await this.repository.createFallbackSubscription(userId, start, end);
    }

    // Check if current period has expired, reset it to current month
    // In a real billing system this would be handled by webhooks, but for V1 we can auto-rollover
    if (new Date() > subscription.currentPeriodEnd) {
      subscription = await this.repository.updateSubscription(userId, {
        currentPeriodStart: start,
        currentPeriodEnd: end
      });
    }

    return subscription!;
  }

  getPlanLimits(plan: PlanType): IPlanLimits {
    return PLAN_CONFIG[plan] || PLAN_CONFIG['FREE'];
  }

  getPlans(): Record<PlanType, IPlanLimits> {
    return PLAN_CONFIG;
  }
}
