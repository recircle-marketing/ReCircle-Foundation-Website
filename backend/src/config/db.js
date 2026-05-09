const { MongoClient } = require('mongodb');
const env = require('./env');
const logger = require('./logger');

let client;
let db;

async function connectDB() {
  client = new MongoClient(env.MONGO_URL, { ignoreUndefined: true });
  await client.connect();
  db = client.db(env.DB_NAME);
  logger.info('MongoDB connected', { db: env.DB_NAME });
  return db;
}

function getDB() {
  if (!db) throw new Error('Database not initialised. Call connectDB() first.');
  return db;
}

async function closeDB() {
  if (client) await client.close();
}

module.exports = { connectDB, getDB, closeDB };
