/* eslint-disable no-undef */
// StreamKart Firebase Cloud Messaging Service Worker

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Parse Firebase config or fallback to project configuration
const params = new URL(location).searchParams;

const firebaseConfig = {
  apiKey: params.get('apiKey') || 'AIzaSyDqtKajRb4EPTV-nKxZ8M9jrVxbkwDa_sE',
  authDomain: params.get('authDomain') || 'streamkart-3b3d8.firebaseapp.com',
  projectId: params.get('projectId') || 'streamkart-3b3d8',
  storageBucket: params.get('storageBucket') || 'streamkart-3b3d8.firebasestorage.app',
  messagingSenderId: params.get('messagingSenderId') || '263126126732',
  appId: params.get('appId') || '1:263126126732:web:5255c31abeecda59ce6ba9',
};

// Initialize Firebase if projectId is provided
if (firebaseConfig.projectId) {
  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
      console.log('[SW] Background FCM message received:', payload);

      const notificationTitle =
        payload.notification?.title ||
        payload.data?.title ||
        'StreamKart';

      const notificationOptions = {
        body:
          payload.notification?.body ||
          payload.data?.body ||
          'You have a new update on StreamKart.',
        icon: '/notification-icon.png',
        badge: '/notification-icon.png',
        tag: payload.data?.eventKey || payload.data?.type || `sk_${Date.now()}`,
        renotify: true,
        requireInteraction: true,
        data: {
          actionUrl: payload.data?.actionUrl || payload.fcmOptions?.link || '/',
          orderId: payload.data?.orderId,
          chatId: payload.data?.chatId,
          type: payload.data?.type,
        },
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (err) {
    console.error('[SW] Firebase background initialization error:', err);
  }
}

// Handle notification click routing
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetPath = event.notification.data?.actionUrl || '/';
  const targetUrl = new URL(targetPath, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if a StreamKart tab is already open
        for (const client of windowClients) {
          if (client.url.startsWith(self.location.origin) && 'focus' in client) {
            // Navigate existing tab to destination and focus
            if ('navigate' in client) {
              client.navigate(targetUrl);
            }
            return client.focus();
          }
        }
        // If no open tab, open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
