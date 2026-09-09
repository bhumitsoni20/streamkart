import { firebaseMessaging } from '../config/firebase';
import { Notification } from '../models/Notification';
import { PushToken } from '../models/PushToken';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { getIO } from '../socket';

export interface PushNotificationPayload {
  userId: string;
  title: string;
  message: string;
  type?: 'order' | 'payment' | 'system' | 'promotion' | 'application';
  actionUrl?: string;
  metadata?: {
    eventKey?: string;
    orderId?: string;
    chatId?: string;
    productId?: string;
    [key: string]: any;
  };
}

// In-memory set for deduplication within short intervals (5 seconds)
const recentEvents = new Map<string, number>();

export const sendPushNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'order' | 'payment' | 'system' | 'promotion' | 'application' = 'system',
  actionUrl?: string,
  metadata?: {
    eventKey?: string;
    orderId?: string;
    chatId?: string;
    productId?: string;
    [key: string]: any;
  }
) => {
  try {
    if (!userId) return;

    // Deduplication check if eventKey is provided
    if (metadata?.eventKey) {
      const lastSent = recentEvents.get(metadata.eventKey);
      const now = Date.now();
      if (lastSent && now - lastSent < 5000) {
        logger.warn(`Duplicate notification skipped for eventKey: ${metadata.eventKey}`);
        return;
      }
      recentEvents.set(metadata.eventKey, now);

      // Clean up old memory records periodically
      if (recentEvents.size > 1000) {
        const threshold = now - 60000;
        for (const [key, time] of recentEvents.entries()) {
          if (time < threshold) recentEvents.delete(key);
        }
      }
    }

    // 1. Create In-App Notification in DB
    const dbNotification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      actionUrl: actionUrl || undefined,
    });

    // 2. Realtime Socket.io In-App Event
    try {
      const io = getIO();
      if (io) {
        io.to(`user_${userId}`).emit('new_notification', dbNotification);
        io.to(`user_${userId}`).emit('unread_count_update');
      }
    } catch (sockErr) {
      // Sockets might not be initialized during certain unit tests
    }

    // 3. Check User Notification Preferences
    const user = await User.findById(userId).lean();
    if (!user) return;

    const prefs = user.notificationPreferences || {
      pushEnabled: true,
      orderUpdates: true,
      chatMessages: true,
      paymentUpdates: true,
      accountAlerts: true,
    };

    if (prefs.pushEnabled === false) {
      logger.info(`Push notifications disabled by user preference: ${userId}`);
      return;
    }

    if (type === 'order' && prefs.orderUpdates === false) return;
    if (type === 'payment' && prefs.paymentUpdates === false) return;
    if (type === 'system' && prefs.accountAlerts === false) return;

    // 4. Retrieve Active FCM Push Tokens
    const pushTokenDocs = await PushToken.find({ user: userId, isActive: true }).lean();
    const tokenList = pushTokenDocs.map((pt) => pt.token).filter(Boolean);

    // Fallback: Check legacy user.fcmToken if no tokens exist in PushToken collection
    if (tokenList.length === 0 && user.fcmToken) {
      tokenList.push(user.fcmToken);
    }

    if (tokenList.length === 0) {
      logger.info(`No active FCM tokens for user ${userId}`);
      return { success: false, reason: 'no_tokens', message: 'No active FCM push tokens registered for this user.' };
    }

    // 5. Prepare String-Only Data Payload for FCM Web Push
    const stringData: { [key: string]: string } = {
      type: type || 'system',
      title: title || 'StreamKart',
      body: message || '',
      notificationId: dbNotification._id.toString(),
      actionUrl: actionUrl || '/',
      timestamp: new Date().toISOString(),
    };

    if (metadata?.orderId) stringData.orderId = String(metadata.orderId);
    if (metadata?.chatId) stringData.chatId = String(metadata.chatId);
    if (metadata?.productId) stringData.productId = String(metadata.productId);
    if (metadata?.eventKey) stringData.eventKey = String(metadata.eventKey);

    // 6. Send Multicast via Firebase Admin SDK
    const response = await (firebaseMessaging as any).sendMulticast({
      tokens: tokenList,
      notification: {
        title,
        body: message,
      },
      data: stringData,
      webpush: {
        fcmOptions: {
          link: actionUrl || '/',
        },
        notification: {
          title,
          body: message,
          icon: '/notification-icon.png',
          badge: '/notification-icon.png',
          tag: metadata?.eventKey || `streamkart_${Date.now()}`,
          renotify: true,
          requireInteraction: true,
          data: {
            actionUrl: actionUrl || '/',
            notificationId: dbNotification._id.toString(),
            orderId: metadata?.orderId || '',
            chatId: metadata?.chatId || '',
            type: type || 'system',
          },
        },
      },
    });

    logger.info(
      `FCM Push Sent to ${userId} (${response.successCount} succeeded, ${response.failureCount} failed)`
    );

    // 7. Automatically Clean Up Invalid / Unregistered Tokens
    if (response.failureCount > 0) {
      const tokensToRemove: string[] = [];

      response.responses.forEach((resp: any, idx: number) => {
        if (!resp.success && resp.error) {
          const errorCode = resp.error.code;
          logger.warn(`FCM error for token ${tokenList[idx]?.substring(0, 10)}...: ${errorCode}`);
          
          if (
            errorCode === 'messaging/registration-token-not-registered' ||
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/mismatched-credential'
          ) {
            tokensToRemove.push(tokenList[idx]);
          }
        }
      });

      if (tokensToRemove.length > 0) {
        await PushToken.deleteMany({ token: { $in: tokensToRemove } });
        if (user.fcmToken && tokensToRemove.includes(user.fcmToken)) {
          await User.findByIdAndUpdate(userId, { fcmToken: '' });
        }
        logger.info(`Removed ${tokensToRemove.length} invalid/expired FCM tokens for user ${userId}`);
      }
    }

    return {
      success: response.successCount > 0,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error: any) {
    logger.error('Failed to send push notification (isolated):', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send push notification to all platform Administrators
 */
export const sendPushToAdmins = async (
  title: string,
  message: string,
  type: 'order' | 'payment' | 'system' | 'promotion' | 'application' = 'system',
  actionUrl?: string,
  metadata?: { [key: string]: any }
) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('_id').lean();
    if (admins && admins.length > 0) {
      await Promise.all(
        admins.map((admin) =>
          sendPushNotification(admin._id.toString(), title, message, type, actionUrl, metadata)
        )
      );
    }
  } catch (err) {
    logger.error('Failed to send push to admins:', err);
  }
};
