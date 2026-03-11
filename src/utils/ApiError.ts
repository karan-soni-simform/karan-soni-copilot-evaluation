import { StatusCodes, getReasonPhrase } from 'http-status-codes';

/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    details?: unknown,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || this.generateErrorCode(statusCode);
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  private generateErrorCode(statusCode: number): string {
    return getReasonPhrase(statusCode).toUpperCase().replace(/\s+/g, '_');
  }

  // Factory methods for common errors
  static badRequest(message = 'Bad Request', details?: unknown): ApiError {
    return new ApiError(StatusCodes.BAD_REQUEST, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized', details?: unknown): ApiError {
    return new ApiError(StatusCodes.UNAUTHORIZED, message, 'UNAUTHORIZED', details);
  }

  static forbidden(message = 'Forbidden', details?: unknown): ApiError {
    return new ApiError(StatusCodes.FORBIDDEN, message, 'FORBIDDEN', details);
  }

  static notFound(message = 'Resource not found', details?: unknown): ApiError {
    return new ApiError(StatusCodes.NOT_FOUND, message, 'NOT_FOUND', details);
  }

  static conflict(message = 'Conflict', details?: unknown): ApiError {
    return new ApiError(StatusCodes.CONFLICT, message, 'CONFLICT', details);
  }

  static unprocessableEntity(message = 'Unprocessable Entity', details?: unknown): ApiError {
    return new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, message, 'UNPROCESSABLE_ENTITY', details);
  }

  static internal(message = 'Internal Server Error', details?: unknown): ApiError {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message, 'INTERNAL_SERVER_ERROR', details, false);
  }

  static validationError(message = 'Validation Error', details?: unknown): ApiError {
    return new ApiError(StatusCodes.BAD_REQUEST, message, 'VALIDATION_ERROR', details);
  }
}
