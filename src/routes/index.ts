import { Router } from 'express';
import healthRoutes from './health.routes';
import taskRoutes from './task.routes';

const router = Router();

// Health check routes
router.use('/', healthRoutes);

// API v1 routes
router.use('/api/v1/tasks', taskRoutes);

export default router;
