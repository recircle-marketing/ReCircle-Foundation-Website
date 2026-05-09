const { v4: uuid } = require('uuid');
const { getDB } = require('../config/db');
const env = require('../config/env');
const logger = require('../config/logger');
const { hashPassword } = require('../utils/password');
const { toPublicUser } = require('../models/User');
const { HttpError } = require('../utils');
const { canManageUser } = require('../config/permissions');

function nowIso() {
  return new Date().toISOString();
}

async function getUserByEmail(email) {
  const db = getDB();
  return db.collection('users').findOne({ email: String(email).toLowerCase() });
}

async function getUserById(id, { includeHash = false } = {}) {
  const db = getDB();
  const projection = includeHash ? { _id: 0 } : { _id: 0, password_hash: 0 };
  return db.collection('users').findOne({ id }, { projection });
}

async function listUsers({ skip = 0, limit = 50 } = {}) {
  const db = getDB();
  const cursor = db
    .collection('users')
    .find({}, { projection: { _id: 0, password_hash: 0 } })
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);
  const items = await cursor.toArray();
  const total = await db.collection('users').countDocuments({});
  return { items, total };
}

async function createUser({ email, password, name, role, active = true }, actor = null) {
  const db = getDB();
  const existing = await getUserByEmail(email);
  if (existing) throw new HttpError(409, 'User with this email already exists', 'USER_EXISTS');

  if (actor && !canManageUser(actor, { role })) {
    throw new HttpError(403, `You cannot create a user with role "${role}"`);
  }

  const doc = {
    id: uuid(),
    email: String(email).toLowerCase(),
    name,
    role,
    active,
    password_hash: await hashPassword(password),
    created_at: nowIso(),
    updated_at: nowIso(),
    last_login_at: null,
  };
  await db.collection('users').insertOne(doc);
  return toPublicUser(doc);
}

async function updateUser(id, payload, actor) {
  const db = getDB();
  const target = await getUserById(id);
  if (!target) throw new HttpError(404, 'User not found');

  if (actor.id !== target.id && !canManageUser(actor, target)) {
    throw new HttpError(403, 'You cannot manage this user');
  }

  // Role escalation guard: only super_admin can promote to super_admin.
  if (payload.role && payload.role !== target.role) {
    if (actor.role !== 'super_admin' && payload.role === 'super_admin') {
      throw new HttpError(403, 'Only super_admin can assign the super_admin role');
    }
    if (!canManageUser(actor, { role: payload.role })) {
      throw new HttpError(403, 'You cannot assign that role');
    }
  }

  // Self-update restrictions: a non-super_admin cannot change their own role or active flag.
  if (actor.id === target.id) {
    if (payload.role && payload.role !== target.role && actor.role !== 'super_admin') {
      throw new HttpError(403, 'You cannot change your own role');
    }
    if (payload.active === false && actor.role !== 'super_admin') {
      throw new HttpError(403, 'You cannot deactivate your own account');
    }
  }

  const update = { ...payload, updated_at: nowIso() };
  if (payload.password) {
    update.password_hash = await hashPassword(payload.password);
    delete update.password;
  }
  if (payload.email) update.email = String(payload.email).toLowerCase();

  await db.collection('users').updateOne({ id }, { $set: update });
  return toPublicUser(await getUserById(id));
}

async function deleteUser(id, actor) {
  const db = getDB();
  const target = await getUserById(id);
  if (!target) throw new HttpError(404, 'User not found');
  if (actor.id === target.id) throw new HttpError(400, 'You cannot delete yourself');
  if (!canManageUser(actor, target)) throw new HttpError(403, 'You cannot delete this user');

  // Prevent deleting the last super_admin.
  if (target.role === 'super_admin') {
    const count = await db.collection('users').countDocuments({ role: 'super_admin' });
    if (count <= 1) throw new HttpError(400, 'Cannot delete the last super_admin');
  }

  await db.collection('users').deleteOne({ id });
  return { ok: true };
}

async function recordLogin(id) {
  const db = getDB();
  await db.collection('users').updateOne({ id }, { $set: { last_login_at: nowIso() } });
}

/**
 * Seeds the default 4 role-based users on first boot.
 * Idempotent: skips users that already exist.
 */
async function seedDefaultUsers() {
  const db = getDB();
  const sharedPassword = env.ADMIN_PASSWORD;
  const seeds = [
    { email: 'superadmin@recircle.org', name: 'Super Admin', role: 'super_admin' },
    { email: 'admin@recircle.org', name: 'Admin', role: 'admin' },
    { email: 'editor@recircle.org', name: 'Editor', role: 'editor' },
    { email: 'author@recircle.org', name: 'Author', role: 'author' },
  ];

  let inserted = 0;
  for (const s of seeds) {
    const existing = await getUserByEmail(s.email);
    if (existing) continue;
    await db.collection('users').insertOne({
      id: uuid(),
      email: s.email,
      name: s.name,
      role: s.role,
      active: true,
      password_hash: await hashPassword(sharedPassword),
      created_at: nowIso(),
      updated_at: nowIso(),
      last_login_at: null,
    });
    inserted += 1;
  }
  if (inserted > 0) {
    logger.info('Seeded default users', { count: inserted, password: '(see ADMIN_PASSWORD env)' });
  }
}

module.exports = {
  getUserByEmail,
  getUserById,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  recordLogin,
  seedDefaultUsers,
};
