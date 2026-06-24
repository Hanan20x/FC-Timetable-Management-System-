/**
 * Centralized error handler. Mounted last in server.js so any error passed
 * via next(err) or thrown in an async route (caught by asyncHandler) lands here.
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  // express.json() throws a SyntaxError with a `body` property when the
  // request body isn't valid JSON — give a clean message instead of
  // leaking the raw parser error text.
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }

  // Sequelize validation errors (e.g. unique constraint, allowNull violations)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Validation failed.',
      details: err.errors?.map((e) => e.message) || [err.message],
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid reference — the related record does not exist.',
    });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error.' : err.message,
  });
}

/**
 * Wraps an async route handler so thrown errors / rejected promises are
 * forwarded to next() instead of crashing the process unhandled.
 */
function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

module.exports = { errorHandler, asyncHandler };
