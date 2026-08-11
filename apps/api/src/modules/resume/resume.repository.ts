import { Resume, IResume } from './resume.model';
import { ResumeVersion, IResumeVersion } from './resume-version.model';

export class ResumeRepository {
  public async findAllByUserId(userId: string): Promise<IResume[]> {
    return Resume.find({ userId, status: 'ACTIVE' })
      .select('-sections.data') // Omit heavy section data for listing
      .sort({ updatedAt: -1 })
      .exec();
  }

  public async findById(id: string, userId: string): Promise<IResume | null> {
    return Resume.findOne({ _id: id, userId, status: 'ACTIVE' }).exec();
  }

  public async create(data: Partial<IResume>): Promise<IResume> {
    const resume = new Resume(data);
    return resume.save();
  }

  public async update(id: string, userId: string, updateData: Partial<IResume>): Promise<IResume | null> {
    return Resume.findOneAndUpdate(
      { _id: id, userId, status: 'ACTIVE' },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  public async softDelete(id: string, userId: string): Promise<IResume | null> {
    return Resume.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status: 'ARCHIVED' } },
      { new: true }
    ).exec();
  }

  public async createVersionSnapshot(resumeId: string, versionNumber: number, snapshot: any): Promise<IResumeVersion> {
    const version = new ResumeVersion({
      resumeId,
      versionNumber,
      snapshot,
    });
    return version.save();
  }
}
