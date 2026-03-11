import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { validateRequest } from '../middleware';
import {
  createTaskSchema,
  updateTaskSchema,
  uuidParamSchema,
  taskQuerySchema,
} from '../validators/task.validator';

const router = Router();

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks with filtering, sorting, and pagination
 * @access  Public
 * @query   page, limit, status, priority, sortBy, sortOrder
 */
router.get('/', validateRequest(taskQuerySchema, 'query'), getAllTasks);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get a task by ID
 * @access  Public
 * @param   id - Task UUID
 */
router.get('/:id', validateRequest(uuidParamSchema, 'params'), getTaskById);

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Public
 * @body    { title, description?, status?, priority?, dueDate? }
 */
router.post('/', validateRequest(createTaskSchema, 'body'), createTask);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Full update of a task
 * @access  Public
 * @param   id - Task UUID
 * @body    { title, description?, status, priority, dueDate? }
 */
router.put(
  '/:id',
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(updateTaskSchema, 'body'),
  updateTask
);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete a task
 * @access  Public
 * @param   id - Task UUID
 */
router.delete('/:id', validateRequest(uuidParamSchema, 'params'), deleteTask);

export default router;
