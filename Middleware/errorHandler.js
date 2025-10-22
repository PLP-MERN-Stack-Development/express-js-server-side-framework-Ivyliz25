// middleware/errorHandler.js
const { AppError } = require('../Utils/errors');

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  // Log unexpected errors
  if (!(err instanceof AppError)) {
    console.error('Unexpected error:', err);
  }

  res.status(status).json({
    error: {
      message,
      details
    }
  });
}

module.exports = { errorHandler };
