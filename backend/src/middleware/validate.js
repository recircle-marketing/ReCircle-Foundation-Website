/** Generic Zod schema validator middleware. */
const { ZodError } = require('zod');
const { HttpError } = require('../utils');

const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    const data = schema.parse(req[source]);
    req[source] = data;
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      const issues = e.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      const err = new HttpError(400, 'Validation failed', 'VALIDATION_ERROR');
      err.issues = issues;
      return next(err);
    }
    next(e);
  }
};

// Allow attaching extra detail
class ValidationError extends HttpError {
  constructor(message, issues) {
    super(400, message, 'VALIDATION_ERROR');
    this.issues = issues;
  }
}

module.exports = { validate, ValidationError };
