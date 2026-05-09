const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const logger = require('./config/logger');
const apiRouter = require('./routes');
const { errorHandler, notFound } = require('./middleware/error');

function buildApp() {
  const app = express();

  // Trust proxy (the Python shim / k8s ingress).
  app.set('trust proxy', true);

  // Security & basic middleware.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: env.CORS_ORIGINS === '*' ? true : env.CORS_ORIGINS.split(',').map((o) => o.trim()),
      credentials: true,
    })
  );

  // Streamed request logging via morgan, piped into our structured logger.
  app.use(
    morgan('combined', {
      stream: {
        write: (line) => logger.info('http', { line: line.trim() }),
      },
      skip: (req) => req.url.startsWith('/api/_health'),
    })
  );

  // Increase JSON limit for blog content; uploads go through multer separately.
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve uploaded files statically.
  app.use('/api/uploads', express.static(env.UPLOADS_DIR, { fallthrough: true, maxAge: '7d' }));

  // Mount API.
  app.use('/api', apiRouter);

  // 404 + error handling.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = buildApp;
