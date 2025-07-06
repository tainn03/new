import { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../types/api.types';
import { withLogging } from './logging.middleware';
import { withAuth } from './auth.middleware';
import { withErrorHandling } from './error.middleware';

type MiddlewareFunction = (
  handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void> | void
) => (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void> | void;

export function compose(...middlewares: MiddlewareFunction[]) {
  return (handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void> | void) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler
    );
  };
}

// Pre-configured middleware combinations
export const withBasicMiddleware = compose(withErrorHandling, withLogging);
export const withAuthenticatedMiddleware = compose(withErrorHandling, withAuth, withLogging);

// Method validation middleware
export function withMethodValidation(allowedMethods: string[]) {
  return (handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void> | void) => {
    return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
      if (!allowedMethods.includes(req.method!)) {
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
      }
      await handler(req, res);
    };
  };
}
