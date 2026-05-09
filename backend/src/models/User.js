const { z } = require('zod');
const { ROLES } = require('../config/permissions');

const userPublicShape = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(ROLES),
  active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  last_login_at: z.string().nullable().optional(),
});

const userCreateSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1),
  role: z.enum(ROLES),
  active: z.boolean().optional().default(true),
});

const userUpdateSchema = z
  .object({
    email: z.string().email().toLowerCase().optional(),
    name: z.string().min(1).optional(),
    role: z.enum(ROLES).optional(),
    active: z.boolean().optional(),
    password: z.string().min(8).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
});

/** Public projection (no _id, no password_hash). */
function toPublicUser(doc) {
  if (!doc) return null;
  const { _id, password_hash, ...rest } = doc;
  return rest;
}

module.exports = {
  userPublicShape,
  userCreateSchema,
  userUpdateSchema,
  loginSchema,
  changePasswordSchema,
  toPublicUser,
};
