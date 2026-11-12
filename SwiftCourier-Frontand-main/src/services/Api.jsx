import axios from 'axios';
import baseUrl from './BaseUrl';

const api = axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${baseUrl}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token, refresh_token: newRefresh } = res.data.data;
          localStorage.setItem('access_token', access_token);
          if (newRefresh) {
            localStorage.setItem('refresh_token', newRefresh);
          }
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
