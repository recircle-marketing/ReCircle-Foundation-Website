import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

const TOKEN_KEY = 'recircle_admin_token';

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(TOKEN_KEY);

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Resolve uploaded image URLs (backend returns /api/uploads/<filename>)
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/api/')) return `${BASE_URL}${url}`;
  return url;
};

export const formatBlogDate = (dateStr) => {
  if (!dateStr) return '';
  // Expect YYYY-MM-DD
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[parseInt(m, 10) - 1] || m;
  return `${d}-${monthName}-${y}`;
};
