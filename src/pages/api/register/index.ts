import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ExtendedNextApiRequest, ApiResponse } from '../../../types/api.types';
import { UserService } from '../../../services/user.service';
import { withBasicMiddleware, withMethodValidation, compose } from '../../../middleware';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

async function registerHandler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const userService = new UserService();
  
  try {
    // Validate request body
    const { name, email, password } = registerSchema.parse(req.body);

    // Create new user
    const user = await userService.createUser(name, email, password);

    const response: ApiResponse = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      message: 'User registered successfully'
    };

    res.status(201).json(response);
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
)(registerHandler);
