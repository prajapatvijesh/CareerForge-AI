import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdValidator = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const triggerAnalysisSchema = z.object({
  body: z.object({
    resumeId: objectIdValidator,
    jobDescription: z.string().max(10000).optional(),
    provider: z.enum(['gemini', 'openai']).default('gemini')
  }),
});

export const getAnalysisParamsSchema = z.object({
  params: z.object({
    resumeId: objectIdValidator,
  }),
});

export type TriggerAnalysisInput = z.infer<typeof triggerAnalysisSchema>['body'];
