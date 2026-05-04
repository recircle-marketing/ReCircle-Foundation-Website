import React from 'react';
import { Link } from 'react-router-dom';
import { formatBlogDate, resolveImageUrl } from '../lib/api';

const BlogCard = ({ blog }) => {
  if (!blog) return null;
  const link = `/blogs/${blog.slug}`;
  return (
    <article
      data-testid={`blog-card-${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <Link to={link} className="block overflow-hidden bg-gray-100 aspect-[16/10]">
        {blog.featured_image ? (
          <img
            src={resolveImageUrl(blog.featured_image)}
            alt={blog.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-wide text-brand-blue">
          {blog.category && (
            <span className="font-semibold" data-testid={`blog-category-${blog.slug}`}>
              {blog.category}
            </span>
          )}
          {blog.category && <span className="text-gray-300">|</span>}
          <span className="text-gray-500" data-testid={`blog-date-${blog.slug}`}>
            {formatBlogDate(blog.date)}
          </span>
        </div>

        <Link to={link} className="block">
          <h3
            className="mb-3 line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-brand-blue"
            data-testid={`blog-title-${blog.slug}`}
          >
            {blog.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-3 text-sm text-gray-600 leading-relaxed">
          {blog.summary}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            By <span className="font-medium text-gray-700">{blog.author}</span>
          </span>
          <Link
            to={link}
            data-testid={`blog-read-more-${blog.slug}`}
            className="inline-flex items-center text-sm font-semibold text-brand-blue transition-colors hover:underline"
          >
            Read More
            <span aria-hidden className="ml-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
