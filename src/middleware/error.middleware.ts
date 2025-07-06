import { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedNextApiRequest, ApiResponse } from '../types/api.types';
import { loggerService } from '../services/logger.service';

export function withErrorHandling(
  handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      
      loggerService.logError(error as Error, {
        requestId: req.requestId,
        method: req.method,
        url: req.url,
        userId: req.user?.id
      });

      const response: ApiResponse = {
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : errorMessage
      };

      // Return appropriate status codes based on error type
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.message.includes('Validation')) statusCode = 400;
        if (error.message.includes('Not found')) statusCode = 404;
        if (error.message.includes('Unauthorized')) statusCode = 401;
        if (error.message.includes('Forbidden')) statusCode = 403;
      }

      return res.status(statusCode).json(response);
    }
  };
}
