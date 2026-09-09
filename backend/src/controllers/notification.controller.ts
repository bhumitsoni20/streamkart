import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Notification } from '../models/Notification';
import { PushToken } from '../models/PushToken';
import { User } from '../models/User';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { getIO } from '../socket';
import { sendPushNotification } from '../services/notification.service';

// GET /api/notifications
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ user: req.user._id }),
    ]);

    return sendPaginated(res, notifications, page, limit, total);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// GET /api/notifications/unread-count
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });
    return sendSuccess(res, { count });
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) return sendError(res, 'Notification not found.', 404);
    try {
      getIO().to(`user_${req.user._id.toString()}`).emit('notifications_read');
    } catch (err) {}
    return sendSuccess(res, notification, 'Marked as read.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// PUT /api/notifications/read-all
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    try {
      getIO().to(`user_${req.user._id.toString()}`).emit('notifications_read');
    } catch (err) {}
    return sendSuccess(res, null, 'All notifications marked as read.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// POST /api/notifications/register-token
export const registerPushToken = async (req: AuthRequest, res: Response) => {
  try {
    const { token, deviceId, platform, browser, userAgent } = req.body;

    if (!token || typeof token !== 'string') {
      return sendError(res, 'FCM registration token is required.', 400);
    }

    const trimmedToken = token.trim();

    // Upsert push token with current device info
    const pushToken = await PushToken.findOneAndUpdate(
      { token: trimmedToken },
      {
        user: req.user._id,
        deviceId: deviceId || '',
        platform: platform || 'web',
        browser: browser || '',
        userAgent: userAgent || '',
        isActive: true,
        lastUsedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Keep legacy User.fcmToken in sync
    await User.findByIdAndUpdate(req.user._id, { fcmToken: trimmedToken });

    return sendSuccess(res, pushToken, 'FCM push token registered successfully.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// POST /api/notifications/unregister-token
export const unregisterPushToken = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;

    if (token) {
      await PushToken.findOneAndDelete({ user: req.user._id, token: token.trim() });
    } else {
      // Deactivate all tokens for this user on global logout if requested
      await PushToken.updateMany({ user: req.user._id }, { isActive: false });
    }

    return sendSuccess(res, null, 'FCM push token unregistered.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// GET /api/notifications/settings
export const getNotificationSettings = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('notificationPreferences').lean();
    const settings = user?.notificationPreferences || {
      pushEnabled: true,
      orderUpdates: true,
      chatMessages: true,
      paymentUpdates: true,
      accountAlerts: true,
    };
    return sendSuccess(res, settings);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// PUT /api/notifications/settings
export const updateNotificationSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { pushEnabled, orderUpdates, chatMessages, paymentUpdates, accountAlerts } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 'User not found.', 404);

    const currentPrefs = user.notificationPreferences || {
      pushEnabled: true,
      orderUpdates: true,
      chatMessages: true,
      paymentUpdates: true,
      accountAlerts: true,
    };

    const updatedPrefs = {
      pushEnabled: pushEnabled !== undefined ? Boolean(pushEnabled) : currentPrefs.pushEnabled,
      orderUpdates: orderUpdates !== undefined ? Boolean(orderUpdates) : currentPrefs.orderUpdates,
      chatMessages: chatMessages !== undefined ? Boolean(chatMessages) : currentPrefs.chatMessages,
      paymentUpdates: paymentUpdates !== undefined ? Boolean(paymentUpdates) : currentPrefs.paymentUpdates,
      accountAlerts: accountAlerts !== undefined ? Boolean(accountAlerts) : currentPrefs.accountAlerts,
    };

    user.notificationPreferences = updatedPrefs;
    await user.save();

    return sendSuccess(res, updatedPrefs, 'Notification settings updated successfully.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// POST /api/notifications/test
export const sendTestNotification = async (req: AuthRequest, res: Response) => {
  try {
    const result = await sendPushNotification(
      req.user._id.toString(),
      'StreamKart Push Active! 🚀',
      'Browser push notifications are successfully configured and working on this device.',
      'system',
      '/notifications',
      { eventKey: `TEST_${req.user._id}_${Date.now()}` }
    );

    return sendSuccess(res, result, 'Test push notification triggered.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
