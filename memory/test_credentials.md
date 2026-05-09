# Test Credentials

## Admin Panel Login (per-user RBAC)

**Login URL:** `/admin/login`

All four seeded accounts share the same password (the value of `ADMIN_PASSWORD` in `/app/backend/.env`). Change them after first login via the user-management page or "Change Password" feature.

| Role | Email | Password | Permissions |
|---|---|---|---|
| **super_admin** | `superadmin@recircle.org` | `ReCircle@2026` | Full access — manage users, blogs, settings |
| **admin** | `admin@recircle.org` | `ReCircle@2026` | Manage all blogs + manage non-super_admin users |
| **editor** | `editor@recircle.org` | `ReCircle@2026` | Create / edit / publish any blog |
| **author** | `author@recircle.org` | `ReCircle@2026` | Create / edit / delete *own* blogs only (drafts) |

## API Notes

- `POST /api/admin/login` accepts `{email, password}` and returns `{token, user}` where `token` is a JWT (HS256, 7-day expiry).
- All admin endpoints require `Authorization: Bearer <jwt>`.
- Frontend stores the JWT in `localStorage` key `recircle_admin_token` and the user object under `recircle_admin_user`.
