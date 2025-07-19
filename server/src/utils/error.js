// error.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFound(req, res, next) {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  // Log error details for debugging
  console.error('--- ERROR HANDLER ---');
  console.error('Status:', statusCode);
  console.error('Message:', err.message);
  if (err.stack) console.error('Stack:', err.stack);
  if (err.cause) console.error('Cause:', err.cause);
  if (err.errors) console.error('Errors:', err.errors);
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}
