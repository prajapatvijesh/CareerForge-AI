import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface IMockInterview {
  _id: string;
  userId: string;
  config: {
    role: string;
    company?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    durationMinutes: number;
    questionCount: number;
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'EVALUATION_FAILED';
  questions: {
    id: string;
    text: string;
    type: 'TECHNICAL' | 'BEHAVIORAL';
  }[];
  answers: {
    questionId: string;
    answerText: string;
    timeTakenSeconds?: number;
    feedback?: string;
    score?: number;
  }[];
  overallResult?: {
    totalScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartInterviewInput {
  role: string;
  company?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  durationMinutes?: number;
  questionCount?: number;
}

export interface AnswerSubmissionInput {
  questionId: string;
  answerText: string;
  timeTakenSeconds?: number;
}

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

export const useStartInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StartInterviewInput): Promise<IMockInterview> => {
      const response = await apiClient.post('/mock-interview/start', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mock-interview-history'] });
    },
  });
};

export const useGetInterview = (id: string | undefined, options?: { enabled?: boolean; refetchInterval?: number | ((query: any) => number | false) }) => {
  return useQuery({
    queryKey: ['mock-interview', id],
    queryFn: async (): Promise<IMockInterview> => {
      const response = await apiClient.get(`/mock-interview/${id}`);
      return response.data.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
  });
};

export const useSubmitAnswer = (interviewId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnswerSubmissionInput) => {
      const response = await apiClient.post(`/mock-interview/${interviewId}/answer`, data);
      return response.data;
    },
    onMutate: async (newAnswer) => {
      // Optimistic update for autosave responsiveness
      await queryClient.cancelQueries({ queryKey: ['mock-interview', interviewId] });
      const previousData = queryClient.getQueryData<IMockInterview>(['mock-interview', interviewId]);
      
      if (previousData) {
        queryClient.setQueryData<IMockInterview>(['mock-interview', interviewId], (old) => {
          if (!old) return old;
          // Filter out the old answer and push the new one
          const filteredAnswers = old.answers.filter(a => a.questionId !== newAnswer.questionId);
          return {
            ...old,
            answers: [...filteredAnswers, { ...newAnswer } as any]
          };
        });
      }
      return { previousData };
    },
    onError: (_err, _newAnswer, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['mock-interview', interviewId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['mock-interview', interviewId] });
    },
  });
};

export const useFinishInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<IMockInterview> => {
      const response = await apiClient.post(`/mock-interview/${id}/finish`);
      return response.data.data;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['mock-interview', id] });
      queryClient.invalidateQueries({ queryKey: ['mock-interview-history'] });
    },
  });
};

export const useGetInterviewHistory = () => {
  return useQuery({
    queryKey: ['mock-interview-history'],
    queryFn: async (): Promise<IMockInterview[]> => {
      const response = await apiClient.get('/mock-interview/history');
      return response.data.data;
    }
  });
};
