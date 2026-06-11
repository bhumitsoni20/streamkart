import { apiPost } from './api';

// ─── Razorpay ───────────────────────────────────────────

export const createRazorpayOrder = (productId) =>
  apiPost('/payments/razorpay/create-order', { productId });

export const verifyRazorpayPayment = (data) =>
  apiPost('/payments/razorpay/verify', data);

export const openRazorpayCheckout = (order, user, onSuccess, onError) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Prime Net',
    description: 'Digital Subscription Purchase',
    order_id: order.orderId,
    prefill: {
      name: user?.name || '',
      email: user?.email || '',
      contact: user?.phone || '',
    },
    theme: { color: '#3b82f6' },
    handler: onSuccess,
    modal: { ondismiss: () => onError?.('Payment cancelled') },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

// ─── Stripe ─────────────────────────────────────────────

export const createStripeSession = (productId, orderId) =>
  apiPost('/payments/stripe/create-session', { productId, orderId });
