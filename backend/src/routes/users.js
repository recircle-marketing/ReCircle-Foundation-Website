const express = require('express');
const ctrl = require('../controllers/userController');
const { authenticate, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Listing & getting users — admin and super_admin only.
router.get('/users', authenticate, requirePermission('user:read'), ctrl.list);
router.get('/users/:id', authenticate, requirePermission('user:read'), ctrl.get);
router.post('/users', authenticate, requirePermission('user:create'), ctrl.create);
router.put('/users/:id', authenticate, requirePermission('user:update'), ctrl.update);
router.delete('/users/:id', authenticate, requirePermission('user:delete'), ctrl.remove);

module.exports = router;
