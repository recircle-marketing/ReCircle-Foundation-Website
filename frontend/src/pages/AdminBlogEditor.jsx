import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { api, getAdminToken, resolveImageUrl } from '../lib/api';

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = () => ({
  title: '',
  slug: '',
  summary: '',
  content_html: '',
  featured_image: '',
  author: '',
  category: '',
  tags: '',
  date: today(),
  meta_title: '',
  meta_description: '',
  published: true,
});

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const featuredFileRef = useRef(null);

  useEffect(() => {
    document.title = isNew ? 'New Blog · Admin' : 'Edit Blog · Admin';
    if (!getAdminToken()) {
      navigate('/admin/login');
      return;
    }
    if (isNew) return;

    const load = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        const b = res.data;
        setForm({
          title: b.title || '',
          slug: b.slug || '',
          summary: b.summary || '',
          content_html: b.content_html || '',
          featured_image: b.featured_image || '',
          author: b.author || '',
          category: b.category || '',
          tags: (b.tags || []).join(', '),
          date: (b.date || today()).slice(0, 10),
          meta_title: b.meta_title || '',
          meta_description: b.meta_description || '',
          published: !!b.published,
        });
      } catch (e) {
        setError('Failed to load blog.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isNew, navigate]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleFeaturedFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      update('featured_image', res.data.url);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Upload failed.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.summary.trim() || !form.author.trim()) {
      setError('Title, summary and author are required.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (!form.slug.trim()) delete payload.slug;
    try {
      if (isNew) {
        await api.post('/admin/blogs', payload);
      } else {
        await api.put(`/admin/blogs/${id}`, payload);
      }
      navigate('/admin/blogs');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="px-6 py-10 max-w-4xl mx-auto">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin/blogs" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-brand-blue">
            <ArrowLeft size={16} /> Back to all blogs
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{isNew ? 'New Blog' : 'Edit Blog'}</h1>
        <p className="text-sm text-gray-600 mb-8">Fill in the fields below and click Publish.</p>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-blog-form">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm" data-testid="admin-form-error">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                data-testid="admin-form-title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => update('author', e.target.value)}
                  data-testid="admin-form-author"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  data-testid="admin-form-date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  data-testid="admin-form-category"
                  placeholder="e.g. Safai Saathis"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => update('tags', e.target.value)}
                  data-testid="admin-form-tags"
                  placeholder="e.g. circular-economy, esg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL slug (optional)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                data-testid="admin-form-slug"
                placeholder="auto-generated from title if empty"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short summary *</label>
              <textarea
                value={form.summary}
                onChange={(e) => update('summary', e.target.value)}
                rows={3}
                data-testid="admin-form-summary"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Shown on blog cards. 2-3 lines recommended.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured image</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.featured_image}
                    onChange={(e) => update('featured_image', e.target.value)}
                    data-testid="admin-form-featured-image"
                    placeholder="Paste an image URL or upload below"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <button
                    type="button"
                    onClick={() => featuredFileRef.current?.click()}
                    className="mt-2 inline-flex items-center gap-2 text-sm text-brand-blue hover:underline"
                    data-testid="admin-form-featured-upload"
                  >
                    <Upload size={14} /> Upload image
                  </button>
                  <input
                    ref={featuredFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFeaturedFile}
                  />
                </div>
                {form.featured_image && (
                  <img
                    src={resolveImageUrl(form.featured_image)}
                    alt="Featured preview"
                    className="w-40 h-28 object-cover rounded-md border border-gray-200"
                    data-testid="admin-form-featured-preview"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Body *</label>
            <RichTextEditor
              value={form.content_html}
              onChange={(html) => update('content_html', html)}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">SEO</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => update('meta_title', e.target.value)}
                data-testid="admin-form-meta-title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
              <textarea
                value={form.meta_description}
                onChange={(e) => update('meta_description', e.target.value)}
                rows={2}
                data-testid="admin-form-meta-description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update('published', e.target.checked)}
                data-testid="admin-form-published"
                className="rounded border-gray-300"
              />
              Published (visible on the site)
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/admin/blogs"
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              data-testid="admin-form-submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-brand-blue text-white rounded-md hover:opacity-90 disabled:opacity-60"
            >
              <Save size={16} /> {saving ? 'Saving...' : isNew ? 'Publish blog' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
