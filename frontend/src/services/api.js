import { getIdToken } from '../firebase/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = async (endpoint, options = {}) => {
  const token = await getIdToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Don't override Content-Type for raw body (Stripe webhook)
  if (options.rawBody) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const apiGet = (endpoint) => api(endpoint);
export const apiPost = (endpoint, body) =>
  api(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (endpoint, body) =>
  api(endpoint, { method: 'PUT', body: JSON.stringify(body) });
export const apiDelete = (endpoint) =>
  api(endpoint, { method: 'DELETE' });

export default api;
