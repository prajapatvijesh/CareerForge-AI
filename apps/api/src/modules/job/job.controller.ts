import { Request, Response, NextFunction } from 'express';
import { JobService } from './job.service';
import { GetJobsQuery } from './job.schema';

export class JobController {
  private service = new JobService();

  public getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.service.getJobs(userId, req.query as unknown as GetJobsQuery);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  public getJobStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const stats = await this.service.getStats(userId);
      res.status(200).json({ status: 'success', data: stats });
    } catch (error) {
      next(error);
    }
  };

  public getJobById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const job = await this.service.getJobById(req.params.id, userId);
      res.status(200).json({ status: 'success', data: job });
    } catch (error) {
      next(error);
    }
  };

  public createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const job = await this.service.createJob(userId, req.body);
      res.status(201).json({ status: 'success', data: job });
    } catch (error) {
      next(error);
    }
  };

  public updateJob = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const job = await this.service.updateJob(req.params.id, userId, req.body);
      res.status(200).json({ status: 'success', data: job });
    } catch (error) {
      next(error);
    }
  };

  public deleteJob = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      await this.service.deleteJob(req.params.id, userId);
      // Using 204 No Content for deletion
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
