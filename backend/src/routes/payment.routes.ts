import { Router } from 'express';
import express from 'express';
import {
  razorpayCreateOrder,
  razorpayVerify,
  stripeCreateSession,
  stripeWebhook,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Razorpay
router.post('/razorpay/create-order', authenticate, razorpayCreateOrder);
router.post('/razorpay/verify', authenticate, razorpayVerify);

// Stripe
router.post('/stripe/create-session', authenticate, stripeCreateSession);
// Stripe webhook needs raw body — handled specially in app.ts
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
