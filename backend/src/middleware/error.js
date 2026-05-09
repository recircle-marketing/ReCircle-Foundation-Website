const logger = require('../config/logger');

/** Centralised error handler. Last middleware in the chain. */
function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const code = err.code;
  const payload = {
    detail: err.message || 'Internal server error',
  };
  if (code) payload.code = code;
  if (err.issues) payload.issues = err.issues;

  if (status >= 500) {
    logger.error('Unhandled error', {
      method: req.method,
      url: req.originalUrl,
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.warn('Request rejected', {
      method: req.method,
      url: req.originalUrl,
      status,
      message: err.message,
    });
  }

  res.status(status).json(payload);
}

function notFound(_req, res, _next) {
  res.status(404).json({ detail: 'Not Found' });
}

module.exports = { errorHandler, notFound };
