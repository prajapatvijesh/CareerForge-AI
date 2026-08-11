import { MockInterview, IMockInterview } from './mock-interview.model';
import mongoose from 'mongoose';
import { IQuestion, IAIUsageMetrics } from './ai/ai-provider.interface';

export class MockInterviewRepository {
  public async create(
    userId: string, 
    config: IMockInterview['config'], 
    questions: IQuestion[], 
    usage: IAIUsageMetrics
  ): Promise<IMockInterview> {
    const interview = new MockInterview({
      userId: new mongoose.Types.ObjectId(userId),
      config,
      questions,
      status: 'IN_PROGRESS',
      startTime: new Date(),
      usageTracking: [usage]
    });
    return interview.save();
  }

  public async findByIdAndUser(id: string, userId: string): Promise<IMockInterview | null> {
    return MockInterview.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });
  }

  public async getHistory(userId: string): Promise<IMockInterview[]> {
    return MockInterview.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      // Don't fetch full questions/answers for history list view
      .select('-questions -answers');
  }

  // Idempotent upsert for an answer
  public async upsertAnswer(id: string, userId: string, answer: { questionId: string; answerText: string; timeTakenSeconds?: number }): Promise<IMockInterview | null> {
    // 1. Remove the answer if it already exists to avoid duplicates
    await MockInterview.updateOne(
      { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
      { $pull: { answers: { questionId: answer.questionId } } }
    );
    
    // 2. Push the new answer
    return MockInterview.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
      { $push: { answers: answer } },
      { new: true }
    );
  }

  public async updateStatus(id: string, userId: string, status: IMockInterview['status']): Promise<IMockInterview | null> {
    return MockInterview.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
      { $set: { status } }, 
      { new: true }
    );
  }

  public async completeEvaluation(
    id: string, 
    userId: string,
    overallResult: IMockInterview['overallResult'], 
    evaluatedAnswers: any[],
    usage: IAIUsageMetrics
  ): Promise<IMockInterview | null> {
    return MockInterview.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
      { 
        $set: { 
          status: 'COMPLETED',
          overallResult,
          answers: evaluatedAnswers, // Replaces answers with the scored ones
          endTime: new Date()
        },
        $push: { usageTracking: usage }
      },
      { new: true }
    );
  }

  public async recordEvaluationFailure(id: string, userId: string, usage?: IAIUsageMetrics): Promise<IMockInterview | null> {
    const updateDef: any = { $set: { status: 'EVALUATION_FAILED' } };
    if (usage) {
      updateDef.$push = { usageTracking: usage };
    }
    return MockInterview.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) }, 
      updateDef, 
      { new: true }
    );
  }
}
