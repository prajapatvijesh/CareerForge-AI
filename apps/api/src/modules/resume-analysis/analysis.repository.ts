import { ResumeAnalysis, IResumeAnalysis } from './analysis.model';
import mongoose from 'mongoose';

export class AnalysisRepository {
  public async create(userId: string, resumeId: string, provider: string): Promise<IResumeAnalysis> {
    const analysis = new ResumeAnalysis({
      userId: new mongoose.Types.ObjectId(userId),
      resumeId: new mongoose.Types.ObjectId(resumeId),
      providerUsed: provider,
      status: 'PENDING'
    });
    return analysis.save();
  }

  public async updateStatus(id: string, status: IResumeAnalysis['status'], data?: Partial<IResumeAnalysis>): Promise<IResumeAnalysis | null> {
    return ResumeAnalysis.findByIdAndUpdate(
      id,
      { $set: { status, ...data } },
      { new: true }
    );
  }

  public async getLatestByResumeId(resumeId: string, userId: string): Promise<IResumeAnalysis | null> {
    return ResumeAnalysis.findOne({
      resumeId: new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ createdAt: -1 });
  }

  public async getHistoryByResumeId(resumeId: string, userId: string): Promise<IResumeAnalysis[]> {
    return ResumeAnalysis.find({
      resumeId: new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ createdAt: -1 });
  }
}
