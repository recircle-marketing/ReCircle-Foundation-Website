const { z } = require('zod');

const blogCreateSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  content_html: z.string().optional().default(''),
  featured_image: z.string().optional().default(''),
  author: z.string().min(1),
  category: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  date: z.string().min(1),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  published: z.boolean().optional().default(true),
  slug: z.string().optional(),
});

const blogUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    slug: z.string().optional(),
    summary: z.string().min(1).optional(),
    content_html: z.string().optional(),
    featured_image: z.string().optional(),
    author: z.string().min(1).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: z.string().optional(),
    meta_title: z.string().nullable().optional(),
    meta_description: z.string().nullable().optional(),
    published: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

function toListItem(doc) {
  if (!doc) return null;
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title || '',
    summary: doc.summary || '',
    featured_image: doc.featured_image || '',
    author: doc.author || '',
    category: doc.category || '',
    tags: doc.tags || [],
    date: doc.date || '',
    published: !!doc.published,
  };
}

function toFullBlog(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

module.exports = { blogCreateSchema, blogUpdateSchema, toListItem, toFullBlog };
