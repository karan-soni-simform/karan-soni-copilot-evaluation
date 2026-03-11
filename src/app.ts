import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFoundHandler, requestLogger } from './middleware';
import { config } from './config';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(config.cors));

// Request logger middleware
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Routes
app.use('/', routes);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

export default app;
