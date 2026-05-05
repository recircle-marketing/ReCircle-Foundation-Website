import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import { api } from '../lib/api';

const HERO_IMAGE = 'https://customer-assets.emergentagent.com/job_7c0a8115-aae0-4e76-94eb-7d9b8d0ac199/artifacts/i3any0ku_DSC09137.JPG';

const KnowledgeCentre = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [page, setPage] = useState(Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1);
  const [data, setData] = useState({ items: [], total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = useCallback(async (p) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/blogs', { params: { page: p, per_page: 9, sort: 'date_desc' } });
      setData(res.data);
    } catch (e) {
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, fetchBlogs]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: String(newPage) });
  };

  // SEO
  useEffect(() => {
    const prev = document.title;
    document.title = 'Knowledge Centre | ReCircle Foundation Blogs';
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        data-testid="kc-hero"
        className="relative w-full pt-20"
      >
        <div
          className="relative w-full h-[60vh] min-h-[420px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h1
              data-testid="kc-hero-title"
              className="text-white font-bold text-4xl sm:text-5xl lg:text-6xl mb-4 tracking-tight"
            >
              Blogs
            </h1>
            <h2
              data-testid="kc-hero-subtitle"
              className="text-white/90 text-base md:text-lg lg:text-lg max-w-2xl mx-auto"
            >
              Insights from India&rsquo;s evolving waste ecosystem
            </h2>
          </div>
        </div>
      </section>

      {/* Listing */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24" data-testid="kc-listing-section">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="aspect-[16/10] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-1/3 bg-gray-200 rounded" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-600" data-testid="kc-error">{error}</p>
        ) : data.items.length === 0 ? (
          <div className="text-center py-16" data-testid="kc-empty">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No blogs published yet</h3>
            <p className="text-gray-600">Please check back soon for new insights and stories.</p>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-testid="kc-blog-grid"
            >
              {data.items.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={data.total_pages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default KnowledgeCentre;
