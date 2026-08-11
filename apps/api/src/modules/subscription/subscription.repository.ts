import { Subscription, ISubscription } from './subscription.model';
import mongoose from 'mongoose';

export class SubscriptionRepository {
  async findByUserId(userId: string): Promise<ISubscription | null> {
    return Subscription.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  }

  async createFallbackSubscription(userId: string, periodStart: Date, periodEnd: Date): Promise<ISubscription> {
    return Subscription.create({
      userId: new mongoose.Types.ObjectId(userId),
      plan: 'FREE',
      status: 'ACTIVE',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    });
  }

  async updateSubscription(userId: string, updateData: Partial<ISubscription>): Promise<ISubscription | null> {
    return Subscription.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: updateData },
      { new: true }
    );
  }
}
