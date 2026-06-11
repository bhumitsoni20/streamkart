import { apiGet, apiPut } from './api';

export const getNotifications = (params = '') => apiGet(`/notifications?${params}`);
export const getUnreadCount = () => apiGet('/notifications/unread-count');
export const markAsRead = (id) => apiPut(`/notifications/${id}/read`, {});
export const markAllAsRead = () => apiPut('/notifications/read-all', {});
