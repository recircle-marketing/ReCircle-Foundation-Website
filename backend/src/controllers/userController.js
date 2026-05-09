const { asyncHandler } = require('../utils');
const { listUsers, createUser, updateUser, deleteUser, getUserById } = require('../services/userService');
const { toPublicUser, userCreateSchema, userUpdateSchema } = require('../models/User');
const { validate } = require('../middleware/validate');
const { HttpError } = require('../utils');

const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const per_page = Math.min(100, Math.max(1, parseInt(req.query.per_page || '50', 10)));
  const result = await listUsers({ skip: (page - 1) * per_page, limit: per_page });
  res.json({
    items: result.items,
    total: result.total,
    page,
    per_page,
    total_pages: Math.max(1, Math.ceil(result.total / per_page)),
  });
});

const get = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) throw new HttpError(404, 'User not found');
  res.json(toPublicUser(user));
});

const create = asyncHandler(async (req, res) => {
  const result = await createUser(req.body, req.user);
  res.status(201).json(result);
});

const update = asyncHandler(async (req, res) => {
  const result = await updateUser(req.params.id, req.body, req.user);
  res.json(result);
});

const remove = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id, req.user);
  res.json({ ok: true });
});

module.exports = {
  list,
  get,
  create: [validate(userCreateSchema), create],
  update: [validate(userUpdateSchema), update],
  remove,
};
