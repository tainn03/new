import { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedNextApiRequest, ApiResponse } from '../types/api.types';
import { authService } from '../services/auth.service';

export function withAuth(
  handler: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      const token = authService.extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        const response: ApiResponse = {
          success: false,
          error: 'Authorization token is required'
        };
        return res.status(401).json(response);
      }

      const decoded = authService.verifyToken(token);
      
      if (!decoded) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid or expired token'
        };
        return res.status(401).json(response);
      }

      req.user = decoded;
      await handler(req, res);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Authentication failed'
      };
      return res.status(401).json(response);
    }
  };
}
