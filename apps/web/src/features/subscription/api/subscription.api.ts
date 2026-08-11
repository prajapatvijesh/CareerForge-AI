import { apiClient } from '../../../lib/axios';

export interface ISubscription {
  id: string;
  userId: string;
  plan: 'FREE' | 'PRO';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE' | 'TRIALING' | 'INCOMPLETE';
  provider?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface IPlanLimits {
  maxResumes: number;
  maxJobApplications: number;
  resumeAnalysisPerMonth: number;
  mockInterviewsPerMonth: number;
  aiRequestsPerMonth: number;
}

export interface IUsage {
  resumeAnalysis: number;
  mockInterviews: number;
  aiRequests: number;
}

export interface ISubscriptionResponse {
  subscription: ISubscription;
  limits: IPlanLimits;
  usage: IUsage;
}

export const subscriptionApi = {
  getCurrent: async (): Promise<ISubscriptionResponse> => {
    const { data } = await apiClient.get('/subscription');
    return data;
  },

  upgrade: async (): Promise<any> => {
    // V1 legacy
    const { data } = await apiClient.post('/subscription/upgrade');
    return data;
  },

  checkout: async (): Promise<{ subscriptionId: string; keyId: string }> => {
    const { data } = await apiClient.post('/billing/checkout');
    return data.data;
  },

  verifyCheckout: async (payload: { razorpay_payment_id: string; razorpay_subscription_id?: string; razorpay_signature: string }): Promise<any> => {
    const { data } = await apiClient.post('/billing/verify', payload);
    return data;
  },

  cancelSubscription: async (): Promise<any> => {
    const { data } = await apiClient.post('/billing/cancel');
    return data.data;
  },

  getPaymentHistory: async (): Promise<any[]> => {
    const { data } = await apiClient.get('/billing/history');
    return data.data;
  }
};
