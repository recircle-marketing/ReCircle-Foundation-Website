const path = require('path');
const { asyncHandler, HttpError } = require('../utils');
const { validate } = require('../middleware/validate');
const { blogCreateSchema, blogUpdateSchema, toFullBlog } = require('../models/Blog');
const blogService = require('../services/blogService');
const { hasPermission } = require('../config/permissions');

const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const per_page = Math.min(50, Math.max(1, parseInt(req.query.per_page || '9', 10)));
  const sort = req.query.sort || 'date_desc';
  const search = req.query.search || undefined;
  const category = req.query.category || undefined;
  const tag = req.query.tag || undefined;

  let includeUnpublished = String(req.query.include_unpublished || '').toLowerCase() === 'true';
  let ownerId = null;

  if (includeUnpublished) {
    if (!req.user) {
      includeUnpublished = false;
    } else if (hasPermission(req.user.role, 'blog:read_unpublished')) {
      // OK, can see all
    } else if (hasPermission(req.user.role, 'blog:read_unpublished:own')) {
      ownerId = req.user.id;
    } else {
      includeUnpublished = false;
    }
  }

  const result = await blogService.listBlogs({
    page,
    per_page,
    search,
    category,
    tag,
    sort,
    includeUnpublished,
    ownerId,
  });
  res.json(result);
});

const getBySlug = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogBySlug(req.params.slug);
  if (!blog) throw new HttpError(404, 'Blog not found');
  res.json(toFullBlog(blog));
});

const getById = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogById(req.params.id);
  if (!blog) throw new HttpError(404, 'Blog not found');

  // Author can only fetch their own draft via this endpoint.
  if (
    !hasPermission(req.user.role, 'blog:read_unpublished') &&
    blog.created_by !== req.user.id
  ) {
    throw new HttpError(403, 'You cannot access this blog');
  }
  res.json(toFullBlog(blog));
});

const related = asyncHandler(async (req, res) => {
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit || '5', 10)));
  res.json(await blogService.getRelatedBlogs(req.params.slug, limit));
});

const create = asyncHandler(async (req, res) => {
  const blog = await blogService.createBlog(req.body, req.user);
  res.status(201).json(blog);
});

const update = asyncHandler(async (req, res) => {
  const blog = await blogService.updateBlog(req.params.id, req.body, req.user);
  res.json(blog);
});

const remove = asyncHandler(async (req, res) => {
  res.json(await blogService.deleteBlog(req.params.id, req.user));
});

const categories = asyncHandler(async (_req, res) => {
  res.json(await blogService.distinctCategories());
});

const tags = asyncHandler(async (_req, res) => {
  res.json(await blogService.distinctTags());
});

const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError(400, 'No file uploaded');
  const filename = path.basename(req.file.path);
  res.status(201).json({ url: `/api/uploads/${filename}`, filename });
});

module.exports = {
  list,
  getBySlug,
  getById,
  related,
  categories,
  tags,
  create: [validate(blogCreateSchema), create],
  update: [validate(blogUpdateSchema), update],
  remove,
  upload,
};
