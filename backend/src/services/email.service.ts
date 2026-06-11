import { logger } from '../utils/logger';

// Placeholder for future email service integration (SendGrid, Mailgun, etc.)
export const sendEmail = async (to: string, subject: string, body: string) => {
  logger.info(`[Email Placeholder] To: ${to}, Subject: ${subject}`);
  // TODO: Integrate with email service provider
  return true;
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  return sendEmail(
    email,
    'Welcome to Prime Net!',
    `Hi ${name}, welcome to Prime Net — your digital subscription marketplace!`
  );
};

export const sendOrderConfirmation = async (email: string, orderId: string) => {
  return sendEmail(
    email,
    'Order Confirmed — Prime Net',
    `Your order #${orderId} has been placed successfully.`
  );
};
