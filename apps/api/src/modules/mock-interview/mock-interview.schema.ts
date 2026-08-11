import { z } from 'zod';
import mongoose from 'mongoose';
import { DifficultyEnum } from './mock-interview.model';

const objectIdValidator = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const startInterviewSchema = z.object({
  body: z.object({
    role: z.string().min(2).max(100),
    company: z.string().max(100).optional(),
    difficulty: z.enum(DifficultyEnum).default('MEDIUM'),
    durationMinutes: z.number().min(5).max(120).default(30),
    questionCount: z.number().min(1).max(20).default(5)
  }),
});

export const answerSubmissionSchema = z.object({
  params: z.object({
    id: objectIdValidator,
  }),
  body: z.object({
    questionId: z.string().uuid(),
    answerText: z.string().max(10000),
    timeTakenSeconds: z.number().min(0).optional(),
  }),
});

export const getInterviewParamsSchema = z.object({
  params: z.object({
    id: objectIdValidator,
  }),
});

export type StartInterviewInput = z.infer<typeof startInterviewSchema>['body'];
export type AnswerSubmissionInput = z.infer<typeof answerSubmissionSchema>['body'];
