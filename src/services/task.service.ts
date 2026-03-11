import { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';
import { taskRepository } from '../repositories/task.repository';
import { TaskFilterQuery, PaginatedResponse } from '../types';
import { ApiError } from '../utils';

/**
 * Task Service - Business Logic Layer
 * Handles all business logic for task operations
 */
export class TaskService {
  /**
   * Get all tasks with filtering, sorting, and pagination
   */
  getAllTasks(query: TaskFilterQuery): PaginatedResponse<Task> {
    return taskRepository.findAll(query);
  }

  /**
   * Get a task by ID
   * @throws ApiError if task not found
   */
  getTaskById(id: string): Task {
    const task = taskRepository.findById(id);
    if (!task) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }
    return task;
  }

  /**
   * Create a new task
   */
  createTask(dto: CreateTaskDTO): Task {
    return taskRepository.create(dto);
  }

  /**
   * Update a task (full update)
   * @throws ApiError if task not found
   */
  updateTask(id: string, dto: UpdateTaskDTO): Task {
    const task = taskRepository.update(id, dto);
    if (!task) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }
    return task;
  }

  /**
   * Delete a task
   * @throws ApiError if task not found
   */
  deleteTask(id: string): void {
    if (!taskRepository.exists(id)) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }
    taskRepository.delete(id);
  }
}

// Export singleton instance
export const taskService = new TaskService();
