import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

export class UserController {
  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileData = await userService.getProfile(req.user!._id);
      
      res.status(200).json({
        success: true,
        ...profileData,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedUser = await userService.updateProfile(req.user!._id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
