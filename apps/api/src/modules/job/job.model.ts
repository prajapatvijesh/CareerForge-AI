import mongoose, { Document, Schema } from 'mongoose';

export const JobStatusEnum = ['SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW_1', 'INTERVIEW_2', 'INTERVIEW_3', 'OFFER_RECEIVED', 'REJECTED', 'WITHDRAWN'] as const;
export const WorkModelEnum = ['REMOTE', 'HYBRID', 'ONSITE'] as const;
export const PriorityEnum = ['HIGH', 'MEDIUM', 'LOW'] as const;
export const SalaryPeriodEnum = ['YEARLY', 'MONTHLY', 'HOURLY'] as const;
export const InterviewTypeEnum = ['PHONE', 'VIDEO', 'TECHNICAL', 'ONSITE', 'HR'] as const;

export interface ISalary {
  min?: number;
  max?: number;
  currency?: string;
  period?: typeof SalaryPeriodEnum[number];
}

export interface IInterview {
  date: Date;
  type: typeof InterviewTypeEnum[number];
  notes?: string;
}

export interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  workModel?: typeof WorkModelEnum[number];
  status: typeof JobStatusEnum[number];
  priority: typeof PriorityEnum[number];
  salary?: ISalary;
  source?: string;
  resumeId?: mongoose.Types.ObjectId;
  notes?: string;
  appliedDate?: Date;
  nextFollowUpDate?: Date;
  interviews?: IInterview[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const salarySchema = new Schema<ISalary>({
  min: { type: Number },
  max: { type: Number },
  currency: { type: String, default: 'USD' },
  period: { type: String, enum: Object.values(SalaryPeriodEnum), default: 'YEARLY' }
}, { _id: false });

const interviewSchema = new Schema<IInterview>({
  date: { type: Date, required: true },
  type: { type: String, enum: Object.values(InterviewTypeEnum), required: true },
  notes: { type: String }
});

const jobApplicationSchema = new Schema<IJobApplication>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  companyName: { type: String, required: true, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  jobUrl: { type: String, trim: true },
  location: { type: String, trim: true },
  workModel: { type: String, enum: Object.values(WorkModelEnum) },
  status: { type: String, enum: Object.values(JobStatusEnum), default: 'SAVED', index: true },
  priority: { type: String, enum: Object.values(PriorityEnum), default: 'MEDIUM' },
  salary: { type: salarySchema },
  source: { type: String, trim: true },
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
  notes: { type: String },
  appliedDate: { type: Date },
  nextFollowUpDate: { type: Date },
  interviews: [interviewSchema],
  isDeleted: { type: Boolean, default: false, index: true },
}, { timestamps: true });

// Compound index for optimized querying by user and status
jobApplicationSchema.index({ userId: 1, status: 1, isDeleted: 1 });
// Compound index for sorting
jobApplicationSchema.index({ userId: 1, appliedDate: -1 });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
