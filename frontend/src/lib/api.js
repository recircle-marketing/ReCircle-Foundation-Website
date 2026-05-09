import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

const TOKEN_KEY = 'recircle_admin_token';
const USER_KEY = 'recircle_admin_user';

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearAdminToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
};

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // Token invalid or expired — clear and let the page redirect.
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const isLoginRoute = window.location.pathname === '/admin/login';
      if (isAdminRoute && !isLoginRoute) {
        clearAdminToken();
      }
    }
    return Promise.reject(err);
  }
);

// Resolve uploaded image URLs (backend returns /api/uploads/<filename>)
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/api/')) return `${BASE_URL}${url}`;
  return url;
};

export const formatBlogDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthName = months[parseInt(m, 10) - 1] || m;
  return `${d}-${monthName}-${y}`;
};

// ===== RBAC helpers =====

const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'blog:create', 'blog:read', 'blog:read_unpublished', 'blog:update', 'blog:delete', 'blog:publish',
    'user:read', 'user:create', 'user:update', 'user:delete', 'upload:create',
  ],
  editor: [
    'blog:create', 'blog:read', 'blog:read_unpublished', 'blog:update', 'blog:delete', 'blog:publish',
    'upload:create',
  ],
  author: [
    'blog:create', 'blog:read', 'blog:read_unpublished:own',
    'blog:update:own', 'blog:delete:own', 'upload:create',
  ],
};

export const hasPermission = (perm) => {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  const perms = ROLE_PERMISSIONS[user.role] || [];
  if (perms.includes('*')) return true;
  return perms.includes(perm);
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  author: 'Author',
};
