import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { LogOut, FileText, Users as UsersIcon, ExternalLink } from 'lucide-react';
import {
  api,
  getAdminToken,
  clearAdminToken,
  getCurrentUser,
  setCurrentUser,
  hasPermission,
  ROLE_LABELS,
} from '../lib/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate('/admin/login');
      return;
    }
    api
      .get('/admin/verify')
      .then((res) => {
        if (res.data?.user) {
          setCurrentUser(res.data.user);
          setUser(res.data.user);
        }
        setReady(true);
      })
      .catch(() => {
        clearAdminToken();
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    clearAdminToken();
    setCurrentUser(null);
    setUser(null);
    navigate('/admin/login', { replace: true });
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading admin...
      </div>
    );
  }

  const navItem = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-blue text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:flex w-60 bg-white border-r border-gray-200 flex-col">
        <div className="p-5 border-b border-gray-200">
          <Link to="/admin/blogs" className="block">
            <span className="text-lg font-bold text-brand-blue">ReCircle</span>
            <span className="block text-xs text-gray-500">Knowledge Centre Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin/blogs" className={navItem} data-testid="admin-nav-blogs">
            <FileText size={16} /> Blogs
          </NavLink>
          {hasPermission('user:read') && (
            <NavLink to="/admin/users" className={navItem} data-testid="admin-nav-users">
              <UsersIcon size={16} /> Users
            </NavLink>
          )}
          <a
            href="/knowledge-centre"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            <ExternalLink size={16} /> View site
          </a>
        </nav>
        <div className="p-3 border-t border-gray-200">
          <div className="px-3 py-2 mb-2 rounded-md bg-gray-50">
            <p className="text-xs text-gray-500">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-brand-blue">{ROLE_LABELS[user?.role] || user?.role}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            data-testid="admin-logout-btn"
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <Link to="/admin/blogs" className="text-brand-blue font-bold">
            ReCircle Admin
          </Link>
          <div className="flex items-center gap-3">
            <NavLink to="/admin/blogs" className="text-sm text-gray-700">Blogs</NavLink>
            {hasPermission('user:read') && (
              <NavLink to="/admin/users" className="text-sm text-gray-700">Users</NavLink>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-gray-700"
              data-testid="admin-logout-mobile"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
