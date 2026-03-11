import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils';

/**
 * Request logger middleware
 * Logs request method, URL, and execution time for each API request
 * Format: [METHOD] /endpoint - Execution time: Xms
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log after response is finished
  res.on('finish', () => {
    const executionTime = Date.now() - startTime;
    logger.info(`[${req.method}] ${req.originalUrl} - Execution time: ${executionTime}ms`);
  });

  next();
};
