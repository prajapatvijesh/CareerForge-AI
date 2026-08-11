export interface IPaymentProvider {
  /** Creates a subscription checkout session and returns provider-specific details */
  createSubscription(userId: string, planId: string): Promise<{ id: string; [key: string]: any }>;
  
  /** Cancels an active subscription */
  cancelSubscription(subscriptionId: string): Promise<boolean>;

  /** Cryptographically verifies the checkout callback signature */
  verifyCheckoutSignature(payload: { razorpay_order_id?: string; razorpay_subscription_id?: string; razorpay_payment_id: string; razorpay_signature: string }): boolean;

  /** Cryptographically verifies the webhook signature */
  verifyWebhookSignature(payload: string, signature: string): boolean;
}
