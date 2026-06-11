import { apiGet, apiPost, apiPut } from './api';

export const registerUser = (data) => apiPost('/auth/register', data);
export const loginUser = () => apiPost('/auth/login', {});
export const getMe = () => apiGet('/auth/me');
export const updateProfile = (data) => apiPut('/auth/profile', data);
export const updateFCMToken = (fcmToken) => apiPut('/auth/fcm-token', { fcmToken });
