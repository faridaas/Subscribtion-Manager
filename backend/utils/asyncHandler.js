/**
 * Async handler to wrap async functions and avoid try-catch blocks
 * @param {function} fn - Async function to be wrapped
 * @returns {function} - Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
