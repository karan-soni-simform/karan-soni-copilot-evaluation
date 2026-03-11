import app from './app';
import { config } from './config';
import { logger } from './utils';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📍 Environment: ${config.nodeEnv}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  logger.info(`📋 Tasks API: http://localhost:${PORT}/api/v1/tasks`);
});
