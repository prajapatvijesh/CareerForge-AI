import { Request, Response, NextFunction } from 'express';
import { ResumeService } from './resume.service';
import { AppError } from '../../utils/AppError';

export class ResumeController {
  private service = new ResumeService();

  public getResumes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resumes = await this.service.getResumes(req.user!.id);
      res.status(200).json({ status: 'success', data: { resumes } });
    } catch (error) {
      next(error);
    }
  };

  public getResumeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resume = await this.service.getResumeById(req.params.id, req.user!.id);
      res.status(200).json({ status: 'success', data: { resume } });
    } catch (error) {
      next(error);
    }
  };

  public createResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resume = await this.service.createResume(req.user!.id, req.body);
      res.status(201).json({ status: 'success', data: { resume } });
    } catch (error) {
      next(error);
    }
  };

  // Used for autosaving
  public updateResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resume = await this.service.updateResume(req.params.id, req.user!.id, req.body);
      res.status(200).json({ status: 'success', data: { resume } });
    } catch (error) {
      next(error);
    }
  };

  public duplicateResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resume = await this.service.duplicateResume(req.params.id, req.user!.id);
      res.status(201).json({ status: 'success', data: { resume } });
    } catch (error) {
      next(error);
    }
  };

  public deleteResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteResume(req.params.id, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  public createSnapshot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const version = await this.service.createSnapshot(req.params.id, req.user!.id);
      res.status(201).json({ status: 'success', data: { version } });
    } catch (error) {
      next(error);
    }
  };

  public exportPdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { htmlContent } = req.body;
      if (!htmlContent) {
        return next(new AppError('HTML content is required for PDF export', 400));
      }

      const pdfBuffer = await this.service.exportPdf(req.params.id, req.user!.id, htmlContent);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=resume-${req.params.id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };
}
