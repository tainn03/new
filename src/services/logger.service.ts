import winston from 'winston';
import { LogEntry } from '../types/api.types';

class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'api' },
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  }

  public logRequest(logEntry: LogEntry): void {
    this.logger.info('API Request', logEntry);
  }

  public logError(error: Error, context?: any): void {
    this.logger.error('API Error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  public logInfo(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public logWarning(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public logDebug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}

export const loggerService = new LoggerService();
