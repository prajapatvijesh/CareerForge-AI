import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();
const subscriptionController = new SubscriptionController();

router.use(requireAuth);

router.get('/', subscriptionController.getCurrentSubscription);
router.get('/plans', subscriptionController.getPlans);
router.post('/upgrade', subscriptionController.upgradePlan);

export default router;
