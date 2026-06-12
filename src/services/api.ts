import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/token/login');
    if (error.response?.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('logitrack_auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
