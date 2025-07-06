import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ExtendedNextApiRequest, ApiResponse, LoginResponse } from '../../../types/api.types';
import { UserService } from '../../../services/user.service';
import { authService } from '../../../services/auth.service';
import { withBasicMiddleware, withMethodValidation, compose } from '../../../middleware';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

async function loginHandler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const userService = new UserService();
  
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // Validate user credentials
    const user = await userService.validateUser(email, password);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      return res.status(401).json(response);
    }

    // Generate JWT token
    const token = authService.generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      message: 'Login successful'
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: error.errors.map(e => e.message).join(', ')
      };
      return res.status(400).json(response);
    }
    throw error;
  }
}

export default compose(
  withMethodValidation(['POST']),
  withBasicMiddleware
)(loginHandler);