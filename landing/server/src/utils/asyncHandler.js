/**
 * Wrapper for async route handlers to catch errors
 * @param {Function} fn - Async route handler
 * @returns {Function} - Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler

