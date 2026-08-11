import { Request, Response, NextFunction } from 'express';
import { MockInterviewService } from './mock-interview.service';
import { StartInterviewInput, AnswerSubmissionInput } from './mock-interview.schema';

export class MockInterviewController {
  private service = new MockInterviewService();

  public startInterview = async (req: Request<{}, {}, StartInterviewInput>, res: Response, next: NextFunction) => {
    try {
      const interview = await this.service.startInterview(req.user!.id, req.body);
      res.status(201).json({ status: 'success', data: interview });
    } catch (error) {
      next(error);
    }
  };

  public submitAnswer = async (req: Request<{ id: string }, {}, AnswerSubmissionInput>, res: Response, next: NextFunction) => {
    try {
      await this.service.submitAnswer(req.user!.id, req.params.id, req.body);
      res.status(200).json({ status: 'success', message: 'Answer saved' });
    } catch (error) {
      next(error);
    }
  };

  public finishInterview = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const interview = await this.service.finishInterview(req.user!.id, req.params.id);
      res.status(202).json({ status: 'success', message: 'Evaluation started', data: interview });
    } catch (error) {
      next(error);
    }
  };

  public getInterview = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const interview = await this.service.getInterview(req.user!.id, req.params.id);
      res.status(200).json({ status: 'success', data: interview });
    } catch (error) {
      next(error);
    }
  };

  public getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await this.service.getHistory(req.user!.id);
      res.status(200).json({ status: 'success', data: history });
    } catch (error) {
      next(error);
    }
  };
}
