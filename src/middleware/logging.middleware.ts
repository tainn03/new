import { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedNextApiRequest, LogEntry } from '../types/api.types';
import { loggerService } from '../services/logger.service';

export function withLogging(
  handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    // Generate unique request ID
    req.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    req.startTime = Date.now();

    // Override res.end to capture response details
    const originalEnd = res.end;
    let responseLogged = false;

    res.end = function(chunk?: any) {
      if (!responseLogged) {
        responseLogged = true;
        const endTime = Date.now();
        const responseTime = req.startTime ? endTime - req.startTime : 0;

        const logEntry: LogEntry = {
          requestId: req.requestId!,
          method: req.method!,
          url: req.url!,
          statusCode: res.statusCode,
          responseTime,
          userAgent: req.headers['user-agent'],
          ip: req.headers['x-forwarded-for'] as string || req.connection?.remoteAddress,
          userId: req.user?.id,
          timestamp: new Date()
        };

        loggerService.logRequest(logEntry);
      }
      
      return originalEnd.call(this, chunk);
    };

    try {
      await handler(req, res);
    } catch (error) {
      loggerService.logError(error as Error, {
        requestId: req.requestId,
        method: req.method,
        url: req.url
      });
      throw error;
    }
  };
}
