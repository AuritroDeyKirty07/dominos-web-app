// Admin API instance — uses the main app's backend

import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.DEV
    ? 'http://localhost:5000/api/v1/admin'
    : '/api/v1/admin',

  timeout: 15000,
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token from auth store
adminApi.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('auth-storage');

      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // Ignore parse errors
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    console.error(
      'Admin API error:',
      error.response?.data?.error || error.message
    );

    return Promise.reject(error);
  }
);

export default adminApi;