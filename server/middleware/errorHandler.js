import { logger } from '../utils/logger.js';

// Centralized Express error handler
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const requestId = req.id || 'none';

  // Log error with Winston
  logger.error(err.message || 'Server Exception', {
    requestId,
    url: req.originalUrl,
    method: req.method,
    status,
    stack: err.stack
  });

  // Prepare standard JSON error payload
  const isProduction = process.env.NODE_ENV === 'production';
  const responsePayload = {
    error: err.message || 'Internal Server Error',
    requestId
  };

  // Only expose details if not in production
  if (!isProduction && err.stack) {
    responsePayload.details = err.stack;
  }

  res.status(status).json(responsePayload);
};

export default errorHandler;
