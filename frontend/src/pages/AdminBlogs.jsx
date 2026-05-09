import React, { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { api, formatBlogDate, hasPermission } from '../lib/api';

const AdminBlogs = () => {
  const { user } = useOutletContext();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const canPublish = hasPermission('blog:publish');
  const canEditAny = hasPermission('blog:update');
  const canDeleteAny = hasPermission('blog:delete');

  const fetchBlogs = useCallback(async (p) => {
    try {
      setLoading(true);
      const res = await api.get('/blogs', {
        params: { page: p, per_page: 20, include_unpublished: true, sort: 'date_desc' },
      });
      setBlogs(res.data.items);
      setTotalPages(res.data.total_pages);
    } catch (e) {
      // 401 handled globally
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Admin · Blogs | ReCircle Foundation';
    fetchBlogs(page);
  }, [page, fetchBlogs]);

  const isOwner = (b) => b?.created_by && user && b.created_by === user.id;
  const canEdit = (b) => canEditAny || (hasPermission('blog:update:own') && isOwner(b));
  const canDelete = (b) => canDeleteAny || (hasPermission('blog:delete:own') && isOwner(b));

  const handleDelete = async (blog) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/blogs/${blog.id}`);
      fetchBlogs(page);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e?.response?.data?.detail || 'Failed to delete blog.');
    }
  };

  const togglePublish = async (blog) => {
    try {
      await api.put(`/admin/blogs/${blog.id}`, { published: !blog.published });
      fetchBlogs(page);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e?.response?.data?.detail || 'Failed to update blog.');
    }
  };

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
          <p className="text-sm text-gray-600 mt-1">
            {canEditAny
              ? 'Manage all posts published on the website.'
              : 'You can manage posts you created. Drafts are reviewed before going live.'}
          </p>
        </div>
        {hasPermission('blog:create') && (
          <Link
            to="/admin/blogs/new"
            data-testid="admin-new-blog-btn"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> New Blog
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-gray-500">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500" data-testid="admin-empty-state">
            No blogs yet. {hasPermission('blog:create') && 'Click "New Blog" to publish your first post.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm" data-testid="admin-blogs-table">
              <thead className="bg-gray-50 border-b border-gray-200 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700">Title</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Author</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`admin-row-${b.slug}`}>
                    <td className="px-4 py-3">
                      {canEdit(b) ? (
                        <Link to={`/admin/blogs/${b.id}`} className="font-medium text-gray-900 hover:text-brand-blue">
                          {b.title}
                        </Link>
                      ) : (
                        <span className="font-medium text-gray-900">{b.title}</span>
                      )}
                      <div className="text-xs text-gray-500 mt-0.5">/{b.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.author}</td>
                    <td className="px-4 py-3 text-gray-700">{b.category || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{formatBlogDate(b.date)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          b.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {b.published && (
                          <Link
                            to={`/blogs/${b.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-brand-blue"
                            title="View public page"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}
                        {canPublish && (
                          <button
                            type="button"
                            onClick={() => togglePublish(b)}
                            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-brand-blue"
                            title={b.published ? 'Unpublish' : 'Publish'}
                            data-testid={`admin-toggle-${b.slug}`}
                          >
                            {b.published ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                        {canEdit(b) && (
                          <Link
                            to={`/admin/blogs/${b.id}`}
                            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-brand-blue"
                            title="Edit"
                            data-testid={`admin-edit-${b.slug}`}
                          >
                            <Edit2 size={16} />
                          </Link>
                        )}
                        {canDelete(b) && (
                          <button
                            type="button"
                            onClick={() => handleDelete(b)}
                            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                            title="Delete"
                            data-testid={`admin-delete-${b.slug}`}
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

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
