const { verifyToken } = require('../utils/jwt');
const { getDB } = require('../config/db');
const { hasPermission } = require('../config/permissions');
const { HttpError, asyncHandler } = require('../utils');
const logger = require('../config/logger');

/**
 * Authentication middleware.
 * Reads `Authorization: Bearer <jwt>` and attaches req.user.
 * Throws 401 if missing or invalid.
 */
const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header) throw new HttpError(401, 'Missing authorization header', 'AUTH_MISSING');

  const parts = header.split(' ');
  const token = parts.length === 2 && /^bearer$/i.test(parts[0]) ? parts[1] : header;

  let payload;
  try {
    payload = verifyToken(token);
  } catch (e) {
    throw new HttpError(401, 'Invalid or expired token', 'AUTH_INVALID');
  }

  const db = getDB();
  const user = await db.collection('users').findOne({ id: payload.sub }, { projection: { _id: 0, password_hash: 0 } });
  if (!user) throw new HttpError(401, 'User no longer exists', 'AUTH_USER_NOT_FOUND');
  if (!user.active) throw new HttpError(403, 'User account disabled', 'AUTH_DISABLED');

  req.user = user;
  next();
});

/** Optional auth — populates req.user if a valid token is present, but never fails. */
const optionalAuth = asyncHandler(async (req, _res, next) => {
  if (!req.headers.authorization) return next();
  try {
    const header = req.headers.authorization;
    const parts = header.split(' ');
    const token = parts.length === 2 && /^bearer$/i.test(parts[0]) ? parts[1] : header;
    const payload = verifyToken(token);
    const db = getDB();
    const user = await db.collection('users').findOne({ id: payload.sub }, { projection: { _id: 0, password_hash: 0 } });
    if (user && user.active) req.user = user;
  } catch (e) {
    logger.debug('optionalAuth: ignored invalid token', { error: e.message });
  }
  next();
});

/** Require at least one of the listed permissions. */
function requirePermission(...perms) {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, 'Authentication required'));
    const ok = perms.some((p) => hasPermission(req.user.role, p));
    if (!ok) return next(new HttpError(403, 'Forbidden: missing permission', 'RBAC_FORBIDDEN'));
    next();
  };
}

/** Require any one of the given roles. */
function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, 'Forbidden: role not allowed'));
    next();
  };
}

module.exports = { authenticate, optionalAuth, requirePermission, requireRole };
