const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const blogRoutes = require('./blogs');

const router = express.Router();

router.get('/', (_req, res) => res.json({ message: 'ReCircle Foundation API (Node.js)' }));
router.get('/_health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', blogRoutes);

module.exports = router;
