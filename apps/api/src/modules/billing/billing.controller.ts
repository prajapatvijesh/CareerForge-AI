import { Request, Response, NextFunction } from 'express';
import { BillingService } from './billing.service';

export class BillingController {
  private billingService = new BillingService();

  createCheckout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.billingService.createCheckout(userId);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  verifyCheckout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const payload = req.body; // should contain razorpay signature and details
      const result = await this.billingService.verifyCheckout(userId, payload);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.billingService.cancelSubscription(userId);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.billingService.getPaymentHistory(userId);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  // Webhook handler is special as it requires raw body for signature verification
  handleRazorpayWebhook = async (req: any, res: Response) => {
    try {
      const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
      const signature = req.headers['x-razorpay-signature'] as string;
      
      const result = await this.billingService.processWebhook(rawBody, signature);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      // Return 200 even on error unless it's a signature fail to avoid retries if it's our logic error?
      // Razorpay retries 5xx. If it's a signature fail, return 400.
      console.error('Webhook error:', error);
      res.status(400).json({ status: 'error', message: 'Webhook processing failed' });
    }
  };
}
