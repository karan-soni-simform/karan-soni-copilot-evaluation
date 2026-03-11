import { z } from 'zod';

/**
 * Task status enum values
 */
export const taskStatusValues = ['pending', 'in-progress', 'completed'] as const;

/**
 * Task priority enum values
 */
export const taskPriorityValues = ['low', 'medium', 'high'] as const;

/**
 * Zod schema for task status
 */
export const taskStatusSchema = z.enum(taskStatusValues);

/**
 * Zod schema for task priority
 */
export const taskPrioritySchema = z.enum(taskPriorityValues);

/**
 * Helper to check if date is within 7 days from now
 */
const isWithinSevenDays = (date: Date): boolean => {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return date <= sevenDaysFromNow;
};

/**
 * Schema for creating a new task
 */
export const createTaskSchema = z
  .object({
    title: z
      .string({ error: 'Title is required and must be a string' })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters')
      .trim(),
    description: z
      .string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .trim()
      .optional(),
    status: taskStatusSchema.default('pending'),
    priority: taskPrioritySchema.default('medium'),
    dueDate: z
      .string()
      .datetime('Invalid date format. Use ISO 8601 format')
      .transform((val) => new Date(val))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.priority === 'high') {
        if (!data.dueDate) return false;
        return isWithinSevenDays(data.dueDate);
      }
      return true;
    },
    {
      message: 'High priority tasks must have a due date within 7 days',
      path: ['dueDate'],
    }
  );

/**
 * Schema for full update (PUT)
 */
export const updateTaskSchema = z
  .object({
    title: z
      .string({ error: 'Title is required and must be a string' })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters')
      .trim(),
    description: z
      .string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .trim()
      .optional(),
    status: taskStatusSchema,
    priority: taskPrioritySchema,
    dueDate: z
      .string()
      .datetime('Invalid date format. Use ISO 8601 format')
      .transform((val) => new Date(val))
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.priority === 'high') {
        if (!data.dueDate) return false;
        return isWithinSevenDays(data.dueDate);
      }
      return true;
    },
    {
      message: 'High priority tasks must have a due date within 7 days',
      path: ['dueDate'],
    }
  );

/**
 * Schema for UUID parameter validation
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid task ID format'),
});

/**
 * Schema for query parameters (filtering, pagination, sorting)
 */
export const taskQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'Page must be a positive integer')
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  sortBy: z.enum(['dueDate']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Inferred types from schemas
 */
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
