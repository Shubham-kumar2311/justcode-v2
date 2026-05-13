import { Request, Response, NextFunction } from 'express';
import { executionService } from './execution.service';

export class ExecutionController {
  public runCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code, language, problemId } = req.body;
      
      const result = await executionService.runCode(code, language, problemId);
      
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const executionController = new ExecutionController();
