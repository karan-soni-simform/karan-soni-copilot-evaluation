import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponseBody, PaginationMeta } from '../types';

/**
 * Utility class for consistent API responses
 */
export class ApiResponse {
  /**
   * Send a success response
   */
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = StatusCodes.OK,
    meta?: PaginationMeta
  ): Response {
    const response: ApiResponseBody<T> = {
      success: true,
      message,
      data,
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return this.success(res, data, message, StatusCodes.CREATED);
  }

  /**
   * Send a no content response (204)
   */
  static noContent(res: Response): Response {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    statusCode: number,
    message: string,
    code = 'ERROR',
    details?: unknown
  ): Response {
    const response: ApiResponseBody = {
      success: false,
      message,
      error: {
        code,
        details,
      },
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send a paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    meta: PaginationMeta,
    message = 'Success'
  ): Response {
    return this.success(res, data, message, StatusCodes.OK, meta);
  }
}
