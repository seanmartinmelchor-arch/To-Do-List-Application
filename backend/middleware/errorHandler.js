// Handles requests to unknown URLs.
exports.notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

// Central error handler: every error ends up here and is sent as JSON.
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  // Mongoose validation errors (e.g. missing title) -> 400 Bad Request
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  // Malformed JSON body -> 400
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON in request body';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ message });
};
