const ErrorResponse = require('@/utils/ErrorResponse');

module.exports = (err, req, res, next) => {
  let error = { ...err };
  let message = '';

  // TODO: understand why it does not inherit the message property
  error.message = err.message;

  // Log to console for dev
  console.log(error);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 422);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
