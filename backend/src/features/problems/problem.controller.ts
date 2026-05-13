import { Request, Response, NextFunction } from 'express';
import { problemService } from './problem.service';

export class ProblemController {
  public getProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await problemService.getProblems(req.query as any);
      
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProblemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      
      const result = await problemService.getProblemById(id, userId);
      
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const problemController = new ProblemController();
