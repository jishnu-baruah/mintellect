import logger from "../utils/logger.js"

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500

  // Log the error
  logger.error(`Error: ${err.message}`)
  if (err.stack) {
    logger.error(`Stack: ${err.stack}`)
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  })
}

export default errorHandler

