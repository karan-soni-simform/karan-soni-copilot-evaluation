import { Request } from 'express';

/**
 * Task status enum
 */
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

/**
 * Task priority enum
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/**
 * Task filter query parameters
 */
export interface TaskFilterQuery extends PaginationQuery {
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: 'dueDate';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Standard API response format
 */
export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  error?: {
    code: string;
    details?: unknown;
  };
}

/**
 * Extended Request with validated body
 */
export interface ValidatedRequest<T = unknown> extends Request {
  validatedBody?: T;
}

/**
 * ID parameter in request
 */
export interface IdParam {
  id: string;
}
