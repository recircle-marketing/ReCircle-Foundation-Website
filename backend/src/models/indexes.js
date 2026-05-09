/** Index management for collections. Idempotent. */
async function ensureIndexes(db) {
  await db.collection('blogs').createIndex({ slug: 1 }, { unique: true });
  await db.collection('blogs').createIndex({ date: -1 });
  await db.collection('blogs').createIndex({ published: 1 });
  await db.collection('blogs').createIndex({ category: 1 });
  await db.collection('blogs').createIndex({ tags: 1 });

  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ id: 1 }, { unique: true });
}

module.exports = { ensureIndexes };
