import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from './analysis.service';
import { TriggerAnalysisInput } from './analysis.schema';

export class AnalysisController {
  private service = new AnalysisService();

  public triggerAnalysis = async (req: Request<{}, {}, TriggerAnalysisInput>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { resumeId, jobDescription, provider } = req.body;
      const analysis = await this.service.triggerAnalysis(userId, resumeId, provider, jobDescription);
      
      // Return 202 Accepted because processing happens asynchronously
      res.status(202).json({ status: 'success', data: analysis });
    } catch (error) {
      next(error);
    }
  };

  public getLatestAnalysis = async (req: Request<{ resumeId: string }>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const analysis = await this.service.getLatestAnalysis(userId, req.params.resumeId);
      res.status(200).json({ status: 'success', data: analysis });
    } catch (error) {
      next(error);
    }
  };

  public getAnalysisHistory = async (req: Request<{ resumeId: string }>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const history = await this.service.getAnalysisHistory(userId, req.params.resumeId);
      res.status(200).json({ status: 'success', data: history });
    } catch (error) {
      next(error);
    }
  };
}
