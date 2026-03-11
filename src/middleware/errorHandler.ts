import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError, logger } from '../utils';
import { config } from '../config';

/**
 * Global error handler middleware
 * Handles all errors and sends consistent error responses
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle ApiError (our custom error)
  if (err instanceof ApiError) {
    const errorResponse: {
      success: boolean;
      message: string;
      error: {
        code: string;
        details?: unknown;
      };
    } = {
      success: false,
      message: err.message,
      error: {
        code: err.code,
      },
    };

    if (err.details) {
      errorResponse.error.details = err.details;
    }

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle SyntaxError (e.g., invalid JSON in request body)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid JSON in request body',
      error: {
        code: 'INVALID_JSON',
      },
    });
    return;
  }

  // Handle unknown errors
  const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  const message = config.nodeEnv === 'production'
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * 404 Not Found handler for unknown routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    error: {
      code: 'ROUTE_NOT_FOUND',
    },
  });
};
