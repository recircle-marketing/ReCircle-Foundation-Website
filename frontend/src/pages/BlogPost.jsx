import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { api, formatBlogDate, resolveImageUrl } from '../lib/api';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const [blogRes, relatedRes] = await Promise.all([
          api.get(`/blogs/slug/${slug}`),
          api.get(`/blogs/related/${slug}`, { params: { limit: 5 } }),
        ]);
        setBlog(blogRes.data);
        setRelated(relatedRes.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        if (e?.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  // Update SEO meta
  useEffect(() => {
    if (!blog) return;
    const prevTitle = document.title;
    document.title = `${blog.meta_title || blog.title} | ReCircle Foundation`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', blog.meta_description || blog.summary || '');
    return () => {
      document.title = prevTitle;
      metaDesc.setAttribute('content', prevDesc);
    };
  }, [blog]);

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault?.();
    const q = searchTerm.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }
    try {
      setSearchLoading(true);
      const res = await api.get('/blogs', { params: { search: q, per_page: 8 } });
      setSearchResults(res.data.items);
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 max-w-5xl mx-auto px-6 animate-pulse">
        <div className="h-8 w-1/2 bg-gray-200 rounded mb-4" />
        <div className="h-72 bg-gray-200 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-6 text-center">
        <div data-testid="blog-not-found">
          <h1 className="text-3xl font-semibold mb-3">Blog not found</h1>
          <p className="text-gray-600 mb-6">The article you&rsquo;re looking for doesn&rsquo;t exist or has been moved.</p>
          <button
            type="button"
            onClick={() => navigate('/knowledge-centre')}
            className="inline-flex items-center gap-2 text-brand-blue hover:underline"
          >
            <ArrowLeft size={16} /> Back to Knowledge Centre
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-20 bg-gray-50" data-testid="blog-hero">
        <div className="w-full">
          {blog.featured_image && (
            <div className="w-full h-[40vh] min-h-[300px] md:h-[55vh] md:min-h-[420px] bg-gray-200 overflow-hidden">
              <img
                src={resolveImageUrl(blog.featured_image)}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-wrap gap-3 items-center text-sm text-gray-700">
          <span className="font-medium" data-testid="blog-detail-author">By {blog.author}</span>
          <span className="text-gray-300">|</span>
          {blog.category && (
            <>
              <span className="uppercase tracking-wide text-brand-blue font-semibold" data-testid="blog-detail-category">
                {blog.category}
              </span>
              <span className="text-gray-300">|</span>
            </>
          )}
          <span data-testid="blog-detail-date">{formatBlogDate(blog.date)}</span>
        </div>
      </section>

      {/* Main */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
          {/* Left 70% */}
          <article className="lg:col-span-7" data-testid="blog-detail-article">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8"
              data-testid="blog-detail-title"
            >
              {blog.title}
            </h1>
            <div
              className="blog-content"
              data-testid="blog-detail-content"
              dangerouslySetInnerHTML={{ __html: blog.content_html || '' }}
            />
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2" data-testid="blog-detail-tags">
                {blog.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs uppercase tracking-wide">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Right 30% sidebar */}
          <aside className="lg:col-span-3 space-y-8" data-testid="blog-sidebar">
            {/* Search */}
            <div className="rounded-lg border border-gray-200 p-5 bg-white">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Search</h3>
              <form onSubmit={handleSearch} className="relative" data-testid="sidebar-search-form">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blogs..."
                  data-testid="sidebar-search-input"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </form>
              {searchTerm.trim() && (
                <div className="mt-4">
                  {searchLoading ? (
                    <p className="text-xs text-gray-500">Searching...</p>
                  ) : searchResults && searchResults.length === 0 ? (
                    <p className="text-xs text-gray-500" data-testid="sidebar-search-empty">No results</p>
                  ) : searchResults ? (
                    <ul className="space-y-3" data-testid="sidebar-search-results">
                      {searchResults.map((r) => (
                        <li key={r.id}>
                          <Link to={`/blogs/${r.slug}`} className="block group">
                            <span className="text-xs text-gray-500">{formatBlogDate(r.date)}</span>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-brand-blue line-clamp-2">
                              {r.title}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )}
            </div>

            {/* Related */}
            <div className="rounded-lg border border-gray-200 p-5 bg-white" data-testid="sidebar-related">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Recent &amp; related</h3>
              {related.length === 0 ? (
                <p className="text-sm text-gray-500">No related posts yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {related.map((r) => (
                    <li key={r.id} className="py-4 first:pt-0 last:pb-0">
                      <Link to={`/blogs/${r.slug}`} className="flex items-start gap-3 group">
                        <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          {r.featured_image && (
                            <img
                              src={resolveImageUrl(r.featured_image)}
                              alt={r.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 mb-1">{formatBlogDate(r.date)}</p>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-brand-blue line-clamp-2 leading-snug">
                            {r.title}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <Link
                to="/knowledge-centre"
                className="inline-flex items-center gap-2 text-sm text-brand-blue hover:underline font-medium"
                data-testid="sidebar-back-link"
              >
                <ArrowLeft size={14} /> All blogs
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
