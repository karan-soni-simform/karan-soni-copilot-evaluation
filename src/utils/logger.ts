import winston from 'winston';
import { config } from '../config';

/**
 * Simple log format: just the message
 * Format: [METHOD] /endpoint - Execution time: Xms
 */
const simpleFormat = winston.format.printf(({ message }) => {
  return `${message}`;
});

/**
 * Winston logger instance
 */
export const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: simpleFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: simpleFormat,
    }),
  ],
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Add file transports in production
if (config.nodeEnv === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
      ),
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
      ),
    })
  );
}

export default logger;
