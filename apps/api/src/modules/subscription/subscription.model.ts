import mongoose, { Document, Schema } from 'mongoose';
import { PlanType } from './plan.config';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: PlanType;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE' | 'TRIALING' | 'INCOMPLETE';
  provider?: 'razorpay' | 'stripe';
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { type: String, enum: ['FREE', 'PRO'], required: true, default: 'FREE' },
    status: { type: String, enum: ['ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE', 'TRIALING', 'INCOMPLETE'], required: true, default: 'ACTIVE' },
    provider: { type: String, enum: ['razorpay', 'stripe'] },
    providerCustomerId: { type: String },
    providerSubscriptionId: { type: String },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    canceledAt: { type: Date },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
  },
  { timestamps: true }
);

subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
