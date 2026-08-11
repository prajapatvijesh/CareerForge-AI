import { IResume } from '../resume.model';

export interface IExportStrategy {
  export(resume: IResume, htmlContent: string): Promise<Buffer>;
}
