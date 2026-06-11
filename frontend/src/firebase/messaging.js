import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from './config';
import toast from 'react-hot-toast';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = await getFirebaseMessaging();
      if (messaging) {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
};

export const onForegroundMessage = async (callback) => {
  const messaging = await getFirebaseMessaging();
  if (messaging) {
    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (title) {
        toast(body || title, {
          icon: '🔔',
          duration: 5000,
        });
      }
      if (callback) callback(payload);
    });
  }
};
