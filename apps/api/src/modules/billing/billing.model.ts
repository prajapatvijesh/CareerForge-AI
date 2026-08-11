import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  provider: string;
  providerPaymentId: string;
  providerOrderId?: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'CAPTURED' | 'FAILED';
  paymentMethod?: string;
  failureReason?: string;
  paidAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    provider: { type: String, required: true },
    providerPaymentId: { type: String, required: true, unique: true },
    providerOrderId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    status: { type: String, enum: ['CREATED', 'CAPTURED', 'FAILED'], required: true },
    paymentMethod: { type: String },
    failureReason: { type: String },
    paidAt: { type: Date },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ userId: 1 });
// providerPaymentId is already unique indexed in schema definition

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export interface IWebhookEvent extends Document {
  provider: string;
  eventId: string;
  eventType: string;
  processed: boolean;
  processedAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const webhookEventSchema = new Schema<IWebhookEvent>(
  {
    provider: { type: String, required: true },
    eventId: { type: String, required: true },
    eventType: { type: String, required: true },
    processed: { type: Boolean, required: true, default: false },
    processedAt: { type: Date },
    failureReason: { type: String }
  },
  { timestamps: true }
);

webhookEventSchema.index({ provider: 1, eventId: 1 }, { unique: true });

export const WebhookEvent = mongoose.model<IWebhookEvent>('WebhookEvent', webhookEventSchema);
