import { CareerAssistantConversation } from './career-assistant.model';
import { Profile } from '../profile/profile.model';
import { ResumeAnalysis } from '../resume-analysis/analysis.model';
import { JobApplication } from '../job/job.model';
import { MockInterview } from '../mock-interview/mock-interview.model';
import mongoose from 'mongoose';
import { ICareerContextSnapshot, IAssistantMessage } from './career-assistant.types';

export class CareerAssistantRepository {
  async getConversationById(id: string, userId: string) {
    return CareerAssistantConversation.findOne({ _id: id, userId });
  }

  async getConversationsByUserId(userId: string, skip: number, limit: number) {
    return CareerAssistantConversation.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-messages -contextSnapshot')
      .lean();
  }

  async countConversationsByUserId(userId: string) {
    return CareerAssistantConversation.countDocuments({ userId });
  }

  async createConversation(userId: string, initialMessage: IAssistantMessage, contextSnapshot: ICareerContextSnapshot) {
    const title = initialMessage.content.slice(0, 40) + (initialMessage.content.length > 40 ? '...' : '');
    const conversation = new CareerAssistantConversation({
      userId,
      title,
      messages: [initialMessage],
      contextSnapshot
    });
    return conversation.save();
  }

  async appendMessage(conversationId: string, message: IAssistantMessage) {
    return CareerAssistantConversation.findByIdAndUpdate(
      conversationId,
      { $push: { messages: message } },
      { new: true }
    );
  }

  async deleteConversation(id: string, userId: string) {
    return CareerAssistantConversation.findOneAndDelete({ _id: id, userId });
  }

  // Aggregation Methods
  async getUserProfile(userId: string) {
    return Profile.findOne({ userId }).select('headline skills experience education').lean();
  }

  async getLatestResumeAnalysis(userId: string) {
    return ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 }).select('atsScore weaknesses suggestions').lean();
  }

  async getJobStats(userId: string) {
    const stats = await JobApplication.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    let total = 0;
    const breakdown: Record<string, number> = {};
    stats.forEach(s => {
      total += s.count;
      breakdown[s._id] = s.count;
    });

    return { total, breakdown };
  }

  async getLatestInterviewScore(userId: string) {
    const interview = await MockInterview.findOne({ userId }).sort({ createdAt: -1 }).select('overallResult').lean();
    return interview;
  }
}
