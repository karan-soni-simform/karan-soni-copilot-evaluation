import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';
import { TaskFilterQuery, PaginatedResponse, PaginationMeta } from '../types';
import { config } from '../config';

/**
 * In-memory storage for tasks
 */
const tasks: Map<string, Task> = new Map();

/**
 * Task Repository - Data Access Layer
 * Handles all in-memory data operations for tasks
 */
export class TaskRepository {
  /**
   * Find all tasks with optional filtering, sorting, and pagination
   */
  findAll(query: TaskFilterQuery): PaginatedResponse<Task> {
    let taskList = Array.from(tasks.values());

    // Apply status filter
    if (query.status) {
      taskList = taskList.filter((task) => task.status === query.status);
    }

    // Apply priority filter
    if (query.priority) {
      taskList = taskList.filter((task) => task.priority === query.priority);
    }

    // Apply sorting by dueDate (default: ascending - earliest due first)
    const sortOrder = query.sortOrder || 'asc';

    if (query.sortBy === 'dueDate') {
      taskList.sort((a, b) => {
        // Tasks without dueDate go to the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        const comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    const page = query.page || config.pagination.defaultPage;
    const limit = Math.min(query.limit || config.pagination.defaultLimit, config.pagination.maxLimit);
    const totalItems = taskList.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTasks = taskList.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return {
      data: paginatedTasks,
      meta,
    };
  }

  /**
   * Find a task by ID
   */
  findById(id: string): Task | undefined {
    return tasks.get(id);
  }

  /**
   * Create a new task
   */
  create(dto: CreateTaskDTO): Task {
    const now = new Date();
    const task: Task = {
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      status: dto.status || 'pending',
      priority: dto.priority || 'medium',
      dueDate: dto.dueDate,
      createdAt: now,
      updatedAt: now,
    };

    tasks.set(task.id, task);
    return task;
  }

  /**
   * Update a task (full update)
   */
  update(id: string, dto: UpdateTaskDTO): Task | undefined {
    const existingTask = tasks.get(id);
    if (!existingTask) {
      return undefined;
    }

    const updatedTask: Task = {
      ...existingTask,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ?? undefined,
      updatedAt: new Date(),
    };

    tasks.set(id, updatedTask);
    return updatedTask;
  }

  /**
   * Delete a task
   */
  delete(id: string): boolean {
    return tasks.delete(id);
  }

  /**
   * Check if a task exists
   */
  exists(id: string): boolean {
    return tasks.has(id);
  }

  /**
   * Get total count of tasks
   */
  count(): number {
    return tasks.size;
  }

  /**
   * Clear all tasks (useful for testing)
   */
  clear(): void {
    tasks.clear();
  }
}

// Export singleton instance
export const taskRepository = new TaskRepository();
