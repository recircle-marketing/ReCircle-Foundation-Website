const { v4: uuid } = require('uuid');
const { getDB } = require('../config/db');
const { toSlug, HttpError } = require('../utils');
const { toListItem, toFullBlog } = require('../models/Blog');
const { hasPermission } = require('../config/permissions');

const nowIso = () => new Date().toISOString();

async function ensureUniqueSlug(base, excludeId = null) {
  const db = getDB();
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const q = { slug };
    if (excludeId) q.id = { $ne: excludeId };
    const existing = await db.collection('blogs').findOne(q, { projection: { _id: 0, id: 1 } });
    if (!existing) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listBlogs({
  page = 1,
  per_page = 9,
  search,
  category,
  tag,
  sort = 'date_desc',
  includeUnpublished = false,
  ownerId = null,
}) {
  const db = getDB();
  const query = {};

  if (!includeUnpublished) {
    query.published = true;
  } else if (ownerId) {
    // Author scope: only their own (published or not).
    query.created_by = ownerId;
  }

  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (search) {
    const re = { $regex: escapeRegex(search), $options: 'i' };
    query.$or = [
      { title: re },
      { summary: re },
      { content_html: re },
      { author: re },
      { category: re },
      { tags: re },
    ];
  }

  const sortDir = sort === 'date_asc' ? 1 : -1;
  const total = await db.collection('blogs').countDocuments(query);
  const skip = (page - 1) * per_page;

  const items = await db
    .collection('blogs')
    .find(query, { projection: { _id: 0 } })
    .sort({ date: sortDir, created_at: -1 })
    .skip(skip)
    .limit(per_page)
    .toArray();

  return {
    items: items.map(toListItem),
    total,
    page,
    per_page,
    total_pages: Math.max(1, Math.ceil(total / per_page)),
  };
}

async function getBlogBySlug(slug) {
  const db = getDB();
  return db.collection('blogs').findOne({ slug, published: true }, { projection: { _id: 0 } });
}

async function getBlogById(id) {
  const db = getDB();
  return db.collection('blogs').findOne({ id }, { projection: { _id: 0 } });
}

async function getRelatedBlogs(slug, limit = 5) {
  const db = getDB();
  const current = await db.collection('blogs').findOne({ slug }, { projection: { _id: 0 } });
  const baseQuery = { published: true, slug: { $ne: slug } };
  let query = baseQuery;
  if (current && current.tags && current.tags.length > 0) {
    query = { ...baseQuery, tags: { $in: current.tags } };
  }

  let docs = await db
    .collection('blogs')
    .find(query, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .limit(limit)
    .toArray();

  if (docs.length < limit) {
    const seen = new Set(docs.map((d) => d.id));
    const more = await db
      .collection('blogs')
      .find(
        { ...baseQuery, id: { $nin: Array.from(seen) } },
        { projection: { _id: 0 } }
      )
      .sort({ date: -1 })
      .limit(limit - docs.length)
      .toArray();
    docs = docs.concat(more);
  }
  return docs.map(toListItem);
}

async function createBlog(payload, actor) {
  const db = getDB();
  const baseSlug = toSlug(payload.slug || payload.title) || uuid().slice(0, 8);
  const slug = await ensureUniqueSlug(baseSlug);

  // Authors cannot publish — force draft.
  let published = !!payload.published;
  if (!hasPermission(actor.role, 'blog:publish')) published = false;

  const doc = {
    id: uuid(),
    slug,
    title: payload.title,
    summary: payload.summary,
    content_html: payload.content_html ?? '',
    featured_image: payload.featured_image ?? '',
    author: payload.author,
    category: payload.category ?? '',
    tags: payload.tags ?? [],
    date: payload.date,
    meta_title: payload.meta_title ?? null,
    meta_description: payload.meta_description ?? null,
    published,
    created_by: actor.id,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  await db.collection('blogs').insertOne(doc);
  return toFullBlog(doc);
}

async function updateBlog(id, payload, actor) {
  const db = getDB();
  const existing = await getBlogById(id);
  if (!existing) throw new HttpError(404, 'Blog not found');

  // Permission scope check.
  const isOwner = existing.created_by && existing.created_by === actor.id;
  const canUpdateAny = hasPermission(actor.role, 'blog:update');
  const canUpdateOwn = hasPermission(actor.role, 'blog:update:own');
  if (!canUpdateAny && !(canUpdateOwn && isOwner)) {
    throw new HttpError(403, 'You cannot edit this blog');
  }

  const update = { ...payload, updated_at: nowIso() };

  // Authors cannot change publish status.
  if ('published' in update && !hasPermission(actor.role, 'blog:publish')) {
    delete update.published;
  }

  if (payload.slug || (payload.title && !existing.slug)) {
    const base = toSlug(payload.slug || payload.title || existing.title) || existing.slug;
    update.slug = await ensureUniqueSlug(base, id);
  }

  await db.collection('blogs').updateOne({ id }, { $set: update });
  return toFullBlog(await getBlogById(id));
}

async function deleteBlog(id, actor) {
  const db = getDB();
  const existing = await getBlogById(id);
  if (!existing) throw new HttpError(404, 'Blog not found');

  const isOwner = existing.created_by && existing.created_by === actor.id;
  const canDeleteAny = hasPermission(actor.role, 'blog:delete');
  const canDeleteOwn = hasPermission(actor.role, 'blog:delete:own');
  if (!canDeleteAny && !(canDeleteOwn && isOwner)) {
    throw new HttpError(403, 'You cannot delete this blog');
  }

  await db.collection('blogs').deleteOne({ id });
  return { ok: true };
}

async function distinctCategories() {
  const db = getDB();
  const cats = await db.collection('blogs').distinct('category', { published: true });
  return cats.filter(Boolean);
}

async function distinctTags() {
  const db = getDB();
  const tags = await db.collection('blogs').distinct('tags', { published: true });
  return tags.filter(Boolean);
}

module.exports = {
  listBlogs,
  getBlogBySlug,
  getBlogById,
  getRelatedBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  distinctCategories,
  distinctTags,
};
