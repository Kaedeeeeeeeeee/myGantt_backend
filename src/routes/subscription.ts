import { Router } from 'express';
import {
  getSubscriptionPlans,
  getCurrentSubscription,
  createCheckoutSession,
  handleStripeWebhook,
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/plans', getSubscriptionPlans);
router.get('/current', authenticate, getCurrentSubscription);
router.post('/create-checkout', authenticate, createCheckoutSession);
router.post('/webhook', handleStripeWebhook); // Stripe webhook 不需要认证

export default router;

