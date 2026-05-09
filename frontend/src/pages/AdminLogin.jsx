import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAdminToken, setCurrentUser, getAdminToken } from '../lib/api';
import { Lock, Mail } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Admin Login | ReCircle Foundation';
    const token = getAdminToken();
    if (token) {
      api.get('/admin/verify')
        .then((res) => {
          if (res.data?.user) setCurrentUser(res.data.user);
          navigate('/admin/blogs');
        })
        .catch(() => {});
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/admin/login', { email: email.trim().toLowerCase(), password });
      setAdminToken(res.data.token);
      setCurrentUser(res.data.user);
      navigate('/admin/blogs');
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Invalid email or password.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8" data-testid="admin-login-card">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
            <Lock size={20} />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-2 text-gray-900">Admin Sign in</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sign in with your team email and password to manage the Knowledge Centre.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="you@recircle.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-email-input"
              className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              required
              autoFocus
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password-input"
              className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600" data-testid="admin-login-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="w-full py-3 bg-brand-blue text-white font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
