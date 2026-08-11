import { z } from 'zod';
import { JOB_STATUSES, WORK_MODELS, PRIORITIES, SALARY_PERIODS, INTERVIEW_TYPES } from '../api/jobs.api';

const salarySchema = z.object({
  min: z.number().nonnegative().optional().or(z.literal('')),
  max: z.number().nonnegative().optional().or(z.literal('')),
  currency: z.string().max(3).optional(),
  period: z.enum(SALARY_PERIODS).optional(),
});

const interviewSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  type: z.enum(INTERVIEW_TYPES),
  notes: z.string().max(1000).optional(),
});

export const jobFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  jobUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().max(100).optional(),
  workModel: z.enum(WORK_MODELS).optional(),
  status: z.enum(JOB_STATUSES).default('SAVED'),
  priority: z.enum(PRIORITIES).default('MEDIUM'),
  salary: salarySchema.optional(),
  source: z.string().max(100).optional(),
  resumeId: z.string().optional(),
  notes: z.string().max(5000).optional(),
  appliedDate: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
  interviews: z.array(interviewSchema).optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
