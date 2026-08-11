import mongoose, { Document, Schema } from 'mongoose';

export const AnalysisStatusEnum = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'] as const;

export interface IResumeAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  atsScore?: number;
  keywords?: {
    present: string[];
    missing: string[];
  };
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  status: typeof AnalysisStatusEnum[number];
  providerUsed: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    atsScore: { type: Number, min: 0, max: 100 },
    keywords: {
      present: [{ type: String }],
      missing: [{ type: String }]
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    status: { type: String, enum: Object.values(AnalysisStatusEnum), default: 'PENDING' },
    providerUsed: { type: String, required: true },
    errorMessage: { type: String }
  },
  { timestamps: true }
);

// Optimize for fetching the latest analysis for a given resume
resumeAnalysisSchema.index({ resumeId: 1, createdAt: -1 });

export const ResumeAnalysis = mongoose.model<IResumeAnalysis>('ResumeAnalysis', resumeAnalysisSchema);
