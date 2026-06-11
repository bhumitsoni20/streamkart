import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  createStripeSession,
  verifyStripeWebhook,
} from '../services/payment.service';
import { sendPushNotification } from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

// POST /api/payments/razorpay/create-order
export const razorpayCreateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return sendError(res, 'Product not found.', 404);

    const razorpayOrder = await createRazorpayOrder(product.price);

    return sendSuccess(res, {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      productId: product._id,
    });
  } catch (error: any) {
    logger.error('Razorpay order creation failed:', error);
    return sendError(res, 'Failed to create payment order.');
  }
};

// POST /api/payments/razorpay/verify
export const razorpayVerify = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return sendError(res, 'Payment verification failed.', 400);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (order) {
      await sendPushNotification(
        order.user.toString(),
        'Payment Successful!',
        'Your payment has been verified and order confirmed.',
        'payment'
      );
    }

    return sendSuccess(res, order, 'Payment verified successfully.');
  } catch (error: any) {
    logger.error('Razorpay verification failed:', error);
    return sendError(res, 'Payment verification failed.');
  }
};

// POST /api/payments/stripe/create-session
export const stripeCreateSession = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, orderId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return sendError(res, 'Product not found.', 404);

    const session = await createStripeSession(
      product.title,
      product.price,
      orderId
    );

    // Update order with session ID
    await Order.findByIdAndUpdate(orderId, { sessionId: session.id });

    return sendSuccess(res, { sessionUrl: session.url, sessionId: session.id });
  } catch (error: any) {
    logger.error('Stripe session creation failed:', error);
    return sendError(res, 'Failed to create payment session.');
  }
};

// POST /api/payments/stripe/webhook
export const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const event = verifyStripeWebhook(req.body, signature);

    if (!event) {
      return sendError(res, 'Webhook signature verification failed.', 400);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const order = await Order.findByIdAndUpdate(
          orderId,
          {
            paymentStatus: 'paid',
            paymentId: session.payment_intent,
          },
          { new: true }
        );

        if (order) {
          await sendPushNotification(
            order.user.toString(),
            'Payment Successful!',
            'Your Stripe payment has been confirmed.',
            'payment'
          );
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error('Stripe webhook error:', error);
    return sendError(res, 'Webhook processing failed.');
  }
};
