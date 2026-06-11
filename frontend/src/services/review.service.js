import { apiGet, apiPost, apiPut, apiDelete } from './api';

export const createReview = (data) => apiPost('/reviews', data);
export const getProductReviews = (productId, params = '') =>
  apiGet(`/reviews/product/${productId}?${params}`);
export const updateReview = (id, data) => apiPut(`/reviews/${id}`, data);
export const deleteReview = (id) => apiDelete(`/reviews/${id}`);
