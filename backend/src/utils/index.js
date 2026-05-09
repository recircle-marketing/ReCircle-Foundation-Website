/** Tiny utilities. */
const slugifyLib = require('slugify');

function toSlug(text) {
  return slugifyLib(String(text || ''), { lower: true, strict: true, trim: true });
}

/** Strip MongoDB internal fields before returning. */
function stripDoc(doc) {
  if (!doc) return doc;
  const { _id, password_hash, ...rest } = doc;
  return rest;
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

module.exports = { toSlug, stripDoc, asyncHandler, HttpError };
