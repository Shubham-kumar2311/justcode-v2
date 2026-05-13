import { Request, Response, NextFunction } from 'express';
import { submissionService } from './submission.service';

export class SubmissionController {
  public submitCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await submissionService.submitCode(req.user!._id, req.body);
      
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await submissionService.getHistory(req.user!._id, req.query as any);
      
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const submissionController = new SubmissionController();
