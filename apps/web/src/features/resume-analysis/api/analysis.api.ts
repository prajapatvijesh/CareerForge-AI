import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

// Matches the backend IResumeAnalysis schema
export interface IResumeAnalysis {
  _id: string;
  userId: string;
  resumeId: string;
  atsScore?: number;
  keywords?: {
    present: string[];
    missing: string[];
  };
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  providerUsed: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TriggerAnalysisInput {
  resumeId: string;
  jobDescription?: string;
  provider?: 'gemini' | 'openai';
}

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

export const useTriggerAnalysis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TriggerAnalysisInput): Promise<IResumeAnalysis> => {
      const response = await apiClient.post('/resume-analysis', data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate to trigger a fresh fetch
      queryClient.invalidateQueries({ queryKey: ['resume-analysis', variables.resumeId] });
      queryClient.invalidateQueries({ queryKey: ['resume-analysis-history', variables.resumeId] });
    },
  });
};

export const useGetLatestAnalysis = (resumeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['resume-analysis', resumeId],
    queryFn: async (): Promise<IResumeAnalysis> => {
      const response = await apiClient.get(`/resume-analysis/${resumeId}`);
      return response.data.data;
    },
    enabled: !!resumeId && enabled,
    // If status is PENDING or PROCESSING, poll every 3 seconds
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'PENDING' || data.status === 'PROCESSING')) {
        return 3000;
      }
      return false;
    },
  });
};

export const useGetAnalysisHistory = (resumeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['resume-analysis-history', resumeId],
    queryFn: async (): Promise<IResumeAnalysis[]> => {
      const response = await apiClient.get(`/resume-analysis/${resumeId}/history`);
      return response.data.data;
    },
    enabled: !!resumeId && enabled,
  });
};
