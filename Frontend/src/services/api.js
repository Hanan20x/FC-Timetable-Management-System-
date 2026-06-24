import axios from 'axios';

// In Vite, env vars exposed to client code must be prefixed with VITE_.
// Falls back to localhost:5000 (the backend's default port) if unset.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT to every outgoing request, read fresh from localStorage
// each time (not captured once at module-load) so a login/logout during
// the session is picked up immediately without needing to recreate the
// axios instance.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever returns 401 (token expired / invalid / user deleted),
// clear the stale token and force back to login rather than leaving the
// app in a broken half-authenticated state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ttms_token');
      localStorage.removeItem('ttms_user');
      // Avoid a redirect loop if the 401 came from the login request itself
      if (!error.config.url.includes('/auth/login') && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
