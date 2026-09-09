import { apiGet, apiPut, apiPost } from './api';

export const getNotifications = (params = '') => apiGet(`/notifications?${params}`);
export const getUnreadCount = () => apiGet('/notifications/unread-count');
export const markAsRead = (id) => apiPut(`/notifications/${id}/read`, {});
export const markAllAsRead = () => apiPut('/notifications/read-all', {});

// Push Token Management
export const registerPushToken = (data) => apiPost('/notifications/register-token', data);
export const unregisterPushToken = (token) => apiPost('/notifications/unregister-token', { token });

// Notification Preferences
export const getNotificationSettings = () => apiGet('/notifications/settings');
export const updateNotificationSettings = (settings) => apiPut('/notifications/settings', settings);

// Test Push
export const sendTestNotification = () => apiPost('/notifications/test', {});
