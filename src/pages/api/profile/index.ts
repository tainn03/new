import { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedNextApiRequest, ApiResponse } from '../../../types/api.types';
import { UserService } from '../../../services/user.service';
import { withAuthenticatedMiddleware, withMethodValidation, compose } from '../../../middleware';

async function profileHandler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const userService = new UserService();
  
  try {
    const user = await userService.getUserById(req.user!.id);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
}

export default compose(
  withMethodValidation(['GET']),
  withAuthenticatedMiddleware
)(profileHandler);
