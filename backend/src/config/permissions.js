/**
 * Role-based permission matrix.
 * Permissions follow `resource:action[:scope]` convention.
 *  - `*` is wildcard (super_admin only)
 *  - `:own` scope means the actor can only act on resources they created.
 */
const ROLES = ['super_admin', 'admin', 'editor', 'author'];

const PERMISSIONS = {
  super_admin: ['*'],

  admin: [
    'blog:create',
    'blog:read',
    'blog:read_unpublished',
    'blog:update',
    'blog:delete',
    'blog:publish',
    'user:read',
    'user:create',
    'user:update',
    'user:delete',
    'upload:create',
  ],

  editor: [
    'blog:create',
    'blog:read',
    'blog:read_unpublished',
    'blog:update',
    'blog:delete',
    'blog:publish',
    'upload:create',
  ],

  author: [
    'blog:create',
    'blog:read',
    'blog:read_unpublished:own',
    'blog:update:own',
    'blog:delete:own',
    'upload:create',
  ],
};

/** A user has permission `p` if their role grants it (or wildcard). */
function hasPermission(role, perm) {
  if (!role || !PERMISSIONS[role]) return false;
  const grants = PERMISSIONS[role];
  if (grants.includes('*')) return true;
  if (grants.includes(perm)) return true;
  return false;
}

/**
 * Check if `actor` can manage `target` user.
 * - super_admin can manage everyone (including other super_admins).
 * - admin can manage editor/author/admin but NOT super_admin.
 * - others cannot manage users.
 */
function canManageUser(actor, target) {
  if (!actor) return false;
  if (actor.role === 'super_admin') return true;
  if (actor.role === 'admin') return target.role !== 'super_admin';
  return false;
}

module.exports = { ROLES, PERMISSIONS, hasPermission, canManageUser };
