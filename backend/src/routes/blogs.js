const express = require('express');
const ctrl = require('../controllers/blogController');
const { authenticate, optionalAuth, requirePermission } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// ---------- Public ----------
router.get('/blogs', optionalAuth, ctrl.list);
router.get('/blogs/slug/:slug', ctrl.getBySlug);
router.get('/blogs/related/:slug', ctrl.related);
router.get('/blogs-meta/categories', ctrl.categories);
router.get('/blogs-meta/tags', ctrl.tags);

// ---------- Admin ----------
router.get(
  '/blogs/:id',
  authenticate,
  requirePermission('blog:read_unpublished', 'blog:read_unpublished:own'),
  ctrl.getById
);

router.post('/admin/blogs', authenticate, requirePermission('blog:create'), ctrl.create);
router.put(
  '/admin/blogs/:id',
  authenticate,
  requirePermission('blog:update', 'blog:update:own'),
  ctrl.update
);
router.delete(
  '/admin/blogs/:id',
  authenticate,
  requirePermission('blog:delete', 'blog:delete:own'),
  ctrl.remove
);

router.post(
  '/admin/upload',
  authenticate,
  requirePermission('upload:create'),
  upload.single('file'),
  ctrl.upload
);

module.exports = router;
