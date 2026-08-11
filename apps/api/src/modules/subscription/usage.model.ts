import mongoose, { Document, Schema } from 'mongoose';

export type AIFeatureType = 'RESUME_ANALYSIS' | 'MOCK_INTERVIEW' | 'OTHER_AI';

// The aggregate tracker for atomic counter enforcement
export interface IMonthlyUsage extends Document {
  userId: mongoose.Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  usage: {
    resumeAnalysis: number;
    mockInterviews: number;
    aiRequests: number;
    resumesCreated: number;
    jobApplications: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const monthlyUsageSchema = new Schema<IMonthlyUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    usage: {
      resumeAnalysis: { type: Number, default: 0 },
      mockInterviews: { type: Number, default: 0 },
      aiRequests: { type: Number, default: 0 },
      resumesCreated: { type: Number, default: 0 },
      jobApplications: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

// We need an index to easily query by user and the current period
monthlyUsageSchema.index({ userId: 1, periodStart: 1 }, { unique: true });

export const MonthlyUsage = mongoose.model<IMonthlyUsage>('MonthlyUsage', monthlyUsageSchema);


// The detailed telemetry tracker
export interface IAIUsageTelemetry extends Document {
  userId: mongoose.Types.ObjectId;
  feature: AIFeatureType;
  provider: string;
  aiModel: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  success: boolean;
  errorMessage?: string;
  createdAt: Date;
}

const aiUsageTelemetrySchema = new Schema<IAIUsageTelemetry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    feature: { type: String, required: true },
    provider: { type: String, required: true },
    aiModel: { type: String, required: true },
    promptTokens: { type: Number, required: true },
    completionTokens: { type: Number, required: true },
    totalTokens: { type: Number, required: true },
    estimatedCostUsd: { type: Number, required: true },
    latencyMs: { type: Number, required: true },
    success: { type: Boolean, required: true, default: true },
    errorMessage: { type: String }
  },
  { timestamps: { updatedAt: false } }
);

aiUsageTelemetrySchema.index({ feature: 1 });
aiUsageTelemetrySchema.index({ createdAt: -1 });

export const AIUsageTelemetry = mongoose.model<IAIUsageTelemetry>('AIUsageTelemetry', aiUsageTelemetrySchema);
