import { Router } from 'express';
import { BillingController } from './billing.controller';
import { requireAuth } from '../../middlewares/requireAuth';

export const billingRouter = Router();
const billingController = new BillingController();

// We need raw body parser ONLY for the webhook route
// But typically, the router gets standard json parser from server.ts.
// To bypass standard parser, server.ts must mount this specific route BEFORE the global json parser,
// or we can use a special middleware approach.
// Given standard Express practices, if server.ts uses `app.use(express.json())`, it applies to everything.
// To get raw body, we can tell express.json() to preserve it, OR mount webhook separately.
// For now, let's assume we can mount it here. We'll verify server.ts.
billingRouter.post(
  '/webhook/razorpay',
  billingController.handleRazorpayWebhook
);

// Authenticated routes
billingRouter.use(requireAuth);
billingRouter.post('/checkout', billingController.createCheckout);
billingRouter.post('/verify', billingController.verifyCheckout);
billingRouter.post('/cancel', billingController.cancelSubscription);
billingRouter.get('/history', billingController.getHistory);
