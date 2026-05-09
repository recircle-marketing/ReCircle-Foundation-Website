import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { api, hasPermission, ROLE_LABELS } from '../lib/api';

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'author', label: 'Author' },
];

const emptyForm = () => ({
  email: '',
  name: '',
  role: 'author',
  active: true,
  password: '',
});

const AdminUsers = () => {
  const { user: currentUser } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | <user>
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canCreate = hasPermission('user:create');
  const canEditAny = hasPermission('user:update');
  const canDelete = hasPermission('user:delete');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { per_page: 100 } });
      setUsers(res.data.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Admin · Users | ReCircle Foundation';
    fetchUsers();
  }, [fetchUsers]);

  const openNew = () => {
    setEditing('new');
    setForm(emptyForm());
    setError('');
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      email: u.email,
      name: u.name,
      role: u.role,
      active: u.active,
      password: '',
    });
    setError('');
  };

  const close = () => {
    setEditing(null);
    setForm(emptyForm());
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('/users', form);
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        // Don't send unchanged email if same as before (avoid uniqueness conflict on case)
        await api.put(`/users/${editing.id}`, payload);
      }
      await fetchUsers();
      close();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    if (u.id === currentUser?.id) return;
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete user ${u.email}?`)) return;
    try {
      await api.delete(`/users/${u.id}`);
      fetchUsers();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err?.response?.data?.detail || 'Failed to delete user.');
    }
  };

  return (
    <div className="px-6 lg:px-10 py-8" data-testid="admin-users-page">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team & access</h1>
          <p className="text-sm text-gray-600 mt-1">Manage who can publish and administer the Knowledge Centre.</p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={openNew}
            data-testid="admin-new-user-btn"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> New User
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-gray-500">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No users.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm" data-testid="admin-users-table">
              <thead className="bg-gray-50 border-b border-gray-200 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Role</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Last login</th>
                  <th className="px-4 py-3 font-medium text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`admin-user-row-${u.email}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {u.name}
                      {u.id === currentUser?.id && (
                        <span className="ml-2 text-xs text-brand-blue">(you)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{u.email}</td>
                    <td className="px-4 py-3 text-gray-700">{ROLE_LABELS[u.role] || u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {canEditAny && (
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-brand-blue"
                            title="Edit"
                            data-testid={`admin-edit-user-${u.email}`}
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {canDelete && u.id !== currentUser?.id && (
                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                            title="Delete"
                            data-testid={`admin-delete-user-${u.email}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / create modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={close}>
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            data-testid="admin-user-form"
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">
                {editing === 'new' ? 'New user' : `Edit ${editing.name || editing.email}`}
              </h2>
              <button type="button" onClick={close} className="p-1 rounded hover:bg-gray-100 text-gray-500">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="user-form-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="user-form-email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    data-testid="user-form-role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    {ROLE_OPTIONS
                      .filter((r) => currentUser?.role === 'super_admin' || r.value !== 'super_admin')
                      .map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      data-testid="user-form-active"
                    />
                    Active
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editing === 'new' ? 'Password' : 'New password (leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  data-testid="user-form-password"
                  minLength={editing === 'new' ? 8 : 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required={editing === 'new'}
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 8 characters.</p>
              </div>
              {error && <p className="text-sm text-red-600" data-testid="user-form-error">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t bg-gray-50 rounded-b-lg">
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                data-testid="user-form-submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-md hover:opacity-90 disabled:opacity-60"
              >
                <Save size={14} /> {saving ? 'Saving...' : editing === 'new' ? 'Create user' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
