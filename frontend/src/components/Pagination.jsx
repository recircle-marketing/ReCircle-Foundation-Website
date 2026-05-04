import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const goPrev = () => page > 1 && onPageChange(page - 1);
  const goNext = () => page < totalPages && onPageChange(page + 1);

  // Build simple page numbers with ellipsis for SEO
  const pages = [];
  const window = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav
      aria-label="Pagination"
      data-testid="blog-pagination"
      className="mt-12 flex items-center justify-center gap-2 text-sm"
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={page === 1}
        data-testid="pagination-prev"
        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-700 disabled:hover:border-gray-300"
      >
        &laquo; Previous
      </button>

      <div className="hidden sm:flex items-center gap-1 mx-2">
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`e-${idx}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              data-testid={`pagination-page-${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={`min-w-[36px] h-9 px-3 rounded-md border transition-colors ${
                p === page
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brand-blue hover:text-brand-blue'
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={page === totalPages}
        data-testid="pagination-next"
        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-700 disabled:hover:border-gray-300"
      >
        Next &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
