import Razorpay from 'razorpay';
import crypto from 'crypto';
import { IPaymentProvider } from '../subscription/payment/payment.interface';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';

export class RazorpayPaymentProvider implements IPaymentProvider {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  async createSubscription(userId: string, planId: string): Promise<{ id: string; [key: string]: any }> {
    try {
      // Create a subscription using the Razorpay Subscriptions API
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 120, // max allowed, roughly 10 years
        notes: {
          userId: userId,
        }
      });
      return subscription;
    } catch (error: any) {
      console.error('Razorpay createSubscription Error:', error);
      throw new AppError('Failed to create subscription with payment provider', 500);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.razorpay.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error: any) {
      console.error('Razorpay cancelSubscription Error:', error);
      return false; // Let the service handle failures (or throw)
    }
  }

  verifyCheckoutSignature(payload: { razorpay_order_id?: string; razorpay_subscription_id?: string; razorpay_payment_id: string; razorpay_signature: string }): boolean {
    const { razorpay_order_id, razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = payload;
    
    // For subscriptions, Razorpay generates signature differently than one-off orders
    // Format: payment_id + "|" + subscription_id
    const idToSign = razorpay_subscription_id || razorpay_order_id;
    if (!idToSign) return false;

    const generatedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(razorpay_payment_id + '|' + idToSign)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(razorpay_signature));
    } catch {
      return false; // If lengths differ, it throws
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(signature));
    } catch {
      return false;
    }
  }
}
