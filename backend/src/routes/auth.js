const express = require('express');
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/admin/login', ctrl.login);
router.get('/admin/verify', authenticate, ctrl.me);
router.get('/auth/me', authenticate, ctrl.me);
router.post('/auth/change-password', authenticate, ctrl.changePassword);

module.exports = router;
