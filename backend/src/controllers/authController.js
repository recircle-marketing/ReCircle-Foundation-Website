const { asyncHandler, HttpError } = require('../utils');
const { signToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/password');
const { getUserByEmail, recordLogin } = require('../services/userService');
const { toPublicUser, loginSchema, changePasswordSchema } = require('../models/User');
const { validate } = require('../middleware/validate');
const { hashPassword } = require('../utils/password');
const { getDB } = require('../config/db');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) throw new HttpError(401, 'Invalid credentials');
  if (!user.active) throw new HttpError(403, 'Account disabled');
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  await recordLogin(user.id);
  const token = signToken({ sub: user.id, role: user.role });
  res.json({ token, user: toPublicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  const db = getDB();
  const user = await db.collection('users').findOne({ id: req.user.id });
  if (!user) throw new HttpError(404, 'User not found');

  const ok = await comparePassword(current_password, user.password_hash);
  if (!ok) throw new HttpError(401, 'Current password is incorrect');

  await db.collection('users').updateOne(
    { id: user.id },
    { $set: { password_hash: await hashPassword(new_password), updated_at: new Date().toISOString() } }
  );
  res.json({ ok: true });
});

module.exports = {
  login: [validate(loginSchema), login],
  me,
  changePassword: [validate(changePasswordSchema), changePassword],
};
