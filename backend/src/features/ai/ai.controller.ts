import { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service';

export class AIController {
  public getHint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const suggestion = await aiService.getHint(req.body);
      
      res.status(200).json({
        success: true,
        suggestion: suggestion || 'No suggestion provided',
      });
    } catch (error) {
      next(error);
    }
  };

  public reviewCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const correctedCode = await aiService.reviewCode(req.body);
      
      res.status(200).json({
        success: true,
        correctedCode,
      });
    } catch (error) {
      next(error);
    }
  };

  public analyzeComplexity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const analysis = await aiService.analyzeComplexity(req.body);
      
      res.status(200).json({
        success: true,
        analysis,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const aiController = new AIController();
