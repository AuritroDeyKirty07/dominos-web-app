// Admin API instance — uses the main app's backend
// Auth is handled via cookies (same as customer auth)
import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1/admin',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token from auth store
adminApi.interceptors.request.use((config) => {
  // Try to get token from zustand persisted store
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
    // ignore parse errors
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for global error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    console.error('Admin API error:', error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);

export default adminApi;
