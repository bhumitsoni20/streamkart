import { Router } from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  registerPushToken,
  unregisterPushToken,
  getNotificationSettings,
  updateNotificationSettings,
  sendTestNotification,
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.put('/:id/read', authenticate, markAsRead);
router.put('/read-all', authenticate, markAllAsRead);

// Push Token Registration & Management
router.post('/register-token', authenticate, registerPushToken);
router.post('/unregister-token', authenticate, unregisterPushToken);

// User Notification Settings
router.get('/settings', authenticate, getNotificationSettings);
router.put('/settings', authenticate, updateNotificationSettings);

// Test Push Notification
router.post('/test', authenticate, sendTestNotification);

export default router;
