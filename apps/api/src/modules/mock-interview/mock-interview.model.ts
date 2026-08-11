import mongoose, { Document, Schema } from 'mongoose';
import { IAIUsageMetrics } from './ai/ai-provider.interface';

export const InterviewStatusEnum = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'EVALUATION_FAILED'] as const;
export const DifficultyEnum = ['EASY', 'MEDIUM', 'HARD'] as const;
export const QuestionTypeEnum = ['TECHNICAL', 'BEHAVIORAL'] as const;

export interface IMockInterview extends Document {
  userId: mongoose.Types.ObjectId;
  config: {
    role: string;
    company?: string;
    difficulty: typeof DifficultyEnum[number];
    durationMinutes: number;
    questionCount: number;
  };
  status: typeof InterviewStatusEnum[number];
  questions: {
    id: string; // UUID for deterministic matching
    text: string;
    type: typeof QuestionTypeEnum[number];
  }[];
  answers: {
    questionId: string;
    answerText: string;
    timeTakenSeconds?: number;
    feedback?: string;
    score?: number; // 0-10
  }[];
  overallResult?: {
    totalScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  usageTracking?: IAIUsageMetrics[]; // Array to track usage across multiple AI calls (start, finish, retries)
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const mockInterviewSchema = new Schema<IMockInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    config: {
      role: { type: String, required: true },
      company: { type: String },
      difficulty: { type: String, enum: Object.values(DifficultyEnum), required: true },
      durationMinutes: { type: Number, required: true, default: 30 },
      questionCount: { type: Number, required: true, default: 5 }
    },
    status: { type: String, enum: Object.values(InterviewStatusEnum), default: 'PENDING' },
    questions: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        type: { type: String, enum: Object.values(QuestionTypeEnum), required: true }
      }
    ],
    answers: [
      {
        questionId: { type: String, required: true },
        answerText: { type: String, required: true },
        timeTakenSeconds: { type: Number },
        feedback: { type: String },
        score: { type: Number, min: 0, max: 10 }
      }
    ],
    overallResult: {
      totalScore: { type: Number, min: 0, max: 100 },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }]
    },
    usageTracking: [
      {
        provider: String,
        model: String,
        promptTokens: Number,
        completionTokens: Number,
        totalTokens: Number,
        latencyMs: Number,
        estimatedCostUsd: Number
      }
    ],
    startTime: { type: Date },
    endTime: { type: Date }
  },
  { timestamps: true }
);

mockInterviewSchema.index({ userId: 1, createdAt: -1 });

export const MockInterview = mongoose.model<IMockInterview>('MockInterview', mockInterviewSchema);
