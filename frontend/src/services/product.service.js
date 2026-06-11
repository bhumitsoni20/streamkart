import { apiGet, apiPost, apiPut, apiDelete } from './api';

export const getProducts = (params = '') => apiGet(`/products?${params}`);
export const getProduct = (id) => apiGet(`/products/${id}`);
export const createProduct = (data) => apiPost('/products', data);
export const updateProduct = (id, data) => apiPut(`/products/${id}`, data);
export const deleteProduct = (id) => apiDelete(`/products/${id}`);
export const getSellerProducts = (params = '') => apiGet(`/products/seller/me?${params}`);
