import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

// Types matched to backend schema
export const JOB_STATUSES = ['SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW_1', 'INTERVIEW_2', 'INTERVIEW_3', 'OFFER_RECEIVED', 'REJECTED', 'WITHDRAWN'] as const;
export type JobStatus = typeof JOB_STATUSES[number];

export const WORK_MODELS = ['REMOTE', 'HYBRID', 'ONSITE'] as const;
export type WorkModel = typeof WORK_MODELS[number];

export const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'] as const;
export type Priority = typeof PRIORITIES[number];

export const SALARY_PERIODS = ['YEARLY', 'MONTHLY', 'HOURLY'] as const;
export type SalaryPeriod = typeof SALARY_PERIODS[number];

export const INTERVIEW_TYPES = ['PHONE', 'VIDEO', 'TECHNICAL', 'ONSITE', 'HR'] as const;
export type InterviewType = typeof INTERVIEW_TYPES[number];

export interface ISalary {
  min?: number;
  max?: number;
  currency?: string;
  period?: SalaryPeriod;
}

export interface IInterview {
  _id?: string;
  date: string;
  type: InterviewType;
  notes?: string;
}

export interface IJobApplication {
  _id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  workModel?: WorkModel;
  status: JobStatus;
  priority: Priority;
  salary?: ISalary;
  source?: string;
  resumeId?: string;
  notes?: string;
  appliedDate?: string;
  nextFollowUpDate?: string;
  interviews?: IInterview[];
  createdAt: string;
  updatedAt: string;
}

export interface GetJobsQuery {
  page?: number;
  limit?: number;
  status?: JobStatus | '';
  search?: string;
  sortBy?: 'appliedDate' | 'createdAt' | 'nextFollowUpDate' | 'companyName';
  sortOrder?: 'asc' | 'desc';
  priority?: Priority | '';
}

export interface PaginatedJobsResponse {
  items: IJobApplication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type CreateJobInput = Partial<IJobApplication> & { companyName: string; jobTitle: string };
export type UpdateJobInput = Partial<IJobApplication>;

// Hooks
export const useGetJobs = (query: GetJobsQuery) => {
  return useQuery({
    queryKey: ['jobs', query],
    queryFn: async (): Promise<PaginatedJobsResponse> => {
      const response = await apiClient.get('/jobs', { params: query });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetJobStats = () => {
  return useQuery({
    queryKey: ['jobs', 'stats'],
    queryFn: async (): Promise<Record<string, number>> => {
      const response = await apiClient.get('/jobs/stats');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateJobInput) => {
      const response = await apiClient.post('/jobs', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      // Invalidate dashboard stats as well
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateJobInput }) => {
      const response = await apiClient.patch(`/jobs/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
    },
  });
};
