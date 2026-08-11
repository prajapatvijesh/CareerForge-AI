import { MonthlyUsage, AIUsageTelemetry, AIFeatureType, IMonthlyUsage } from './usage.model';
import mongoose from 'mongoose';

export class UsageService {
  /**
   * Atomically checks the current usage against the plan limit and increments if allowed.
   * Conceptually: findOneAndUpdate({ userId, periodStart, usage[feature] < limit }, { $inc: { usage[feature]: 1 } })
   * 
   * @returns The updated document if successful, or null if the limit was reached.
   */
  async checkAndReserveLimit(
    userId: string,
    feature: AIFeatureType,
    limit: number,
    periodStart: Date,
    periodEnd: Date
  ): Promise<IMonthlyUsage | null> {
    const userObjId = new mongoose.Types.ObjectId(userId);
    
    // First, ensure the monthly usage document exists for this period
    // We use an upsert with $setOnInsert to initialize it safely
    await MonthlyUsage.updateOne(
      { userId: userObjId, periodStart },
      {
        $setOnInsert: {
          userId: userObjId,
          periodStart,
          periodEnd,
          'usage.resumeAnalysis': 0,
          'usage.mockInterviews': 0,
          'usage.aiRequests': 0,
          'usage.resumesCreated': 0,
          'usage.jobApplications': 0,
        }
      },
      { upsert: true }
    );

    // Determine the field path to increment based on the feature
    let fieldPath = '';
    if (feature === 'RESUME_ANALYSIS') fieldPath = 'usage.resumeAnalysis';
    else if (feature === 'MOCK_INTERVIEW') fieldPath = 'usage.mockInterviews';
    else if (feature === 'OTHER_AI') fieldPath = 'usage.aiRequests';
    else throw new Error('Unknown feature type');

    // The boundary condition ensures we only increment if we are strictly below the limit
    const query = {
      userId: userObjId,
      periodStart,
      [fieldPath]: { $lt: limit }
    };

    const update = {
      $inc: { [fieldPath]: 1 }
    };

    // If this returns null, it means the query didn't match (because current usage >= limit)
    const result = await MonthlyUsage.findOneAndUpdate(query, update, { new: true });
    
    return result;
  }

  /**
   * Records the detailed telemetry of a completed or failed AI request.
   * This does NOT increment the monthly quota (which is handled by checkAndReserveLimit).
   */
  async recordAIUsage(data: {
    userId: string;
    feature: AIFeatureType;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
    latencyMs: number;
    success: boolean;
    errorMessage?: string;
  }): Promise<void> {
    await AIUsageTelemetry.create({
      ...data,
      aiModel: data.model,
      userId: new mongoose.Types.ObjectId(data.userId)
    });
  }

  /**
   * Fetches the current monthly usage summary for a user
   */
  async getUsageSummary(userId: string, periodStart: Date): Promise<IMonthlyUsage | null> {
    return MonthlyUsage.findOne({ 
      userId: new mongoose.Types.ObjectId(userId), 
      periodStart 
    });
  }
}
