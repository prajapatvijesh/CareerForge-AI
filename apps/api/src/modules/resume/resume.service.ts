import { ResumeRepository } from './resume.repository';
import { CreateResumeInput, UpdateResumeInput } from './resume.schema';
import { AppError } from '../../utils/AppError';
import mongoose from 'mongoose';
import { PdfExportService } from './export/pdf-export.service';
import { IResume } from './resume.model';
import { ProfileRepository } from '../profile/profile.repository';

export class ResumeService {
  private repository = new ResumeRepository();
  private pdfExportService = new PdfExportService(); // Can be injected for DI
  private profileRepository = new ProfileRepository();

  public async getResumes(userId: string) {
    return this.repository.findAllByUserId(userId);
  }

  public async getResumeById(id: string, userId: string) {
    const resume = await this.repository.findById(id, userId);
    if (!resume) throw new AppError('Resume not found', 404);
    return resume;
  }

  public async createResume(userId: string, data: CreateResumeInput) {
    const profile = await this.profileRepository.findByUserId(userId);
    const sections: any[] = [];
    
    if (data.useProfileData && profile) {
      let order = 0;
      
      if (profile.bio || profile.headline) {
        sections.push({ type: 'SUMMARY', isVisible: true, order: order++, data: { headline: profile.headline, summary: profile.bio } });
      }
      if (profile.experience && profile.experience.length > 0) {
        sections.push({ type: 'EXPERIENCE', isVisible: true, order: order++, data: { items: profile.experience } });
      }
      if (profile.education && profile.education.length > 0) {
        sections.push({ type: 'EDUCATION', isVisible: true, order: order++, data: { items: profile.education } });
      }
      if (profile.skills && profile.skills.length > 0) {
        sections.push({ type: 'SKILLS', isVisible: true, order: order++, data: { items: profile.skills } });
      }
      if (profile.projects && profile.projects.length > 0) {
        sections.push({ type: 'PROJECTS', isVisible: true, order: order++, data: { items: profile.projects } });
      }
    }

    return this.repository.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: data.title,
      templateId: data.templateId || 'modern',
      sections,
    });
  }

  public async updateResume(id: string, userId: string, data: UpdateResumeInput) {
    const resume = await this.repository.update(id, userId, data as unknown as Partial<IResume>);
    if (!resume) throw new AppError('Resume not found', 404);
    return resume;
  }

  public async duplicateResume(id: string, userId: string) {
    const existing = await this.getResumeById(id, userId);
    
    // Deep clone the existing resume, ignoring _id and timestamps
    const clonedData = {
      ...existing.toObject(),
      _id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      title: `${existing.title} (Copy)`,
      version: 1, // Reset version for the new copy
    };

    return this.repository.create(clonedData);
  }

  public async deleteResume(id: string, userId: string) {
    const resume = await this.repository.softDelete(id, userId);
    if (!resume) throw new AppError('Resume not found', 404);
    return resume;
  }

  public async createSnapshot(id: string, userId: string) {
    const resume = await this.getResumeById(id, userId);
    
    // Increment version
    const newVersion = resume.version + 1;
    await this.repository.update(id, userId, { version: newVersion });
    
    // Save snapshot
    return this.repository.createVersionSnapshot(id, newVersion, resume.toObject());
  }

  public async exportPdf(id: string, userId: string, htmlContent: string) {
    const resume = await this.getResumeById(id, userId);
    // Call the strategy pattern implementation
    return this.pdfExportService.export(resume, htmlContent);
  }
}
