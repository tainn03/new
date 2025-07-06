import { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedNextApiRequest, ApiResponse } from '../../../types/api.types';
import { UserService } from '../../../services/user.service';
import { withAuthenticatedMiddleware, withMethodValidation, compose } from '../../../middleware';

async function usersHandler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const userService = new UserService();
  
  switch (req.method) {
    case 'GET':
      const users = await userService.getAllUsers();
      const response: ApiResponse = {
        success: true,
        data: users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name
        }))
      };
      res.status(200).json(response);
      break;

    default:
      const errorResponse: ApiResponse = {
        success: false,
        error: `Method ${req.method} not allowed`
      };
      res.status(405).json(errorResponse);
  }
}

export default compose(
  withMethodValidation(['GET']),
  withAuthenticatedMiddleware
)(usersHandler);
