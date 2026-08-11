import { z } from 'zod';

export const subscriptionResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  plan: z.enum(['FREE', 'PRO']),
  status: z.enum(['ACTIVE', 'CANCELLED', 'EXPIRED']),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
});

export type ISubscriptionResponse = z.infer<typeof subscriptionResponseSchema>;
