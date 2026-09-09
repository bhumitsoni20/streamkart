import { createElement } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from './config';
import * as notificationService from '../services/notification.service';
import toast from 'react-hot-toast';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Device & Browser Detection Helper
export const getDeviceMetadata = () => {
  const ua = navigator.userAgent || '';
  let browser = 'Unknown Browser';
  let platform = 'web';

  if (/android/i.test(ua)) {
    platform = 'android';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    platform = 'ios';
  }

  if (/edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/chrome|crios/i.test(ua)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Firefox';
  } else if (/safari/i.test(ua)) {
    browser = 'Safari';
  }

  // Generate or retrieve persistent deviceId
  let deviceId = localStorage.getItem('streamkart_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('streamkart_device_id', deviceId);
  }

  return {
    deviceId,
    platform,
    browser,
    userAgent: ua.substring(0, 200),
  };
};

/**
 * Register or get the Firebase Messaging Service Worker
 */
export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    // Unregister any old query-param service worker registrations to prevent Chrome PushManager collision
    try {
      const existingRegs = await navigator.serviceWorker.getRegistrations();
      for (const reg of existingRegs) {
        const scriptUrl = reg.active?.scriptURL || reg.waiting?.scriptURL || reg.installing?.scriptURL || '';
        if (scriptUrl.includes('firebase-messaging-sw.js?') && scriptUrl !== `${window.location.origin}/firebase-messaging-sw.js`) {
          console.log('[SW] Cleaning up stale parameterized SW:', scriptUrl);
          await reg.unregister();
        }
      }
    } catch (cleanErr) {
      console.warn('[SW] Cleanup error (non-fatal):', cleanErr);
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
    const readyRegistration = await navigator.serviceWorker.ready;
    console.log('[SW] Service Worker active with scope:', readyRegistration.scope);
    return readyRegistration;
  } catch (error) {
    console.error('[SW] Service Worker registration failed:', error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { success: false, reason: 'unsupported', error: 'Push notifications are not supported in this browser.' };
  }

  try {
    let permission = Notification.permission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      return { success: false, permission, error: 'Notification permission was not granted in your browser.' };
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      return { success: false, reason: 'messaging_unsupported', error: 'Firebase messaging is not supported in this environment.' };
    }

    const vapidKey = VAPID_KEY || import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('VITE_FIREBASE_VAPID_KEY is missing in frontend .env');
      return { success: false, error: 'VITE_FIREBASE_VAPID_KEY is missing in your frontend .env file.' };
    }

    let swRegistration = await registerServiceWorker();
    if (!swRegistration) {
      return { success: false, error: 'Could not register service worker.' };
    }

    let token = null;

    try {
      token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: swRegistration,
      });
    } catch (firstAttemptErr) {
      // Auto-heal 1: Unsubscribe existing stale push subscription
      try {
        const existingSub = await swRegistration.pushManager?.getSubscription();
        if (existingSub) {
          await existingSub.unsubscribe();
        }
      } catch (unsubErr) {}

      // Auto-heal 2: Clear stale Firebase IndexedDB databases
      try {
        if (typeof window !== 'undefined' && window.indexedDB) {
          window.indexedDB.deleteDatabase('firebase-installations-database');
          window.indexedDB.deleteDatabase('firebase-messaging-database');
        }
      } catch (idbErr) {}

      // Retry Attempt 2: with clean subscription
      try {
        token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: swRegistration,
        });
      } catch (secondErr) {
        // Retry Attempt 3: with default sender ID registration
        try {
          token = await getToken(messaging, {
            serviceWorkerRegistration: swRegistration,
          });
        } catch (thirdErr) {
          console.debug('[Push] Background FCM handshake unavailable in current browser session:', thirdErr?.message);
        }
      }
    }

    if (token) {
      const metadata = getDeviceMetadata();
      await notificationService.registerPushToken({
        token,
        ...metadata,
      });

      localStorage.setItem('streamkart_fcm_token', token);
      localStorage.setItem('streamkart_push_enabled', 'true');
      return { success: true, token, permission };
    }

    // If FCM token could not be obtained due to browser push service connection,
    // browser permission is still granted so real-time Socket notifications and OS banners will work!
    localStorage.setItem('streamkart_push_enabled', 'true');
    return { 
      success: true, 
      permission, 
      warning: 'Browser permission active (live notifications enabled).' 
    };
  } catch (error) {
    console.warn('[Push] Registration note:', error.message);
    return { success: false, error: error.message || 'Error initializing push notifications.' };
  }
};

/**
 * Unregister current device FCM token
 */
export const unregisterPushToken = async () => {
  try {
    const token = localStorage.getItem('streamkart_fcm_token');
    if (token) {
      await notificationService.unregisterPushToken(token);
      localStorage.removeItem('streamkart_fcm_token');
    }

    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
      } catch (e) {}
    }

    localStorage.setItem('streamkart_push_enabled', 'false');
    return { success: true };
  } catch (error) {
    console.error('Failed to unregister push token:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Foreground message listener
 */
export const onForegroundMessage = async (callback) => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log('[FCM] Foreground message received:', payload);

    const title = payload.notification?.title || payload.data?.title || 'StreamKart';
    const body = payload.notification?.body || payload.data?.body || '';
    const actionUrl = payload.data?.actionUrl || '/notifications';
    const iconUrl = '/notification-icon.png';

    const notificationOptions = {
      body,
      icon: iconUrl,
      badge: iconUrl,
      tag: payload.data?.eventKey || payload.data?.type || `sk_${Date.now()}`,
      renotify: true,
      requireInteraction: true,
      data: {
        actionUrl,
        ...payload.data,
      },
    };

    // Show native Windows browser notification via Service Worker (standard in Chromium/Windows)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then((registration) => {
            return registration.showNotification(title, notificationOptions);
          })
          .catch((err) => {
            console.warn('[FCM] ServiceWorker showNotification fallback to new Notification:', err);
            try {
              const notif = new Notification(title, notificationOptions);
              notif.onclick = (e) => {
                e.preventDefault();
                window.focus();
                if (actionUrl) window.location.href = actionUrl;
              };
            } catch (e) {}
          });
      } else {
        try {
          const notif = new Notification(title, notificationOptions);
          notif.onclick = (e) => {
            e.preventDefault();
            window.focus();
            if (actionUrl) window.location.href = actionUrl;
          };
        } catch (err) {
          console.warn('Native notification display failed:', err);
        }
      }
    }

    // Show interactive in-app toast
    toast(
      (t) =>
        createElement(
          'div',
          {
            onClick: () => {
              toast.dismiss(t.id);
              if (actionUrl) {
                window.location.href = actionUrl;
              }
            },
            className: 'cursor-pointer flex flex-col gap-1 pr-2',
          },
          createElement(
            'span',
            { className: 'font-bold text-[14px] text-[#0F172A] flex items-center gap-1.5' },
            createElement('span', null, '🔔'),
            ` ${title}`
          ),
          body
            ? createElement('span', { className: 'text-[13px] text-[#64748B] line-clamp-2' }, body)
            : null
        ),
      {
        duration: 6000,
        style: {
          borderRadius: '16px',
          background: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 10px 30px rgba(91,75,255,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          padding: '12px 16px',
        },
      }
    );

    if (callback) callback(payload);
  });
};
