/**
 * Centralised, validated environment configuration.
 * Throws on startup if a required key is missing.
 */
const required = (key) => {
  const v = process.env[key];
  if (v === undefined || v === '') {
    throw new Error(`Missing required env var: ${key}`);
  }
  return v;
};

const optional = (key, fallback) =>
  process.env[key] === undefined || process.env[key] === '' ? fallback : process.env[key];

module.exports = {
  PORT: parseInt(optional('NODE_BACKEND_PORT', '8002'), 10),
  MONGO_URL: required('MONGO_URL'),
  DB_NAME: required('DB_NAME'),
  CORS_ORIGINS: optional('CORS_ORIGINS', '*'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '7d'),
  BCRYPT_ROUNDS: parseInt(optional('BCRYPT_ROUNDS', '10'), 10),
  LOG_LEVEL: optional('LOG_LEVEL', 'info'),
  // Seed admin / fallback shared password (used to seed first super_admin)
  ADMIN_PASSWORD: optional('ADMIN_PASSWORD', 'ReCircle@2026'),
  UPLOADS_DIR: optional('UPLOADS_DIR', require('path').join(__dirname, '..', '..', 'uploads')),
};
