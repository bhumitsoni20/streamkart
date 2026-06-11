import { apiGet, apiPost, apiPut } from './api';

export const createOrder = (data) => apiPost('/orders', data);
export const getMyOrders = (params = '') => apiGet(`/orders?${params}`);
export const getOrder = (id) => apiGet(`/orders/${id}`);
export const updateOrderStatus = (id, status) => apiPut(`/orders/${id}/status`, { orderStatus: status });
export const getSellerOrders = (params = '') => apiGet(`/orders/seller/me?${params}`);
