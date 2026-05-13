import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // Proxied by Vite in dev, same origin in prod
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local auth state if we had any
      // window.location.href = '/login'; // Optional: auto-redirect
    }
    return Promise.reject(error);
  }
);
