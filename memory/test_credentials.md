# Test Credentials

## Admin Panel (Knowledge Centre / Blogs)

- **Admin Login URL:** `/admin/login`
- **Shared Password:** `ReCircle@2026`

This password is also stored in `/app/backend/.env` as `ADMIN_PASSWORD`. To change it, update the env value and restart the backend.

The admin token returned by `/api/admin/login` is the password itself; it is sent in the `Authorization: Bearer <token>` header for all admin endpoints.
