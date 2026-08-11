import { z } from 'zod';
import { JobStatusEnum, WorkModelEnum, PriorityEnum, SalaryPeriodEnum, InterviewTypeEnum } from './job.model';
import mongoose from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectIdValidator = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const salarySchema = z.object({
  min: z.number().nonnegative().optional(),
  max: z.number().nonnegative().optional(),
  currency: z.string().max(3).optional(),
  period: z.enum(SalaryPeriodEnum as any).optional(),
}).refine(data => {
  if (data.min !== undefined && data.max !== undefined) {
    return data.max >= data.min;
  }
  return true;
}, { message: "Maximum salary must be greater than or equal to minimum salary" });

const interviewSchema = z.object({
  date: z.string().datetime(),
  type: z.enum(InterviewTypeEnum as any),
  notes: z.string().max(1000).optional(),
});

export const createJobSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required').max(100),
    jobTitle: z.string().min(1, 'Job title is required').max(100),
    jobUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    location: z.string().max(100).optional(),
    workModel: z.enum(WorkModelEnum as any).optional(),
    status: z.enum(JobStatusEnum as any).default('SAVED'),
    priority: z.enum(PriorityEnum as any).default('MEDIUM'),
    salary: salarySchema.optional(),
    source: z.string().max(100).optional(),
    resumeId: objectIdValidator.optional(),
    notes: z.string().max(5000).optional(),
    appliedDate: z.string().datetime().optional(),
    nextFollowUpDate: z.string().datetime().optional(),
    interviews: z.array(interviewSchema).optional(),
  }),
});

export const updateJobSchema = z.object({
  params: z.object({
    id: objectIdValidator,
  }),
  body: createJobSchema.shape.body.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  }),
});

export const getJobsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
    status: z.enum(JobStatusEnum as any).optional(),
    search: z.string().max(100).optional(),
    sortBy: z.enum(['appliedDate', 'createdAt', 'nextFollowUpDate', 'companyName']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    priority: z.enum(PriorityEnum as any).optional(),
  })
});

export type CreateJobInput = z.infer<typeof createJobSchema>['body'];
export type UpdateJobInput = z.infer<typeof updateJobSchema>['body'];
export type GetJobsQuery = z.infer<typeof getJobsQuerySchema>['query'];
