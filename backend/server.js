/**
 * Entry point. Bootstraps the Express app, connects to MongoDB,
 * ensures indexes + seed users, then starts listening.
 */
require('dotenv').config();

const env = require('./src/config/env');
const logger = require('./src/config/logger');
const { connectDB, getDB } = require('./src/config/db');
const { ensureIndexes } = require('./src/models/indexes');
const { seedDefaultUsers } = require('./src/services/userService');
const buildApp = require('./src/app');

async function main() {
  try {
    await connectDB();
    await ensureIndexes(getDB());
    await seedDefaultUsers();

    const app = buildApp();
    const port = env.PORT;
    app.listen(port, '0.0.0.0', () => {
      logger.info(`ReCircle backend listening on http://0.0.0.0:${port}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

main();

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, async () => {
    logger.info(`Received ${sig}, shutting down...`);
    process.exit(0);
  });
});
