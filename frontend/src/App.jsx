import { useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import useAuth from './hooks/useAuth';
import { SocketProvider, useSocket } from './context/SocketContext';
import EnablePushPrompt from './components/common/EnablePushPrompt';
import { onForegroundMessage, requestNotificationPermission } from './firebase/messaging';
import useAuthStore from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AuthProvider({ children }) {
  useAuth();
  return children;
}

function NotificationListener({ children }) {
  const qc = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { socket } = useSocket();

  useEffect(() => {
    // If user is authenticated and browser permission is granted, ensure token is registered
    if (isAuthenticated && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      requestNotificationPermission().catch((err) => {
        console.warn('[FCM] Auto-register token error:', err);
      });
    }

    // 1. Dual-Channel: Listen for real-time live notification events
    if (socket) {
      const handleNewNotification = (dbNotification) => {
        qc.invalidateQueries({ queryKey: ['notifications'] });
        qc.invalidateQueries({ queryKey: ['unreadCount'] });

        const title = dbNotification.title || 'StreamKart';
        const body = dbNotification.message || '';
        const actionUrl = dbNotification.actionUrl || '/notifications';

        // Trigger native Windows Action Center notification pop-up
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready
              .then((reg) => {
                reg.showNotification(title, {
                  body,
                  icon: '/notification-icon.png',
                  badge: '/notification-icon.png',
                  tag: `sk_socket_${Date.now()}`,
                  requireInteraction: true,
                  renotify: true,
                  data: { actionUrl },
                });
              })
              .catch(() => {
                try {
                  new Notification(title, {
                    body,
                    icon: '/notification-icon.png',
                    requireInteraction: true,
                  });
                } catch (e) {}
              });
          }
        }
      };

      socket.on('new_notification', handleNewNotification);
      return () => {
        socket.off('new_notification', handleNewNotification);
      };
    }
  }, [qc, isAuthenticated, socket]);

  useEffect(() => {
    // 2. Listen for incoming foreground FCM notifications
    onForegroundMessage((payload) => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unreadCount'] });

      const type = payload.data?.type;
      if (type === 'NEW_ORDER' || type === 'ORDER_DELIVERED') {
        qc.invalidateQueries({ queryKey: ['sellerOrders'] });
        qc.invalidateQueries({ queryKey: ['orders'] });
      }
      if (type === 'NEW_MESSAGE') {
        qc.invalidateQueries({ queryKey: ['chats'] });
        qc.invalidateQueries({ queryKey: ['unreadChatsCount'] });
      }
    });
  }, [qc]);

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <NotificationListener>
            <AppRouter />
            <EnablePushPrompt />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(91,75,255,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                  padding: '12px 16px',
                  fontWeight: 600,
                },
              }}
            />
          </NotificationListener>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
