/**
 * Minimal structured logger. Writes JSON-ish lines to stdout/stderr.
 * Levels: error > warn > info > debug.
 */
const env = require('./env');

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const threshold = LEVELS[env.LOG_LEVEL] ?? LEVELS.info;

const fmt = (level, message, meta) => {
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(meta || {}),
  };
  return JSON.stringify(entry);
};

const log = (level, target) => (message, meta) => {
  if (LEVELS[level] > threshold) return;
  target(fmt(level, message, meta));
};

module.exports = {
  error: log('error', console.error),
  warn: log('warn', console.warn),
  info: log('info', console.log),
  debug: log('debug', console.log),
};
