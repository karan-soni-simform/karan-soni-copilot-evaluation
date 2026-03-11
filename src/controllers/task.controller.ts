import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { ApiResponse, asyncHandler } from '../utils';
import { TaskFilterQuery } from '../types';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator';

/**
 * Task Controller - HTTP Request Handlers
 * Handles HTTP requests and delegates to service layer
 */

/**
 * GET /api/v1/tasks
 * Get all tasks with optional filtering, sorting, and pagination
 */
export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const query: TaskFilterQuery = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    status: req.query.status as TaskFilterQuery['status'],
    priority: req.query.priority as TaskFilterQuery['priority'],
    sortBy: req.query.sortBy as TaskFilterQuery['sortBy'],
    sortOrder: req.query.sortOrder as TaskFilterQuery['sortOrder'],
  };

  const result = taskService.getAllTasks(query);
  return ApiResponse.paginated(res, result.data, result.meta, 'Tasks retrieved successfully');
});

/**
 * GET /api/v1/tasks/:id
 * Get a task by ID
 */
export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = taskService.getTaskById(id);
  return ApiResponse.success(res, task, 'Task retrieved successfully');
});

/**
 * POST /api/v1/tasks
 * Create a new task
 */
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const taskData: CreateTaskInput = req.body;
  const task = taskService.createTask(taskData);
  return ApiResponse.created(res, task, 'Task created successfully');
});

/**
 * PUT /api/v1/tasks/:id
 * Full update of a task
 */
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskData: UpdateTaskInput = req.body;
  const task = taskService.updateTask(id, taskData);
  return ApiResponse.success(res, task, 'Task updated successfully');
});

/**
 * DELETE /api/v1/tasks/:id
 * Delete a task
 */
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  taskService.deleteTask(id);
  return ApiResponse.noContent(res);
});
